"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/contexts/AuthContext';

export default function VerifyEmail({token}: {token: string}) {
  const router = useRouter();
  const {refresh} = useAuth();
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) { setError('This verification link is incomplete.'); return; }
    void fetch('/api/auth/verify-email', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({token})})
      .then(async response => { const data = await response.json(); if (!response.ok) throw new Error(data.error || 'Verification failed.'); await refresh(); router.replace(data.user.type === 'advisor' ? '/program/onboard' : '/program/dashboard'); })
      .catch(reason => setError(reason instanceof Error ? reason.message : 'Verification failed.'));
  }, [token, refresh, router]);

  return <div className="min-h-[70vh] bg-gray-50 flex items-center justify-center px-4"><div className="max-w-lg rounded-2xl bg-white p-8 text-center shadow-lg">{error ? <><h1 className="text-2xl font-bold text-red-700">Unable to verify email</h1><p className="mt-4 text-gray-600">{error}</p><Link href="/login" className="mt-6 inline-block font-semibold text-blue-600">Return to sign in</Link></> : <><div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"/><h1 className="mt-5 text-2xl font-bold text-gray-900">Verifying your email…</h1></>}</div></div>;
}
