"use client";

import Link from 'next/link';
import {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import {useAuth} from '@/app/contexts/AuthContext';
import {apiClient, AdvisorProfile, Appointment} from '@/lib/api-client';

export default function AdvisorDashboard() {
  const router = useRouter();
  const {user, isLoading} = useAuth();
  const [profile, setProfile] = useState<AdvisorProfile | null>(null);
  const [sessions, setSessions] = useState<Appointment[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (isLoading) return;
    if (!user) { router.replace('/login'); return; }
    if (user.type !== 'advisor') { router.replace('/program/dashboard'); return; }
    if (!user.onboarded) { router.replace('/program/onboard'); return; }
    if (!user.approved) { router.replace('/program/pending'); return; }
    void (async () => { const [p, a] = await Promise.all([apiClient.getAdvisorProfile(), apiClient.getAppointments()]); if (p.error || a.error) setError(p.error || a.error || 'Unable to load advisor data.'); else { setProfile(p.data || null); setSessions(a.data || []); } setLoading(false); })();
  }, [user, isLoading, router]);
  if (isLoading || loading) return <div className="min-h-[70vh] flex items-center justify-center text-gray-600">Loading advisor dashboard…</div>;
  if (!user) return null;
  const upcoming = sessions.filter(item => !item.is_deleted && ['scheduled', 'started'].includes(item.status));
  const completed = sessions.filter(item => item.status === 'completed');
  const rate = profile?.pricing?.find(item => item.is_active);
  return <div className="min-h-screen bg-gray-50 py-10 px-4"><div className="mx-auto max-w-6xl space-y-8">
    <div className="flex flex-wrap items-center justify-between gap-4"><div><h1 className="text-3xl font-bold text-gray-900">Advisor dashboard</h1><p className="mt-1 text-gray-600">{user.name || user.username}{rate ? ` · ${rate.currency} ${rate.amount}/minute` : ''}</p></div><Link href="/program/appointments" className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white">All meetings</Link></div>
    {error && <p role="alert" className="rounded-lg bg-red-50 p-4 text-red-700">{error}</p>}
    <div className="grid gap-5 sm:grid-cols-4"><Stat label="Wallet" value={`${profile?.wallet.currency || 'USD'} ${(profile?.wallet.balance || 0).toFixed(2)}`}/><Stat label="Upcoming" value={upcoming.length.toString()}/><Stat label="Completed" value={completed.length.toString()}/><Stat label="Released earnings" value={`${profile?.wallet.currency || 'USD'} ${(profile?.stats?.earnings || 0).toFixed(2)}`}/></div>
    <section className="rounded-2xl bg-white p-6 shadow"><h2 className="text-xl font-bold text-gray-900">Upcoming customer meetings</h2><div className="mt-5 space-y-3">{upcoming.length ? upcoming.slice(0, 8).map(item => <div key={item.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-200 p-4"><div><p className="font-semibold text-gray-900">{item.user_name}</p><p className="text-sm text-gray-600">{new Date(item.start_date).toLocaleString()} · {item.duration} minutes</p></div><Link href="/program/appointments" className="font-semibold text-blue-600">Open meeting</Link></div>) : <p className="py-8 text-center text-gray-500">No upcoming customer meetings.</p>}</div></section>
  </div></div>;
}
function Stat({label, value}: {label: string; value: string}) { return <div className="rounded-2xl bg-white p-6 shadow"><p className="text-sm text-gray-500">{label}</p><p className="mt-2 text-2xl font-bold text-gray-900">{value}</p></div>; }
