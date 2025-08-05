import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoginForm from '../../components/Auth/LoginForm';
import SignupForm from '../../components/Auth/SignupForm';
import { Building2 } from 'lucide-react';

const AuthPage = () => {
  const [isLoginForm, setIsLoginForm] = useState(true);
  const { state } = useAuth();

  const toggleForm = () => {
    setIsLoginForm(!isLoginForm);
  };

  if (state.isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-8">
        <div className="flex justify-center">
          <div className="h-16 w-16 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center">
            <Building2 className="h-8 w-8" />
          </div>
        </div>
        <h2 className="mt-4 text-3xl font-extrabold text-gray-900">Nidharshana Hospital</h2>
        <p className="mt-2 text-sm text-gray-600">Doctor's Appointment Management System</p>
      </div>

      {isLoginForm ? (
        <LoginForm onToggleForm={toggleForm} />
      ) : (
        <SignupForm onToggleForm={toggleForm} />
      )}

      <div className="mt-8 text-sm text-center text-gray-500">
        <p>Demo Account: murugesh@example.com / password123</p>
      </div>
    </div>
  );
};

export default AuthPage;