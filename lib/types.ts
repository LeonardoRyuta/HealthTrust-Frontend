export interface Document {
  id: string
  name: string
  type: string
  size: string
  date: string
  uploadedBy: string
  price: number
  description: string
  category: string
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
