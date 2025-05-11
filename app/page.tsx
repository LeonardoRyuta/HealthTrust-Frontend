"use client"

import { useState, useEffect } from "react"
import DocumentList from "@/components/dataset-list"
import { getAllDatasets, getPubKey, makePurchase } from "@/lib/contract"
import type { Dataset } from "@/lib/types"
import { useToast } from "@/components/ui/use-toast"
import DatasetList from "@/components/dataset-list"

export default function Home() {
  const { toast } = useToast()
  const [dataset, setDatasets] = useState([])

  useEffect(() => {

    console.log("Rendered Datasets:", dataset)

    async function fetchDocuments() {
      try {
        const result = await getAllDatasets()

        // Defensive fallback if it's an object instead of an array
        const cleaned = Array.isArray(result) ? result : Object.values(result)
        console.log("Fetched cleaned:", cleaned)

        setDatasets(cleaned)

      } catch (err) {
        console.error("Failed to fetch datasets", err)
        setDatasets([])
      }
    }

    fetchDocuments()
    //console.log("Datasets:", dataset)

  }, [])

  useEffect(() => {
    //console.log("Fetched datasets:", dataset)
  }, [dataset])

  const handleBuyDocument = async (dataset: Dataset) => {

    dataset.price = 4 // Ensure proper integer handling
    dataset.tokenAddress = "0x96B327504934Be375d5EC1F88a8B2Bba0FaC63C7"
    console.log("Buying dataset:", dataset)
    console.log("Dataset ID:", dataset.ipfsHash)
    console.log("Dataset price:", dataset.price)
    console.log("Dataset token address:", dataset.tokenAddress)
    console.log(dataset,"AAAAAA")

    const orderId = await makePurchase(dataset.dataEntryId, dataset.price.toString(), dataset.tokenAddress)

    console.log("Order ID post request:", orderId)
  }

  return (
    <div className="container py-8">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Health Data Marketplace</h1>
        <p className="text-muted-foreground">
          Browse and purchase anonymized health datasets from trusted providers.
        </p>
      </div>
      <DatasetList datasets={dataset} showBuyButton={true} onBuy={handleBuyDocument} />
    </div>

  )
}
