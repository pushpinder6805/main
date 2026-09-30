"use client";

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, WorksphereUser } from '@/app/contexts/AuthContext';

function destination(user: WorksphereUser): string {
  if (user.type !== 'advisor') return '/program/dashboard';
  if (!user.onboarded) return '/program/onboard';
  if (!user.approved) return '/program/pending';
  return '/program/advisor-dashboard';
}

export default function LoginPage() {
  const router = useRouter();
  const {refresh} = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({identifier, password}),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to sign in.');
      const user = await refresh() || data.user as WorksphereUser;
      const returnTo = new URLSearchParams(window.location.search).get('return_to');
      router.replace(returnTo?.startsWith('/') && !returnTo.startsWith('//') ? returnTo : destination(user));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Unable to sign in.');
    } finally {
      setLoading(false);
    }
  }

  return <div className="min-h-[70vh] bg-gray-50 flex items-center justify-center px-4 py-12">
    <form onSubmit={submit} className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg space-y-5">
      <div><h1 className="text-3xl font-bold text-gray-900">Sign in</h1><p className="mt-2 text-gray-600">Use your Workspherepulse account.</p></div>
      {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <label className="block text-sm font-medium text-gray-700">Email or username
        <input value={identifier} onChange={e => setIdentifier(e.target.value)} autoComplete="username" required className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3" />
      </label>
      <label className="block text-sm font-medium text-gray-700">Password
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" required className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3" />
      </label>
      <div className="text-right"><Link href="/forgot-password" className="text-sm font-semibold text-blue-600">Forgot password?</Link></div>
      <button disabled={loading} className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white disabled:opacity-60">{loading ? 'Signing in…' : 'Sign in'}</button>
      <p className="text-center text-sm text-gray-600">New to Workspherepulse? <Link href="/signup" className="font-semibold text-blue-600">Create an account</Link></p>
    </form>
  </div>;
}
