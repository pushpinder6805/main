"use client";

import Image from 'next/image';
import Link from 'next/link';
import {useEffect, useMemo, useState} from 'react';
import {useRouter} from 'next/navigation';
import {useAuth} from '@/app/contexts/AuthContext';
import {Advisor, apiClient} from '@/lib/api-client';

export default function AdvisorsPage() {
  const router = useRouter();
  const {user, isLoading} = useAuth();
  const [advisors, setAdvisors] = useState<Advisor[]>([]);
  const [query, setQuery] = useState('');
  const [skill, setSkill] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (isLoading) return;
    if (!user) { router.replace('/login'); return; }
    if (user.type === 'advisor') { router.replace(user.onboarded ? (user.approved ? '/program/advisor-dashboard' : '/program/pending') : '/program/onboard'); return; }
    void apiClient.getAdvisors().then(result => { if (result.error) setError(result.error); else setAdvisors(result.data || []); setLoading(false); });
  }, [user, isLoading, router]);
  const skills = useMemo(() => [...new Set(advisors.flatMap(item => item.skills.map(value => value.name)))].sort(), [advisors]);
  const visible = useMemo(() => advisors.filter(item => (!skill || item.skills.some(value => value.name === skill)) && (!query || `${item.name} ${item.username} ${item.about_me} ${item.skills.map(value => value.name).join(' ')}`.toLowerCase().includes(query.toLowerCase()))).sort((a,b) => (b.rating || 0) - (a.rating || 0)), [advisors, skill, query]);
  if (isLoading || loading) return <div className="min-h-[70vh] flex items-center justify-center text-gray-600">Loading approved advisors…</div>;
  return <div className="min-h-screen bg-gray-50 py-10 px-4"><div className="mx-auto max-w-6xl space-y-7"><div><h1 className="text-4xl font-bold text-gray-900">Approved advisors</h1><p className="mt-2 text-gray-600">Profiles and availability come directly from Workspherepulse.</p></div>{error && <p role="alert" className="rounded-lg bg-red-50 p-4 text-red-700">{error}</p>}<div className="grid gap-4 rounded-2xl bg-white p-5 shadow sm:grid-cols-2"><label className="text-sm font-medium text-gray-700">Search<input value={query} onChange={e => setQuery(e.target.value)} placeholder="Name or expertise" className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3"/></label><label className="text-sm font-medium text-gray-700">Skill<select value={skill} onChange={e => setSkill(e.target.value)} className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3"><option value="">All skills</option>{skills.map(value => <option key={value}>{value}</option>)}</select></label></div><p className="text-sm text-gray-600">{visible.length} advisor{visible.length === 1 ? '' : 's'}</p><div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{visible.map(advisor => { const price = advisor.pricing.find(item => item.is_active); return <Link key={advisor.id} href={`/program/advisors/${advisor.id}`} className="rounded-2xl bg-white p-6 shadow transition hover:-translate-y-1 hover:shadow-lg"><div className="flex items-center gap-4"><Image src={advisor.avatar_url || '/images/logo.png'} alt={advisor.name || advisor.username} width={64} height={64} className="h-16 w-16 rounded-full object-cover"/><div><h2 className="text-lg font-bold text-gray-900">{advisor.name || advisor.username}</h2><p className="text-sm text-gray-500">@{advisor.username}</p><p className="mt-1 text-sm font-semibold text-amber-600">★ {(advisor.rating || 0).toFixed(1)}</p></div></div><p className="mt-4 line-clamp-3 text-sm text-gray-600">{advisor.about_me}</p><div className="mt-4 flex flex-wrap gap-2">{advisor.skills.slice(0,3).map(value => <span key={value.id} className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">{value.name}</span>)}</div>{price && <p className="mt-4 font-bold text-gray-900">{price.currency} {price.amount}/minute</p>}</Link>; })}</div>{!visible.length && !error && <div className="rounded-2xl bg-white p-10 text-center text-gray-500 shadow">No approved advisors match these filters.</div>}</div></div>;
}
