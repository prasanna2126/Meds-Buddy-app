
import React, { useState } from 'react';
import { Medication } from '../types/Medication';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface MedicationFormProps {
  onSubmit: (medication: Omit<Medication, 'id' | 'userId' | 'createdAt'>) => void;
  onCancel: () => void;
  medication?: Medication;
}

const MedicationForm: React.FC<MedicationFormProps> = ({ onSubmit, onCancel, medication }) => {
  const [formData, setFormData] = useState({
    name: medication?.name || '',
    dosage: medication?.dosage || '',
    frequency: medication?.frequency || 'daily',
    timeToTake: medication?.timeToTake || ['08:00'],
    isActive: medication?.isActive ?? true
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const timeOptions = [
    '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
    '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
    '18:00', '19:00', '20:00', '21:00', '22:00'
  ];

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Medication name is required';
    }

    if (!formData.dosage.trim()) {
      newErrors.dosage = 'Dosage is required';
    }

    if (formData.timeToTake.length === 0) {
      newErrors.timeToTake = 'At least one time is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors below",
        variant: "destructive"
      });
      return;
    }

    onSubmit(formData);
    toast({
      title: "Success",
      description: medication ? "Medication updated successfully" : "Medication added successfully"
    });
  };

  const handleTimeToggle = (time: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        timeToTake: [...prev.timeToTake, time].sort()
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        timeToTake: prev.timeToTake.filter(t => t !== time)
      }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{medication ? 'Edit Medication' : 'Add New Medication'}</CardTitle>
              <CardDescription>
                {medication ? 'Update medication details' : 'Enter your medication information'}
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Medication Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Aspirin, Vitamin D"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dosage">Dosage *</Label>
              <Input
                id="dosage"
                placeholder="e.g., 10mg, 1 tablet"
                value={formData.dosage}
                onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                className={errors.dosage ? 'border-red-500' : ''}
              />
              {errors.dosage && <p className="text-sm text-red-500">{errors.dosage}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="frequency">Frequency</Label>
              <Select value={formData.frequency} onValueChange={(value) => setFormData({ ...formData, frequency: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="twice-daily">Twice Daily</SelectItem>
                  <SelectItem value="three-times-daily">Three Times Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="as-needed">As Needed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Time to Take *</Label>
              <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto">
                {timeOptions.map((time) => (
                  <div key={time} className="flex items-center space-x-2">
                    <Checkbox
                      id={time}
                      checked={formData.timeToTake.includes(time)}
                      onCheckedChange={(checked) => handleTimeToggle(time, checked as boolean)}
                    />
                    <Label htmlFor={time} className="text-sm">
                      {time}
                    </Label>
                  </div>
                ))}
              </div>
              {errors.timeToTake && <p className="text-sm text-red-500">{errors.timeToTake}</p>}
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked as boolean })}
              />
              <Label htmlFor="isActive">Active medication</Label>
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                {medication ? 'Update' : 'Add'} Medication
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default MedicationForm;
