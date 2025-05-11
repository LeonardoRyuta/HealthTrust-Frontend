"use client"

import type React from "react"

import { useState } from "react"
import { toast } from "react-hot-toast"
import { Upload, X, DollarSign } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { File as FileIcon } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { uploadToIPFS } from "@/lib/ipfs"
import { getPubKey, submitDatasetToContract } from "@/lib/contract"
import { GENDER_MAP, AGE_RANGE_MAP, CONDITION_MAP } from '@/components/constant_mappings';
import { encryptForBackend } from "@/lib/crypto"


export default function FileUpload() {
  const [isDragging, setIsDragging] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [progress, setProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [price, setPrice] = useState<string>("49.99")
  const [description, setDescription] = useState("")
  const [sampleSize, setSampleSize] = useState<string>("100")
  const [timeframe, setTimeframe] = useState<string>("3 months")
  const [ height, setHeight] = useState<number>(0)
  const [weight, setWeight] = useState<number>(0)

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
  // Add these new state variables
  const [selectedGender, setSelectedGender] = useState<keyof typeof GENDER_MAP>("male");
  const [selectedAgeRange, setSelectedAgeRange] = useState<keyof typeof AGE_RANGE_MAP>("18–23");
  const [selectedConditions, setSelectedConditions] = useState<Set<keyof typeof CONDITION_MAP>>(new Set());

  // Add this function to handle condition changes
  const handleConditionChange = (condition: keyof typeof CONDITION_MAP, checked: boolean) => {
    setSelectedConditions((prev) => {
      const updated = new Set(prev);
      if (checked) {
        updated.add(condition);
      } else {
        updated.delete(condition);
      }
      return updated;
    });
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    setIsUploading(true);

    try {
      console.log('Starting upload process...');
      console.log('Files to upload:', files);

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        console.log(`Uploading file ${i + 1}:`, file.name);
        try {
          // const pubKey = await getPubKey();

          // if (!pubKey) {
          //   throw new Error("Public key not found");
          // }

          // // Read file content as string for encryption
          const fileReader = new FileReader();
          const fileContent = await new Promise<string>((resolve) => {
            fileReader.onload = (e) => resolve(e.target?.result as string);
            fileReader.readAsText(file);
          });
          
          // const encryptedFile = await encryptForBackend(fileContent);
          
          // // Convert encrypted string back to a File object
          // const encryptedBlob = new Blob([encryptedFile], { type: file.type });
          // const encryptedFileObj = new File([encryptedBlob], file.name, { type: file.type });
          
          const hash = await uploadToIPFS(file);
          //console.log(`Success! IPFS hash:`, hash);

          const genderInt = GENDER_MAP[selectedGender];
          const ageRangeInt = AGE_RANGE_MAP[selectedAgeRange];
            const conditionsInt = Array.from(selectedConditions)
            .map((condition) => CONDITION_MAP[condition])
            .join(",");
          
          const bmi = weight / (height * height);
          console.log(`Calculated BMI: ${bmi.toFixed(2)}`);
          console.log(`Gender: ${selectedGender} (${genderInt}), Age Range: ${selectedAgeRange} (${ageRangeInt}), Conditions: ${Array.from(selectedConditions).join(', ')} (${conditionsInt})`);
          
          const healthMetricTypes = 1;
          console.log("File content:", fileContent);

          await submitDatasetToContract(hash, {
            agerange: ageRangeInt.toString(),
            gender: genderInt.toString(),
            conditions: conditionsInt,
            bmi: bmi.toFixed(2).toString(),
            price: price,
            description: description,
            sampleSize: sampleSize,
            timeframe: timeframe,
          });
          
          console.log("Dataset submitted to smart contract");
          const progress = ((i + 1) / files.length) * 100;
          setProgress(Math.round(progress));
        } catch (error) {
          console.error(`Error uploading file ${file.name}:`, error);
          throw error;
        }
      }

      setFiles([]);
      toast.success('Files uploaded successfully!');
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  

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
                <Label htmlFor="gender">Gender</Label>
                <Select onValueChange={(value) => console.log("Selected gender:", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
                <div className="space-y-2">
                <Label htmlFor="ageRange">Age Range</Label>
                <Select onValueChange={(value) => console.log("Selected age range:", value)}>
                  <SelectTrigger>
                  <SelectValue placeholder="Select age range" />
                  </SelectTrigger>
                  <SelectContent>
                  <SelectItem value="18–23">18–23</SelectItem>
                  <SelectItem value="24–29">24–29</SelectItem>
                  <SelectItem value="30–35">30–35</SelectItem>
                  <SelectItem value="36–41">36–41</SelectItem>
                  <SelectItem value="42–47">42–47</SelectItem>
                  <SelectItem value="48–53">48–53</SelectItem>
                  <SelectItem value="54–59">54–59</SelectItem>
                  <SelectItem value="60–65">60–65</SelectItem>
                  <SelectItem value="66–71">66–71</SelectItem>
                  <SelectItem value="72–77">72–77</SelectItem>
                  <SelectItem value="78–83">78–83</SelectItem>
                  <SelectItem value="84–89">84–89</SelectItem>
                  <SelectItem value="90–95">90–95</SelectItem>
                  <SelectItem value="96–100">96–100</SelectItem>
                  </SelectContent>
                </Select>
                </div>
                    <div className="space-y-2">
                    <Label htmlFor="height-weight">Height & Weight</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                      id="height"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="Height (m)"
                      onChange={(e) => setHeight(parseFloat(e.target.value))}
                      />
                      <Input
                      id="weight"
                      type="number"
                      step="0.1"
                      min="0"
                      placeholder="Weight (kg)"
                      onChange={(e) => setWeight(parseFloat(e.target.value))}
                      />
                    </div>
                    </div>
                // Replace the existing conditions mapping section with:
                <div className="space-y-2">
                  <Label htmlFor="conditions">Conditions</Label>
                  <div className="grid grid-cols-2 gap-4">
                    {["Diabetes", "Hypertension", "Asthma", "Cancer", "Heart Disease", "Obesity", "Arthritis", "Depression", "Other"].map((condition) => (
                      <div key={condition} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={condition}
                          value={condition}
                          checked={selectedConditions.has(condition as keyof typeof CONDITION_MAP)}
                          onChange={(e) => handleConditionChange(condition as keyof typeof CONDITION_MAP, e.target.checked)}
                          className="h-4 w-4"
                        />
                        <Label htmlFor={condition} className="text-sm">
                          {condition}
                        </Label>
                      </div>
                    ))}
                  </div>
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

          {isUploading? (
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
