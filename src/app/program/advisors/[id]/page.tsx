"use client";

import Image from 'next/image';
import Link from 'next/link';
import {useEffect, useState} from 'react';
import {useParams, useRouter} from 'next/navigation';
import {useAuth} from '@/app/contexts/AuthContext';
import {Advisor, apiClient} from '@/lib/api-client';

export default function AdvisorProfilePage() {
  const params = useParams();
  const router = useRouter();
  const {user, isLoading} = useAuth();
  const [advisor, setAdvisor] = useState<Advisor | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (isLoading) return;
    if (!user) { router.replace('/login'); return; }
    if (user.type === 'advisor') { router.replace('/program/advisor-dashboard'); return; }
    void apiClient.getAdvisors().then(result => { if (result.error) setError(result.error); else { const found = (result.data || []).find(item => String(item.id) === String(params.id)); if (found) setAdvisor(found); else setError('Advisor not found or no longer available.'); } setLoading(false); });
  }, [user, isLoading, router, params.id]);
  if (isLoading || loading) return <div className="min-h-[70vh] flex items-center justify-center text-gray-600">Loading advisor…</div>;
  if (!advisor) return <div className="min-h-[70vh] flex items-center justify-center px-4"><div className="rounded-2xl bg-white p-8 text-center shadow"><h1 className="text-2xl font-bold text-gray-900">Advisor unavailable</h1><p className="mt-3 text-gray-600">{error}</p><Link href="/program/advisors" className="mt-6 inline-block font-semibold text-blue-600">Browse advisors</Link></div></div>;
  const price = advisor.pricing.find(item => item.is_active);
  return <div className="min-h-screen bg-gray-50 py-10 px-4"><div className="mx-auto max-w-5xl space-y-6"><Link href="/program/advisors" className="font-semibold text-blue-600">← All advisors</Link><section className="rounded-2xl bg-white p-8 shadow"><div className="flex flex-wrap items-center gap-6"><Image src={advisor.avatar_url || '/images/logo.png'} alt={advisor.name || advisor.username} width={112} height={112} className="h-28 w-28 rounded-full object-cover"/><div><h1 className="text-3xl font-bold text-gray-900">{advisor.name || advisor.username}</h1><p className="mt-1 text-gray-500">@{advisor.username} · {advisor.timezone}</p><p className="mt-2 font-semibold text-amber-600">★ {(advisor.rating || 0).toFixed(1)}</p>{price && <p className="mt-2 text-lg font-bold text-gray-900">{price.currency} {price.amount}/minute</p>}</div></div><div className="mt-8 grid gap-7 md:grid-cols-2"><div><h2 className="text-xl font-bold text-gray-900">About</h2><p className="mt-3 whitespace-pre-wrap text-gray-700">{advisor.about_me}</p><h2 className="mt-7 text-xl font-bold text-gray-900">Expertise</h2><div className="mt-3 flex flex-wrap gap-2">{advisor.skills.map(value => <span key={value.id} className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">{value.name}</span>)}</div></div><div><h2 className="text-xl font-bold text-gray-900">Weekly availability</h2><div className="mt-3 space-y-2">{advisor.availabilities.map((slot,index) => <div key={`${slot.day_of_week}-${index}`} className="flex justify-between rounded-lg border border-gray-200 px-4 py-3"><span className="capitalize font-medium">{slot.day_of_week}</span><span className="text-gray-600">{slot.start_time.slice(0,5)}–{slot.end_time.slice(0,5)}</span></div>)}</div><p className="mt-6 rounded-lg bg-amber-50 p-4 text-sm text-amber-900">Website payment checkout is being connected to the same Stripe session API used by the app. This page no longer creates unverified Supabase bookings.</p></div></div></section></div></div>;
}
