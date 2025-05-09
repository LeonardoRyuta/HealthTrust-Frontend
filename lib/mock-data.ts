import type { Document, Transaction, User } from "./types"

export const mockDocuments: Document[] = [
  {
    id: "doc-1",
    name: "Diabetes Patient Data 2024",
    type: "csv",
    size: "2.4 MB",
    date: "2025-05-01T10:30:00",
    uploadedBy: "Dr. Alex Johnson",
    price: 49.99,
    description:
      "Anonymized dataset of 500 diabetes patients including blood glucose levels, medication history, and lifestyle factors tracked over 6 months.",
    category: "Diabetes",
    sampleSize: 500,
    timeframe: "6 months",
  },
  {
    id: "doc-2",
    name: "Heart Rate Variability Study",
    type: "xlsx",
    size: "1.8 MB",
    date: "2025-05-03T14:15:00",
    uploadedBy: "Dr. Sarah Williams",
    price: 79.99,
    description:
      "Comprehensive heart rate variability data from 300 participants during rest and exercise, including demographic information.",
    category: "Cardiology",
    sampleSize: 300,
    timeframe: "3 months",
  },
  {
    id: "doc-3",
    name: "Sleep Pattern Analysis",
    type: "json",
    size: "548 KB",
    date: "2025-05-05T09:45:00",
    uploadedBy: "Dr. Michael Brown",
    price: 29.99,
    description:
      "Sleep tracking data from wearable devices, including sleep stages, interruptions, and quality metrics from diverse age groups.",
    category: "Sleep Medicine",
    sampleSize: 200,
    timeframe: "2 months",
  },
  {
    id: "doc-4",
    name: "Brain MRI Scans Collection",
    type: "zip",
    size: "3.2 GB",
    date: "2025-05-06T16:20:00",
    uploadedBy: "Dr. Emily Davis",
    price: 149.99,
    description:
      "High-resolution anonymized brain MRI scans from 100 patients with various neurological conditions and 50 healthy controls.",
    category: "Neurology",
    sampleSize: 150,
    timeframe: "1 year",
  },
  {
    id: "doc-5",
    name: "COVID-19 Recovery Patterns",
    type: "pdf",
    size: "5.7 MB",
    date: "2025-05-07T11:10:00",
    uploadedBy: "Dr. David Wilson",
    price: 89.99,
    description:
      "Longitudinal study of recovery patterns in 250 COVID-19 patients, including symptom progression, treatment responses, and long-term effects.",
    category: "Infectious Disease",
    sampleSize: 250,
    timeframe: "18 months",
  },
  {
    id: "doc-6",
    name: "Nutrition and Metabolism Dataset",
    type: "csv",
    size: "1.1 MB",
    date: "2025-05-08T13:40:00",
    uploadedBy: "Dr. Jessica Taylor",
    price: 59.99,
    description:
      "Detailed nutritional intake and metabolic markers from 400 participants following different dietary patterns, with weekly measurements.",
    category: "Nutrition",
    sampleSize: 400,
    timeframe: "4 months",
  },
]

export const mockTransactions: Transaction[] = [
  {
    id: "trans-1",
    date: "2025-05-02T14:30:00",
    documentId: "doc-2",
    documentName: "Heart Rate Variability Study",
    amount: 79.99,
    type: "purchase",
  },
  {
    id: "trans-2",
    date: "2025-05-04T09:15:00",
    documentId: "doc-3",
    documentName: "Sleep Pattern Analysis",
    amount: 29.99,
    type: "purchase",
  },
  {
    id: "trans-3",
    date: "2025-05-05T16:45:00",
    documentId: "doc-1",
    documentName: "Diabetes Patient Data 2024",
    amount: 49.99,
    type: "sale",
  },
  {
    id: "trans-4",
    date: "2025-05-07T11:20:00",
    documentId: "doc-6",
    documentName: "Nutrition and Metabolism Dataset",
    amount: 59.99,
    type: "sale",
  },
]

export const mockUser: User = {
  id: "user-1",
  name: "Dr. Jane Smith",
  balance: 109.98, // Sum of sales minus purchases
  transactions: mockTransactions,
}

export const myUploads: Document[] = [
  mockDocuments[0], // Diabetes Patient Data
  mockDocuments[5], // Nutrition and Metabolism Dataset
]

export const purchasedDocuments: Document[] = [
  mockDocuments[1], // Heart Rate Variability Study
  mockDocuments[2], // Sleep Pattern Analysis
]
