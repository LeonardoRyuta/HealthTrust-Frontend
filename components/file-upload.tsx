"use client"

import type React from "react"

import { useState } from "react"
import { Upload, X, DollarSign } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { File } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const FileIcon = File

const healthCategories = [
  "Cardiology",
  "Neurology",
  "Diabetes",
  "Oncology",
  "Nutrition",
  "Sleep Medicine",
  "Infectious Disease",
  "Mental Health",
  "Pediatrics",
  "Geriatrics",
]

export default function FileUpload() {
  const [isDragging, setIsDragging] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [progress, setProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [price, setPrice] = useState<string>("49.99")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [sampleSize, setSampleSize] = useState<string>("100")
  const [timeframe, setTimeframe] = useState<string>("3 months")

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files)
      setFiles((prev) => [...prev, ...newFiles])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files)
      setFiles((prev) => [...prev, ...newFiles])
    }
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleUpload = () => {
    if (files.length === 0) return

    setIsUploading(true)

    // Simulate upload progress
    let currentProgress = 0
    const interval = setInterval(() => {
      currentProgress += 5
      setProgress(currentProgress)

      if (currentProgress >= 100) {
        clearInterval(interval)
        setTimeout(() => {
          setIsUploading(false)
          setFiles([])
          setProgress(0)
          setPrice("49.99")
          setDescription("")
          setCategory("")
          setSampleSize("100")
          setTimeframe("3 months")
        }, 500)
      }
    }, 200)
  }

  return (
    <div className="space-y-4">
      <Card
        className={`border-2 border-dashed ${
          isDragging ? "border-emerald-500 bg-emerald-50" : "border-gray-200"
        } transition-colors`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <CardContent className="flex flex-col items-center justify-center p-6 text-center">
          <Upload className="mb-4 h-10 w-10 text-emerald-600" />
          <h3 className="mb-1 text-lg font-semibold">Upload Health Dataset</h3>
          <p className="mb-4 text-sm text-muted-foreground">Drag and drop files here or click to browse</p>
          <input type="file" id="file-upload" multiple className="hidden" onChange={handleFileChange} />
          <label htmlFor="file-upload">
            <Button
              variant="outline"
              className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
              type="button"
            >
              Browse Files
            </Button>
          </label>
        </CardContent>
      </Card>

      {files.length > 0 && (
        <div className="space-y-4">
          <div className="rounded-lg border bg-card">
            <div className="p-4">
              <h3 className="font-medium">Selected Files</h3>
            </div>
            <div className="divide-y">
              {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-4">
                  <div className="flex items-center space-x-3">
                    <FileIcon className="h-5 w-5 text-emerald-600" />
                    <div>
                      <p className="text-sm font-medium">{file.name}</p>
                      <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeFile(index)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4 rounded-lg border bg-card p-4">
            <h3 className="font-medium">Dataset Information</h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="price">Price ($)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    className="pl-8"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {healthCategories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sampleSize">Sample Size</Label>
                <Input
                  id="sampleSize"
                  type="number"
                  min="1"
                  value={sampleSize}
                  onChange={(e) => setSampleSize(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeframe">Timeframe</Label>
                <Input
                  id="timeframe"
                  placeholder="e.g., 3 months, 1 year"
                  value={timeframe}
                  onChange={(e) => setTimeframe(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your dataset (data points, collection methods, etc.)"
                className="min-h-[100px]"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          {isUploading ? (
            <div className="space-y-2">
              <Progress value={progress} className="h-2 w-full" />
              <p className="text-xs text-muted-foreground">Uploading... {progress}%</p>
            </div>
          ) : (
            <Button onClick={handleUpload} className="bg-emerald-600 hover:bg-emerald-700">
              Upload and List for ${Number.parseFloat(price).toFixed(2)}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
