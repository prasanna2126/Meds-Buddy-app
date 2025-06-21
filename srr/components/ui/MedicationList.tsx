
import React, { useState } from 'react';
import { Medication } from '../types/Medication';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Check, X } from 'lucide-react';
import MedicationForm from './MedicationForm';
import { toast } from '@/hooks/use-toast';

interface MedicationListProps {
  medications: Medication[];
  onMedicationUpdate: () => void;
  userId: string;
}

const MedicationList: React.FC<MedicationListProps> = ({ medications, onMedicationUpdate, userId }) => {
  const [editingMedication, setEditingMedication] = useState<Medication | null>(null);

  const handleUpdateMedication = (updatedMedication: Omit<Medication, 'id' | 'userId' | 'createdAt'>) => {
    if (!editingMedication) return;

    const medications = JSON.parse(localStorage.getItem(`medications_${userId}`) || '[]');
    const updatedMedications = medications.map((med: Medication) =>
      med.id === editingMedication.id
        ? { ...med, ...updatedMedication }
        : med
    );

    localStorage.setItem(`medications_${userId}`, JSON.stringify(updatedMedications));
    setEditingMedication(null);
    onMedicationUpdate();
    
    toast({
      title: "Success",
      description: "Medication updated successfully"
    });
  };

  const handleDeleteMedication = (medicationId: string) => {
    const medications = JSON.parse(localStorage.getItem(`medications_${userId}`) || '[]');
    const updatedMedications = medications.filter((med: Medication) => med.id !== medicationId);

    localStorage.setItem(`medications_${userId}`, JSON.stringify(updatedMedications));
    onMedicationUpdate();
    
    toast({
      title: "Success",
      description: "Medication deleted successfully"
    });
  };

  if (medications.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No medications yet</h3>
          <p className="text-gray-600">
            Add your first medication to start tracking your medication schedule.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {medications.map((medication) => (
          <Card key={medication.id} className={`${!medication.isActive ? 'opacity-60' : ''}`}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{medication.name}</CardTitle>
                  <CardDescription>{medication.dosage}</CardDescription>
                </div>
                <Badge variant={medication.isActive ? 'default' : 'secondary'}>
                  {medication.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-700">Frequency</p>
                  <p className="text-sm text-gray-600 capitalize">
                    {medication.frequency.replace('-', ' ')}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-700">Times</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {medication.timeToTake.map((time) => (
                      <Badge key={time} variant="outline" className="text-xs">
                        {time}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditingMedication(medication)}
                    className="flex-1"
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeleteMedication(medication.id)}
                    className="flex-1"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {editingMedication && (
        <MedicationForm
          medication={editingMedication}
          onSubmit={handleUpdateMedication}
          onCancel={() => setEditingMedication(null)}
        />
      )}
    </>
  );
};

export default MedicationList;
