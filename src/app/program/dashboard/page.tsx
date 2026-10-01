"use client";

import Link from 'next/link';
import {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import {useAuth} from '@/app/contexts/AuthContext';
import {apiClient, Appointment, UserProfile} from '@/lib/api-client';

export default function UserDashboard() {
  const router = useRouter();
  const {user, isLoading} = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoading) return;
    if (!user) { router.replace('/login'); return; }
    if (user.type === 'advisor') { router.replace(user.onboarded ? (user.approved ? '/program/advisor-dashboard' : '/program/pending') : '/program/onboard'); return; }
    void (async () => {
      const [profileResult, appointmentResult] = await Promise.all([apiClient.getUserProfile(), apiClient.getAppointments()]);
      if (profileResult.error || appointmentResult.error) setError(profileResult.error || appointmentResult.error || 'Unable to load your dashboard.');
      else { setProfile(profileResult.data || null); setAppointments(appointmentResult.data || []); }
      setLoading(false);
    })();
  }, [user, isLoading, router]);

  if (isLoading || loading) return <div className="min-h-[70vh] flex items-center justify-center text-gray-600">Loading your dashboard…</div>;
  if (!user) return null;
  const active = appointments.filter(item => !item.is_deleted && ['scheduled', 'started'].includes(item.status));
  return <div className="min-h-screen bg-gray-50 py-10 px-4"><div className="mx-auto max-w-6xl space-y-8">
    <div className="flex flex-wrap items-center justify-between gap-4"><div><h1 className="text-3xl font-bold text-gray-900">My dashboard</h1><p className="mt-1 text-gray-600">Welcome back, {user.name || user.username}</p></div><Link href="/program/advisors" className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white">Browse advisors</Link></div>
    {error && <p role="alert" className="rounded-lg bg-red-50 p-4 text-red-700">{error}</p>}
    <div className="grid gap-5 sm:grid-cols-3"><Stat label="Wallet balance" value={`${profile?.wallet.currency || 'USD'} ${(profile?.wallet.balance || 0).toFixed(2)}`}/><Stat label="All sessions" value={appointments.length.toString()}/><Stat label="Upcoming sessions" value={active.length.toString()}/></div>
    <section className="rounded-2xl bg-white p-6 shadow"><div className="flex items-center justify-between"><h2 className="text-xl font-bold text-gray-900">Upcoming sessions</h2><Link href="/program/appointments" className="font-semibold text-blue-600">View all</Link></div><div className="mt-5 space-y-3">{active.length ? active.slice(0, 5).map(item => <Session key={item.id} item={item}/>) : <p className="py-8 text-center text-gray-500">No upcoming sessions.</p>}</div></section>
  </div></div>;
}

function Stat({label, value}: {label: string; value: string}) { return <div className="rounded-2xl bg-white p-6 shadow"><p className="text-sm text-gray-500">{label}</p><p className="mt-2 text-3xl font-bold text-gray-900">{value}</p></div>; }
function Session({item}: {item: Appointment}) { return <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-200 p-4"><div><p className="font-semibold text-gray-900">{item.advisor_name}</p><p className="text-sm text-gray-600">{new Date(item.start_date).toLocaleString()} · {item.duration} minutes</p></div><span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">{item.status.replace('_', ' ')}</span></div>; }
