"use client";

import {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import {useAuth} from '@/app/contexts/AuthContext';
import {apiClient, Appointment} from '@/lib/api-client';

type Filter = 'all' | 'upcoming' | 'completed' | 'cancelled';
export default function AppointmentsPage() {
  const router = useRouter();
  const {user, isLoading} = useAuth();
  const [sessions, setSessions] = useState<Appointment[]>([]);
  const [filter, setFilter] = useState<Filter>('all');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  async function load() { const result = await apiClient.getAppointments(); if (result.error) setError(result.error); else setSessions(result.data || []); setLoading(false); }
  useEffect(() => { if (isLoading) return; if (!user) router.replace('/login'); else if (user.type === 'advisor' && (!user.onboarded || !user.approved)) router.replace(user.onboarded ? '/program/pending' : '/program/onboard'); else void load(); }, [user, isLoading, router]);
  async function cancel(item: Appointment) { if (!confirm('Cancel this session? Refund eligibility is checked by the backend.')) return; const result = await apiClient.cancelAppointment(item.id); if (result.error) setError(result.error); else await load(); }
  async function open(item: Appointment) { const result = await apiClient.getAppointmentZoomLinks(item.id); if (result.error) setError(result.error); else if (result.data?.join_url) window.location.assign(result.data.join_url); }
  if (isLoading || loading) return <div className="min-h-[70vh] flex items-center justify-center text-gray-600">Loading meetings…</div>;
  const visible = sessions.filter(item => filter === 'all' || (filter === 'upcoming' ? ['scheduled', 'started'].includes(item.status) : item.status === filter));
  return <div className="min-h-screen bg-gray-50 py-10 px-4"><div className="mx-auto max-w-5xl space-y-6"><div><h1 className="text-3xl font-bold text-gray-900">Meetings</h1><p className="mt-1 text-gray-600">Live data from your Workspherepulse account.</p></div>{error && <p role="alert" className="rounded-lg bg-red-50 p-4 text-red-700">{error}</p>}<div className="flex flex-wrap gap-2">{(['all','upcoming','completed','cancelled'] as Filter[]).map(value => <button key={value} onClick={() => setFilter(value)} className={`rounded-full px-4 py-2 text-sm font-semibold ${filter === value ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}>{value[0].toUpperCase()+value.slice(1)}</button>)}</div><div className="space-y-4">{visible.length ? visible.map(item => <article key={item.id} className="rounded-2xl bg-white p-6 shadow"><div className="flex flex-wrap items-start justify-between gap-4"><div><h2 className="text-lg font-bold text-gray-900">{item.is_advisor ? item.user_name : item.advisor_name}</h2><p className="mt-1 text-gray-600">{new Date(item.start_date).toLocaleString()} · {item.duration} minutes</p><p className="mt-2 text-sm font-semibold text-blue-700">{item.status.replace('_',' ')}</p></div><div className="flex gap-2">{['scheduled','started'].includes(item.status) && <button onClick={() => void open(item)} className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white">Join</button>}{item.is_user && item.status === 'scheduled' && <button onClick={() => void cancel(item)} className="rounded-lg border border-red-300 px-4 py-2 font-semibold text-red-700">Cancel</button>}</div></div></article>) : <div className="rounded-2xl bg-white p-10 text-center text-gray-500 shadow">No meetings in this section.</div>}</div></div></div>;
}
