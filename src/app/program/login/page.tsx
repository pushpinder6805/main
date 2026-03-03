"use client"

import { useEffect } from 'react';
import { useAuth } from '@/app/contexts/AuthContext';

export default function LoginPage() {
  const { user, login, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) {
      login();
    } else if (user) {
      window.location.href = '/program/dashboard';
    }
  }, [user, isLoading, login]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Redirecting to Login</h1>
        <p className="text-gray-600">Please wait while we redirect you to the login page...</p>
      </div>
    </div>
  );
}
