
import React, { useState, useEffect } from 'react';
import AuthForm from '../components/AuthForm';
import PatientDashboard from '../components/PatientDashboard';
import CaretakerDashboard from '../components/CaretakerDashboard';
import { User, UserRole } from '../types/User';

const Index = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in (localStorage persistence)
    const savedUser = localStorage.getItem('medsBuddyUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('medsBuddyUser', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('medsBuddyUser');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading MedsBuddy...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <AuthForm onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {currentUser.role === UserRole.PATIENT ? (
        <PatientDashboard user={currentUser} onLogout={handleLogout} />
      ) : (
        <CaretakerDashboard user={currentUser} onLogout={handleLogout} />
      )}
    </div>
  );
};

export default Index;
