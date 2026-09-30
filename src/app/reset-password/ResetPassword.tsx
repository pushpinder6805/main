"use client";

import Link from 'next/link';
import {FormEvent, useState} from 'react';

export default function ResetPassword({token}: {token: string}) {
  const [password, setPassword] = useState('');
  const [complete, setComplete] = useState(false);
  const [error, setError] = useState(token ? '' : 'This password reset link is incomplete.');
  const [loading, setLoading] = useState(false);
  async function submit(event: FormEvent) {
    event.preventDefault(); setError(''); setLoading(true);
    try { const response = await fetch('/api/auth/password-reset/confirm', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({token, password})}); const data = await response.json(); if (!response.ok) throw new Error(data.error || 'Unable to reset your password.'); setComplete(true); }
    catch (reason) { setError(reason instanceof Error ? reason.message : 'Unable to reset your password.'); }
    finally { setLoading(false); }
  }
  return <div className="min-h-[70vh] bg-gray-50 flex items-center justify-center px-4"><div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">{complete ? <><h1 className="text-3xl font-bold text-gray-900">Password updated</h1><p className="mt-4 text-gray-600">Your other sessions have been signed out.</p><Link href="/login" className="mt-6 inline-block font-semibold text-blue-600">Sign in</Link></> : <form onSubmit={submit} className="space-y-5"><h1 className="text-3xl font-bold text-gray-900">Choose a new password</h1>{error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}<label className="block text-sm font-medium text-gray-700">New password<input type="password" value={password} onChange={e => setPassword(e.target.value)} minLength={8} required disabled={!token} className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3"/></label><button disabled={loading || !token} className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white disabled:opacity-60">{loading ? 'Updating…' : 'Update password'}</button></form>}</div></div>;
}
