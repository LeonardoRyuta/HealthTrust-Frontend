import { getPubKey } from './contract';
import { ethers } from 'ethers';
import * as eciesjs from 'ecies-geth';

export async function encryptData(plaintext: string, publicKeyHex: string): Promise<string> {
    try {
    // Normalize the input data to string
    const dataString = typeof plaintext === 'string' 
      ? plaintext 
      : JSON.stringify(plaintext);
    
    // Normalize the public key (ensure it has 0x prefix)
    const normalizedPubKey = publicKeyHex.startsWith('0x') 
      ? publicKeyHex 
      : `0x${publicKeyHex}`;
    
    // Convert the data to a Buffer
    const dataBuffer = Buffer.from(dataString);
    
    // Convert public key from hex to Buffer
    const pubKeyBuffer = Buffer.from(normalizedPubKey.slice(2), 'hex');
    
    // Encrypt the data
    const encryptedBuffer = await eciesjs.encrypt(pubKeyBuffer, dataBuffer);
    
    // Return the encrypted data as a hex string
    return `0x${encryptedBuffer.toString('hex')}`;
  } catch (error: any) {
    throw new Error(`Encryption failed: ${error.message}`);
  }
}

export async function encryptForBackend(message: string): Promise<string> {
  try {
    // Get the public key from the smart contract
    const pubKey = await getPubKey();
    
    // Encrypt the data
    const encryptedData = await encryptData(message, pubKey);
    console.log('Encrypted data:', encryptedData);
    
    return encryptedData;
    
    // This encrypted data can now be sent to your backend
    // and decrypted with the decryptData function in your Go code
  } catch (error) {
    console.error('Encryption failed:', error);
    throw error;
  }
}