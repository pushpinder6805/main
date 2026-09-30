"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/contexts/AuthContext';

export default function PendingAdvisorPage() {
  const router = useRouter();
  const {user, isLoading, refresh, logout} = useAuth();

  useEffect(() => {
    if (isLoading) return;
    if (!user) router.replace('/login');
    else if (user.type !== 'advisor') router.replace('/program/dashboard');
    else if (!user.onboarded) router.replace('/program/onboard');
    else if (user.approved) router.replace('/program/advisor-dashboard');
  }, [user, isLoading, router]);

  return <div className="min-h-[70vh] bg-gray-50 flex items-center justify-center px-4"><div className="max-w-xl rounded-2xl bg-white p-8 text-center shadow-lg"><div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-3xl">⌛</div><h1 className="mt-5 text-3xl font-bold text-gray-900">Application under review</h1><p className="mt-4 text-gray-600">Your advisor profile has been submitted. You can use advisor features after the Workspherepulse team approves your account.</p><div className="mt-7 flex justify-center gap-3"><button onClick={() => void refresh()} className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white">Check status</button><button onClick={() => void logout()} className="rounded-lg border border-gray-300 px-5 py-3 font-semibold text-gray-700">Sign out</button></div></div></div>;
}
