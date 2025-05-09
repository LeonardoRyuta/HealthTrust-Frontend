"use client"

import { FileIcon, FileTextIcon, ImageIcon, DatabaseIcon, BarChart3Icon, Users, Clock } from "lucide-react"
import { formatDistanceToNow, format } from "date-fns"

import type { Document } from "@/lib/types"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface DocumentModalProps {
  document: Document | null
  isOpen: boolean
  onClose: () => void
  onBuy?: (document: Document) => void
}

export default function DocumentModal({ document, isOpen, onClose, onBuy }: DocumentModalProps) {
  if (!document) return null

  const getIcon = (type: string) => {
    switch (type) {
      case "zip":
      case "image":
        return <ImageIcon className="h-6 w-6 text-emerald-600" />
      case "pdf":
        return <FileIcon className="h-6 w-6 text-emerald-600" />
      case "csv":
      case "xlsx":
        return <DatabaseIcon className="h-6 w-6 text-emerald-600" />
      case "json":
        return <BarChart3Icon className="h-6 w-6 text-emerald-600" />
      default:
        return <FileTextIcon className="h-6 w-6 text-emerald-600" />
    }
  }

  const handleBuy = () => {
    if (onBuy) {
      onBuy(document)
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            {getIcon(document.type)}
            <DialogTitle>{document.name}</DialogTitle>
          </div>
          <div className="flex items-center justify-between">
            <DialogDescription>
              Uploaded by {document.uploadedBy} {formatDistanceToNow(new Date(document.date), { addSuffix: true })}
            </DialogDescription>
            <Badge variant="outline" className="text-xs">
              {document.category}
            </Badge>
          </div>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="rounded-md bg-muted p-4">
            <p className="text-sm">{document.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <div className="flex flex-col gap-1 rounded-md border p-3">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <DatabaseIcon className="h-3.5 w-3.5" />
                <span>File Size</span>
              </div>
              <p className="text-sm font-medium">{document.size}</p>
            </div>
            <div className="flex flex-col gap-1 rounded-md border p-3">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Users className="h-3.5 w-3.5" />
                <span>Sample Size</span>
              </div>
              <p className="text-sm font-medium">{document.sampleSize} participants</p>
            </div>
            <div className="flex flex-col gap-1 rounded-md border p-3">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                <span>Timeframe</span>
              </div>
              <p className="text-sm font-medium">{document.timeframe}</p>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-md border p-4">
            <div>
              <p className="text-sm text-muted-foreground">Price</p>
              <p className="text-xl font-bold text-emerald-600">${document.price.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">File Format</p>
              <p className="text-sm font-medium">.{document.type}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Upload Date</p>
              <p className="text-sm font-medium">{format(new Date(document.date), "MMM d, yyyy")}</p>
            </div>
          </div>
        </div>

        <DialogFooter className="flex sm:justify-between">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {onBuy && (
            <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={handleBuy}>
              Purchase for ${document.price.toFixed(2)}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
