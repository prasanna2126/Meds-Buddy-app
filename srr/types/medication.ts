
export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  timeToTake: string[];
  userId: string;
  createdAt: Date;
  isActive: boolean;
}

export interface MedicationLog {
  id: string;
  medicationId: string;
  userId: string;
  takenAt: Date;
  scheduledTime: string;
  notes?: string;
}

export interface AdherenceStats {
  totalDoses: number;
  takenDoses: number;
  percentage: number;
  streak: number;
}
