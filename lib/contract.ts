import { ethers } from 'ethers';
import abi from './abi.json';
import { AGE_RANGE_MAP } from '@/components/constant_mappings';
import { Console } from 'console';

// Extend window type to include ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}

const CONTRACT_ADDRESS = "0xBb18E81753179d29071772DcEf8f8B2dcd368184";

export async function submitDatasetToContract(
  ipfsHash: string,
  metadata: {
    agerange: string,
    gender: string,
    conditions: string,
    bmi: string,
    price: string,
    description: string,
    sampleSize: string,
    timeframe: string,
    healthMetricTypes: number
  }
) {
  if (!window.ethereum) throw new Error("MetaMask not found");

  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);

    const priceInWei = ethers.parseEther(metadata.price);

    console.log('Submitting dataset with params:', {
      ipfsHash,
      gender: parseInt(metadata.gender),
      agerange: parseInt(metadata.agerange),
      bmi: parseInt(metadata.bmi),
      conditions: metadata.conditions.split(',').map(c => parseInt(c.trim())),
      healthMetricTypes: [metadata.healthMetricTypes],
    });

    const tx = await contract.submitDataset(
      ipfsHash,
      parseInt(metadata.gender),
      parseInt(metadata.agerange),
      parseInt(metadata.bmi),
      metadata.conditions.split(',').map(c => parseInt(c.trim())),
      [metadata.healthMetricTypes]
    );

    console.log("Transaction sent:", tx);

    return tx;
  } catch (error) {
    console.error("Error interacting with contract:", error);
    throw error;
  }
}

export async function getAllDatasets(): Promise<Document[]> {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);
  
    const datasetCount = await contract.datasetCount();
    console.log("Total datasets:", datasetCount);

    const datasets: Document[] = [];
  
    for (let i = 0; i < Number(datasetCount); i++) {
      const dataset = await contract.datasets(i);
  
      // Skip inactive datasets
      if (!dataset.isActive) continue;
  
      datasets.push({
        id: i,
        name: `Dataset #${i}`,
        description: `Uploaded by ${dataset.owner}`,
        price: ethers.formatEther(dataset.price || "0"),
        size: `${Math.floor(Math.random() * 500 + 100)} KB`,
        category: AGE_RANGE_MAP[dataset.ageRange] ?? "Unknown",
        type: "json",
        sampleSize: dataset.sampleSize ?? 100,
        timeframe: "6 months",
        date: Date.now() / 1000, // or replace with on-chain timestamp if you store it
        uploadedBy: dataset.owner,
      });
    }
  
    return datasets;
  }


export async function makePurchase(datasetId: string, price: string, tokenAddress: string) {
  if (!window.ethereum) throw new Error("MetaMask not found");

  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);

    // convert datasetId and price to BigInt
    const datasetIdBN = BigInt(datasetId);
    const priceInWei = price; // assumes 18 decimals

    console.log("Calling orderRequest with:", {
      datasetId: datasetIdBN.toString(),
      priceInWei: priceInWei.toString(),
      tokenAddress
    });

    const tx = await contract.orderRequest(datasetIdBN, priceInWei, tokenAddress);
    console.log("Transaction details:", tx);

    const receipt = await tx.wait(); // Waits for confirmation
    

    return tx;
  } catch (error) {
    console.error("Error interacting with contract:", error);
    throw error;
  }
}
  