"use client"

import { useState } from "react"
import { FileIcon, FileTextIcon, ImageIcon, DatabaseIcon, BarChart3Icon } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

import type { Document } from "@/lib/types"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import DocumentModal from "@/components/document-modal"

interface DocumentListProps {
  documents: Document[]
  showBuyButton?: boolean
  onBuy?: (document: Document) => void
}

export default function DocumentList({ documents, showBuyButton = true, onBuy }: DocumentListProps) {
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const getIcon = (type: string) => {
    switch (type) {
      case "zip":
      case "image":
        return <ImageIcon className="h-5 w-5 text-emerald-600" />
      case "pdf":
        return <FileIcon className="h-5 w-5 text-emerald-600" />
      case "csv":
      case "xlsx":
        return <DatabaseIcon className="h-5 w-5 text-emerald-600" />
      case "json":
        return <BarChart3Icon className="h-5 w-5 text-emerald-600" />
      default:
        return <FileTextIcon className="h-5 w-5 text-emerald-600" />
    }
  }

  const handleViewDetails = (document: Document) => {
    setSelectedDocument(document)
    setIsModalOpen(true)
  }

  const handleBuy = (document: Document) => {
    if (onBuy) {
      onBuy(document)
    }
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {documents.map((doc) => (
          <Card key={doc.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getIcon(doc.type)}
                  <CardTitle className="text-lg">{doc.name}</CardTitle>
                </div>
                <Badge variant="outline" className="text-xs">
                  {doc.category}
                </Badge>
              </div>
              <CardDescription>{formatDistanceToNow(new Date(doc.date), { addSuffix: true })}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between">
                <p className="text-sm text-muted-foreground">
                  {doc.size} • {doc.sampleSize} samples
                </p>
                <p className="font-medium text-emerald-600">${doc.price.toFixed(2)}</p>
              </div>
              <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{doc.description}</p>
            </CardContent>
            <CardFooter className="flex justify-between border-t bg-muted/50 px-6 py-3">
              <Button variant="ghost" size="sm" className="text-xs" onClick={() => handleViewDetails(doc)}>
                View Details
              </Button>
              {showBuyButton && (
                <Button
                  variant="default"
                  size="sm"
                  className="text-xs bg-emerald-600 hover:bg-emerald-700"
                  onClick={() => handleBuy(doc)}
                >
                  Purchase
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>

      <DocumentModal
        document={selectedDocument}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onBuy={showBuyButton && onBuy ? handleBuy : undefined}
      />
    </>
  )
}
