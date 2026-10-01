"use client";

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useMemo, useState } from 'react';
import { useAuth } from '@/app/contexts/AuthContext';

const callbackUri = 'worksphere://auth/callback';

function AuthorizeContent() {
  const params = useSearchParams();
  const {user, isLoading} = useAuth();
  const [working, setWorking] = useState(false);
  const [error, setError] = useState('');
  const challenge = params.get('code_challenge') || '';
  const method = params.get('code_challenge_method') || '';
  const state = params.get('state') || '';
  const valid = /^[A-Za-z0-9_-]{43}$/.test(challenge) && method === 'S256' && /^[A-Za-z0-9_-]{32,128}$/.test(state);
  const returnTo = useMemo(() => `/mobile/authorize?${params.toString()}`, [params]);

  async function continueToApp() {
    setWorking(true);
    setError('');
    try {
      const response = await fetch('/api/auth/mobile/authorize', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          redirect_uri: callbackUri,
          code_challenge: challenge,
          code_challenge_method: method,
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.code) throw new Error(data.error || 'Unable to sign in to the app.');
      window.location.assign(`${callbackUri}?code=${encodeURIComponent(data.code)}&state=${encodeURIComponent(state)}`);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Unable to sign in to the app.');
      setWorking(false);
    }
  }

  if (!valid) return <Card title="Invalid app request"><p className="text-gray-600">Return to Workspherepulse and try signing in again.</p></Card>;
  if (isLoading) return <Card title="Connecting to Workspherepulse"><p className="text-gray-600">Checking your account…</p></Card>;
  if (!user) return <Card title="Sign in to the app">
    <p className="text-gray-600">Use your Workspherepulse website account to continue securely.</p>
    <Link href={`/login?return_to=${encodeURIComponent(returnTo)}`} className="block rounded-lg bg-blue-600 px-4 py-3 text-center font-semibold text-white">Sign in</Link>
    <Link href="/signup" className="block text-center font-semibold text-blue-600">Create an account</Link>
  </Card>;

  return <Card title="Continue to Workspherepulse">
    <p className="text-gray-600">Signed in as <strong>{user.name || user.username}</strong>. Continue to return securely to the app.</p>
    {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
    <button onClick={continueToApp} disabled={working} className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white disabled:opacity-60">
      {working ? 'Connecting…' : 'Continue to app'}
    </button>
  </Card>;
}

function Card({title, children}: {title: string; children: React.ReactNode}) {
  return <div className="min-h-[70vh] bg-gray-50 flex items-center justify-center px-4 py-12">
    <section className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg space-y-5">
      <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
      {children}
    </section>
  </div>;
}

export default function MobileAuthorizePage() {
  return <Suspense fallback={<Card title="Connecting to Workspherepulse"><p className="text-gray-600">Loading…</p></Card>}>
    <AuthorizeContent />
  </Suspense>;
}
