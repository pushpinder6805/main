"use client";

import Link from 'next/link';
import {FormEvent, useState} from 'react';

export default function ForgotPasswordPage() {
  const [identifier, setIdentifier] = useState('');
  const [complete, setComplete] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  async function submit(event: FormEvent) {
    event.preventDefault(); setError(''); setLoading(true);
    try { const response = await fetch('/api/auth/password-reset/request', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({identifier})}); const data = await response.json(); if (!response.ok) throw new Error(data.error || 'Unable to request a reset.'); setComplete(true); }
    catch (reason) { setError(reason instanceof Error ? reason.message : 'Unable to request a reset.'); }
    finally { setLoading(false); }
  }
  return <div className="min-h-[70vh] bg-gray-50 flex items-center justify-center px-4"><div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">{complete ? <><h1 className="text-3xl font-bold text-gray-900">Check your email</h1><p className="mt-4 text-gray-600">If that account exists, we sent a password reset link.</p><Link href="/login" className="mt-6 inline-block font-semibold text-blue-600">Return to sign in</Link></> : <form onSubmit={submit} className="space-y-5"><div><h1 className="text-3xl font-bold text-gray-900">Reset password</h1><p className="mt-2 text-gray-600">Enter your email or username.</p></div>{error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}<label className="block text-sm font-medium text-gray-700">Email or username<input value={identifier} onChange={e => setIdentifier(e.target.value)} required className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3"/></label><button disabled={loading} className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white disabled:opacity-60">{loading ? 'Sending…' : 'Send reset link'}</button></form>}</div></div>;
}
