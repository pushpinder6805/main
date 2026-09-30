"use client";

import Link from 'next/link';
import { FormEvent, useState } from 'react';

export default function SignupPage() {
  const [form, setForm] = useState({name: '', username: '', email: '', password: '', account_type: 'user'});
  const [error, setError] = useState('');
  const [complete, setComplete] = useState(false);
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault(); setError(''); setLoading(true);
    try {
      const response = await fetch('/api/auth/signup', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(form)});
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to create your account.');
      setComplete(true);
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Unable to create your account.'); }
    finally { setLoading(false); }
  }

  if (complete) return <div className="min-h-[70vh] bg-gray-50 flex items-center justify-center px-4"><div className="max-w-lg rounded-2xl bg-white p-8 text-center shadow-lg"><h1 className="text-3xl font-bold text-gray-900">Check your email</h1><p className="mt-4 text-gray-600">We sent a verification link to <strong>{form.email}</strong>. Open it to activate your account and sign in.</p></div></div>;

  return <div className="min-h-[70vh] bg-gray-50 flex items-center justify-center px-4 py-12"><form onSubmit={submit} className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-lg space-y-5">
    <div><h1 className="text-3xl font-bold text-gray-900">Create your account</h1><p className="mt-2 text-gray-600">One account for the website, app, and community.</p></div>
    {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
    <div className="grid gap-4 sm:grid-cols-2">
      <label className="text-sm font-medium text-gray-700">Full name<input value={form.name} onChange={e => setForm({...form, name: e.target.value})} autoComplete="name" required className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3" /></label>
      <label className="text-sm font-medium text-gray-700">Username<input value={form.username} onChange={e => setForm({...form, username: e.target.value})} autoComplete="username" required className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3" /></label>
    </div>
    <label className="block text-sm font-medium text-gray-700">Email<input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} autoComplete="email" required className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3" /></label>
    <label className="block text-sm font-medium text-gray-700">Password<input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} autoComplete="new-password" minLength={8} required className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3" /></label>
    <fieldset><legend className="text-sm font-medium text-gray-700">I want to</legend><div className="mt-2 grid grid-cols-2 gap-3">
      <label className={`cursor-pointer rounded-lg border p-4 ${form.account_type === 'user' ? 'border-blue-600 bg-blue-50' : 'border-gray-300'}`}><input type="radio" name="account_type" value="user" checked={form.account_type === 'user'} onChange={e => setForm({...form, account_type: e.target.value})} className="mr-2" />Book advisors</label>
      <label className={`cursor-pointer rounded-lg border p-4 ${form.account_type === 'advisor' ? 'border-blue-600 bg-blue-50' : 'border-gray-300'}`}><input type="radio" name="account_type" value="advisor" checked={form.account_type === 'advisor'} onChange={e => setForm({...form, account_type: e.target.value})} className="mr-2" />Become an advisor</label>
    </div></fieldset>
    <button disabled={loading} className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white disabled:opacity-60">{loading ? 'Creating account…' : 'Create account'}</button>
    <p className="text-center text-sm text-gray-600">Already registered? <Link href="/login" className="font-semibold text-blue-600">Sign in</Link></p>
  </form></div>;
}
