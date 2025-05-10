export interface Dataset {
  datasetId: string
  ipfsHash: string
  gender: string
  ageRange: string
  bmi: string
  chronicConditions: string[]
  SampleSize: string
  price: number
  tokenAddress: string
  description: string
  sampleSize: number
  timeframe: string
}

export interface Transaction {
  id: string
  date: string
  documentId: string
  documentName: string
  amount: number
  type: "purchase" | "sale"
}

export interface User {
  id: string
  name: string
  balance: number
  transactions: Transaction[]
}
