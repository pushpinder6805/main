"use client"

import { useEffect } from 'react';
import { useAuth } from '@/app/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const { user, isLoading, isAdmin, isAdvisor } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/');
      } else if (isAdmin) {
        router.push('/admin/chat');
      } else if (isAdvisor) {
        router.push('/program/advisor-dashboard');
      } else {
        router.push('/program/dashboard');
      }
    }
  }, [user, isLoading, isAdmin, isAdvisor, router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );
}
