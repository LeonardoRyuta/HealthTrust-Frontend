"use client"

import { useState } from "react"
import DocumentList from "@/components/document-list"
import { mockDocuments } from "@/lib/mock-data"
import type { Document } from "@/lib/types"
import { useToast } from "@/components/ui/use-toast"

export default function Home() {
  const { toast } = useToast()
  const [documents] = useState<Document[]>(mockDocuments)

  const handleBuyDocument = (document: Document) => {
    toast({
      title: "Purchase Successful",
      description: `You have purchased "${document.name}" for $${document.price.toFixed(2)}`,
      variant: "default",
    })
  }

  return (
    <div className="container py-8">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Health Data Marketplace</h1>
        <p className="text-muted-foreground">Browse and purchase anonymized health datasets from trusted providers.</p>
      </div>
      <DocumentList documents={documents} showBuyButton={true} onBuy={handleBuyDocument} />
    </div>
  )
}
