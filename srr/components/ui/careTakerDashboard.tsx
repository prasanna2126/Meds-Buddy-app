
import React, { useState, useEffect } from 'react';
import { User } from '../types/User';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface CaretakerDashboardProps {
  user: User;
  onLogout: () => void;
}

const CaretakerDashboard: React.FC<CaretakerDashboardProps> = ({ user, onLogout }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Caretaker Dashboard</h1>
              <p className="text-gray-600">Welcome, {user.name}</p>
            </div>
            <Button variant="outline" onClick={onLogout}>
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Caretaker Features</CardTitle>
            <CardDescription>
              Caretaker functionality will be implemented in Phase 2
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              This dashboard will include patient monitoring, medication oversight, 
              and communication features in future updates.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CaretakerDashboard;
