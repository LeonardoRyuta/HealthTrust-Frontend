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

const CONTRACT_ADDRESS = "0x672ED98D0f91B7CFDF44F08998fFCD0c4403B854";

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
    timeframe: string,}
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
    });

    const tx = await contract.submitDataset(
      ipfsHash,
      parseInt(metadata.gender),
      parseInt(metadata.agerange),
      parseInt(metadata.bmi),
      metadata.conditions.split(',').map(c => parseInt(c.trim())),
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
  
    const datasetCount = await contract.getDatasetCount();
    console.log("Total datasets:", datasetCount);

      
        // 1) Fetch the raw Proxy<Result>[] 
    const dataEntries = await contract.getAllDatasets();

    // 2) Map each Proxy<Result> → a plain JS object
    const plainEntries = dataEntries.map((entry: any) => {
      // entry is a Proxy that behaves like an array
      const [
        rawId,
        ipfsHash,
        rawGender,
        rawAgeRange,
        rawBmiCategory,
        rawChronic,   // this is itself a Proxy(Result) for the uint8[] field
        owner,
        active
      ] = [...entry]; // spread into a real array

      return {
        dataEntryId: Number(rawId as bigint),
        ipfsHash:     ipfsHash as string,
        gender:       Number(rawGender as bigint),
        ageRange:     Number(rawAgeRange as bigint),
        bmiCategory:  Number(rawBmiCategory as bigint),
        chronicConditions: Array.from(rawChronic as bigint[]).map((n) =>
          Number(n)
        ),
        owner:  owner as string,
        isActive: active as boolean,
      };
    });

    console.log(plainEntries);
    return plainEntries;

  }


export async function makePurchase(datasetId: string, price: string, tokenAddress: string) {
  if (!window.ethereum) throw new Error("MetaMask not found");

  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);

    // convert datasetId and price to BigInt
    //const datasetIdBN = BigInt(datasetId);
    const priceInWei = price; // assumes 18 decimals

    console.log("Calling orderRequest with:", {
      datasetId: datasetId.toString(),
      priceInWei: priceInWei.toString(),
      tokenAddress
    });

    const tx = await contract.orderRequest(datasetId, priceInWei, tokenAddress);
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
function exit() {
  console.log("Exiting process...");
  if (typeof window !== "undefined" && window.close) {
    window.close(); // Close the browser tab if possible
  } else {
    console.warn("Window close is not supported in this environment.");
  }
}
