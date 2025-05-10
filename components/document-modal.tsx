"use client"

import {
  UserIcon,
  CalendarIcon,
  ActivityIcon,
  HeartIcon,
  StethoscopeIcon,
  GlobeIcon,
  LinkIcon
} from "lucide-react"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useEffect } from "react";

interface Dataset {
  datasetId: string;
  owner: string;
  gender: number;
  ageRange: number;
  bmiCategory: number;
  chronicConditions: number[];
  healthMetricTypes: number[];
  isActive: boolean;
}

interface DatasetModalProps {
  dataset: Dataset | null;
  index: number | null;
  isOpen: boolean;
  onClose: () => void;
}

const GENDER_MAP = ["Unknown", "Male", "Female"];
const AGE_RANGE_MAP = [
  "0-9", "10-19", "20-29", "30-39", "40-49", "50-59", "60-69", "70-79", "80+"
];
const BMI_CATEGORY_MAP = ["Underweight", "Normal", "Overweight", "Obese", "Severely Obese", "Morbidly Obese"];

export default function DatasetModal({ dataset, index, isOpen, onClose }: any) {
  if (!dataset) return null;

  useEffect(() => {
    console.log("Dataset details:", dataset);
    console.log("Index:", index);
  }, [dataset, index]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Dataset #{index}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <InfoBox
                icon={<UserIcon className="h-4 w-4" />}
                label="Gender"
                value={dataset.gender ?? "Unknown"}
              />
              <InfoBox
                icon={<CalendarIcon className="h-4 w-4" />}
                label="Age Range"
                value={dataset?.ageRange  ?? "Unknown"}
              />
              <InfoBox
                icon={<ActivityIcon className="h-4 w-4" />}
                label="BMI Category"
                value={dataset?.bmiCategory ?? "Unknown"}
              />
              <InfoBox
                icon={<HeartIcon className="h-4 w-4" />}
                label="Conditions"
                value={
                  Array.isArray(dataset?.chronicConditions)
                    ? dataset.chronicConditions.join(", ")
                    : "None"
                }
              />
              <InfoBox
                icon={<StethoscopeIcon className="h-4 w-4" />}
                label="Health Metrics"
                value={
                  Array.isArray(dataset?.healthMetricTypes)
                    ? dataset.healthMetricTypes.join(", ")
                    : "N/A"
                }
              />
              <InfoBox
                icon={<GlobeIcon className="h-4 w-4" />}
                label="Owner"
                value={dataset?.owner ? dataset.owner.slice(0, 10) + "..." : "Unknown"}
              />
            </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function InfoBox({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-md border p-3">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        {icon}
        <span>{label}</span>
      </div>
      <p className="text-sm font-medium">{value}</p>
    </div>
  );
}
