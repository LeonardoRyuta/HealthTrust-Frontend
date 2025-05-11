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

interface Dataset {
  dataEntryId: string;
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

const GENDER_MAP = ["Male", "Female", "Unknown"];
const AGE_RANGE_MAP = [
  "18-22", "23-27", "28-32", "33-37", "38-42", "43-47", "48-52", "53-57", "58-62", 
  "63-67", "68-72", "73-77", "78-82", "83-87", "88-92", "93-97", "98-100"
];
const CONDITION_MAP = [
  "None", "Diabetes", "Hypertension", "Asthma", "Cancer","Heart Disease","Obesity",
  "Arthritis", "Depression", "Other"
];

const BMI_CATEGORY_MAP = ["Underweight", "Normal", "Overweight", "Obese", "Severely Obese", "Morbidly Obese"];

export default function DatasetModal({ dataset, index, isOpen, onClose }: DatasetModalProps) {
  if (!dataset) return null;

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
              value={GENDER_MAP[dataset?.gender ?? -1] ?? "Unknown"}
              />
              <InfoBox
              icon={<CalendarIcon className="h-4 w-4" />}
              label="Age Range"
              value={AGE_RANGE_MAP[dataset?.ageRange ?? -1] ?? "Unknown"}
              />
              <InfoBox
              icon={<ActivityIcon className="h-4 w-4" />}
              label="BMI Category"
              value={BMI_CATEGORY_MAP[dataset?.bmiCategory ?? -1] ?? "Unknown"}
              />
              <InfoBox
              icon={<HeartIcon className="h-4 w-4" />}
              label="Conditions"
              value={
                Array.isArray(dataset?.chronicConditions)
                ? dataset.chronicConditions
                  .map((condition) => CONDITION_MAP[condition] ?? "Unknown")
                  .join(", ")
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