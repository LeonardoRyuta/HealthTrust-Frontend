import { ethers } from 'ethers';
import abi from './abi.json';
import { AGE_RANGE_MAP, AGE_RANGE_MAP_INVERSE, GENDER_MAP_INVERSE, CONDITION_MAP_INVERSE } from '@/components/constant_mappings';
import { Console } from 'console';

// Extend window type to include ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}

const CONTRACT_ADDRESS = "0x50739936402555eE6034c09FA77e007036fD23A1";

export async function getPubKey() {
  if (!window.ethereum) throw new Error("MetaMask not found");

  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);

    const pubKey = await contract.getPubKey();

    return pubKey;
  } catch (error) {
    console.error("Error getting public key:", error);
    throw error;
  }
}

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

export async function getAllDatasets() {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);
  
    const datasetCount = await contract.datasetCount();
    console.log("Total datasets:", datasetCount);

    let datasets = [];
    let datasetObjs = [];
  
    for (let i = 0; i < Number(datasetCount); i++) {
      console.log("Fetching dataset with ID:", i);
      const dataset = await contract.getDataset(i);

      console.log("Dataset details:", dataset);
      console.log("Dataset details:", dataset[0]);

      const datasetObj = {
        ipfs: dataset[0],
        gender: Number(dataset[1]),
        ageRange: Number(dataset[2]),
        bmiCategory: Number(dataset[3]),
        chronicConditions: dataset[4].map((condition: any) => Number(condition)),
        owner: dataset[6],
        isActive: dataset[7],
      } // 5 is a list of things that arent needed and we forgor to remove it so we are removing it now

      datasetObjs.push(datasetObj);
  
      datasets.push({
        id: i,
        name: `Dataset #${i}`,
        description: `Uploaded by ${datasetObj.owner}`,
        gender: GENDER_MAP_INVERSE[datasetObj.gender as keyof typeof GENDER_MAP_INVERSE],
        ageRange: AGE_RANGE_MAP_INVERSE[datasetObj.ageRange as keyof typeof AGE_RANGE_MAP_INVERSE],
        chronicConditions: datasetObj.chronicConditions.map((condition: any) => CONDITION_MAP_INVERSE[condition as keyof typeof CONDITION_MAP_INVERSE]),
        bmiCategory: datasetObj.bmiCategory,
        isActive: datasetObj.isActive,
        owner: datasetObj.owner,
      });
    }

    console.log("Fetched datasets:", datasetObjs);  
    console.log("Formatted datasets:", datasets);
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
    const receipt = await tx.wait();

    const event = receipt.logs.find((log: any) =>
      log.address?.toLowerCase() === contract.address.toLowerCase()
    );

    console.log("Raw logs:", receipt.logs);

    return tx;
  } catch (error) {
    console.error("Error interacting with contract:", error);
    throw error;
  }
}
  