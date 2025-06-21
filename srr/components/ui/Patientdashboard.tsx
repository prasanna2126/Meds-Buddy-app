
import React, { useState, useEffect } from 'react';
import { User } from '../types/User';
import { Medication, MedicationLog, AdherenceStats } from '../types/Medication';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Plus, Calendar, Check, X } from 'lucide-react';
import MedicationForm from './MedicationForm';
import MedicationList from './MedicationList';

interface PatientDashboardProps {
  user: User;
  onLogout: () => void;
}

const PatientDashboard: React.FC<PatientDashboardProps> = ({ user, onLogout }) => {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [medicationLogs, setMedicationLogs] = useState<MedicationLog[]>([]);
  const [showAddMedication, setShowAddMedication] = useState(false);
  const [adherenceStats, setAdherenceStats] = useState<AdherenceStats>({
    totalDoses: 0,
    takenDoses: 0,
    percentage: 0,
    streak: 0
  });

  useEffect(() => {
    loadUserData();
  }, [user.id]);

  useEffect(() => {
    calculateAdherence();
  }, [medications, medicationLogs]);

  const loadUserData = () => {
    const userMedications = JSON.parse(localStorage.getItem(`medications_${user.id}`) || '[]');
    const userLogs = JSON.parse(localStorage.getItem(`medicationLogs_${user.id}`) || '[]');
    
    setMedications(userMedications);
    setMedicationLogs(userLogs);
  };

  const calculateAdherence = () => {
    if (medications.length === 0) {
      setAdherenceStats({ totalDoses: 0, takenDoses: 0, percentage: 0, streak: 0 });
      return;
    }

    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - 7);

    // Calculate weekly doses
    let totalWeeklyDoses = 0;
    medications.forEach(med => {
      const dailyDoses = med.timeToTake.length;
      totalWeeklyDoses += dailyDoses * 7;
    });

    const weeklyLogs = medicationLogs.filter(log => 
      new Date(log.takenAt) >= startOfWeek
    );

    const adherencePercentage = totalWeeklyDoses > 0 
      ? Math.round((weeklyLogs.length / totalWeeklyDoses) * 100)
      : 0;

    // Calculate streak (simplified)
    let streak = 0;
    const sortedLogs = medicationLogs
      .sort((a, b) => new Date(b.takenAt).getTime() - new Date(a.takenAt).getTime());
    
    if (sortedLogs.length > 0) {
      const lastLog = new Date(sortedLogs[0].takenAt);
      const daysDiff = Math.floor((today.getTime() - lastLog.getTime()) / (1000 * 60 * 60 * 24));
      if (daysDiff <= 1) streak = Math.min(sortedLogs.length, 7);
    }

    setAdherenceStats({
      totalDoses: totalWeeklyDoses,
      takenDoses: weeklyLogs.length,
      percentage: adherencePercentage,
      streak
    });
  };

  const handleAddMedication = (medication: Omit<Medication, 'id' | 'userId' | 'createdAt'>) => {
    const newMedication: Medication = {
      ...medication,
      id: Date.now().toString(),
      userId: user.id,
      createdAt: new Date()
    };

    const updatedMedications = [...medications, newMedication];
    setMedications(updatedMedications);
    localStorage.setItem(`medications_${user.id}`, JSON.stringify(updatedMedications));
    setShowAddMedication(false);
  };

  const handleMarkAsTaken = (medicationId: string, scheduledTime: string) => {
    const newLog: MedicationLog = {
      id: Date.now().toString(),
      medicationId,
      userId: user.id,
      takenAt: new Date(),
      scheduledTime
    };

    const updatedLogs = [...medicationLogs, newLog];
    setMedicationLogs(updatedLogs);
    localStorage.setItem(`medicationLogs_${user.id}`, JSON.stringify(updatedLogs));
  };

  const getTodaysDoses = () => {
    const today = new Date().toDateString();
    return medications.flatMap(med => 
      med.timeToTake.map(time => ({
        medication: med,
        time,
        taken: medicationLogs.some(log => 
          log.medicationId === med.id && 
          log.scheduledTime === time &&
          new Date(log.takenAt).toDateString() === today
        )
      }))
    );
  };

  const todaysDoses = getTodaysDoses();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Patient Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user.name}</p>
            </div>
            <Button variant="outline" onClick={onLogout}>
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Weekly Adherence</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600 mb-2">
                {adherenceStats.percentage}%
              </div>
              <Progress value={adherenceStats.percentage} className="mb-2" />
              <p className="text-sm text-gray-600">
                {adherenceStats.takenDoses} of {adherenceStats.totalDoses} doses taken
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Current Streak</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {adherenceStats.streak} days
              </div>
              <p className="text-sm text-gray-600">
                Keep up the great work!
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Active Medications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {medications.filter(med => med.isActive).length}
              </div>
              <p className="text-sm text-gray-600">
                Medications in your routine
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Today's Schedule */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Today's Schedule
            </CardTitle>
            <CardDescription>
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {todaysDoses.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                No medications scheduled for today
              </p>
            ) : (
              <div className="space-y-3">
                {todaysDoses.map((dose, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${dose.taken ? 'bg-green-100' : 'bg-blue-100'}`}>
                        {dose.taken ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <Calendar className="h-4 w-4 text-blue-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{dose.medication.name}</p>
                        <p className="text-sm text-gray-600">
                          {dose.medication.dosage} at {dose.time}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {dose.taken ? (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          Taken
                        </Badge>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => handleMarkAsTaken(dose.medication.id, dose.time)}
                        >
                          Mark as Taken
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Medications Section */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Your Medications</h2>
          <Button onClick={() => setShowAddMedication(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Medication
          </Button>
        </div>

        <MedicationList 
          medications={medications}
          onMedicationUpdate={loadUserData}
          userId={user.id}
        />

        {/* Add Medication Modal */}
        {showAddMedication && (
          <MedicationForm
            onSubmit={handleAddMedication}
            onCancel={() => setShowAddMedication(false)}
          />
        )}
      </div>
    </div>
  );
};

export default PatientDashboard;
