"use client"

import { useEffect, useState } from "react"
import { DatabaseIcon } from "lucide-react"
import type { Dataset } from "@/lib/types"

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

import DatasetModal from "@/components/document-modal"

interface DatasetListProps {
  datasets: Dataset[]
  showBuyButton?: boolean
  onBuy?: (dataset: Dataset) => void
}

export default function DatasetList({ datasets, showBuyButton = true, onBuy }: DatasetListProps) {
  const [selectedDataset, setSelectedDataset] = useState<Dataset | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const getIcon = () => <DatabaseIcon className="h-5 w-5 text-emerald-600" />

  const handleViewDetails = (dataset: Dataset) => {
    setSelectedDataset(dataset)
    setIsModalOpen(true)
  }

  const handleBuy = (dataset: Dataset) => {
    console.log("Buying dataset:", dataset)
    if (onBuy) {
      onBuy(dataset)
    }
  }

  useEffect(() => {
    console.log("datasetsdddd:", datasets)
  }, [datasets])

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.isArray(datasets) && datasets.map((dataset, index) => (
          <Card key={index} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getIcon()}
                  <CardTitle className="text-lg">Dataset #{index}</CardTitle>
                </div>
                <Badge variant="outline" className="text-xs">
                  {dataset.ageRange ?? "Unknown"} yr
                </Badge>
              </div>
            </CardHeader>

            <CardFooter className="flex justify-between border-t bg-muted/50 px-6 py-3">
              <Button variant="ghost" size="sm" className="text-xs" onClick={() => handleViewDetails(dataset)}>
                View Details
              </Button>
              {showBuyButton && (
                <Button
                  variant="default"
                  size="sm"
                  className="text-xs bg-emerald-600 hover:bg-emerald-700"
                  onClick={() => handleBuy(dataset)}
                >
                  Purchase
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>

      <DatasetModal
        dataset={selectedDataset}
        // index={datasets?.findIndex(d => d === selectedDataset)}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onBuy={showBuyButton && onBuy ? handleBuy : undefined}
      />
    </>
  )
}
