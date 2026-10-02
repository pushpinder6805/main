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
  const visible = useMemo(() => advisors.filter(item => (!skill || item.skills.some(value => value.name === skill)) && (!query || `${item.name} ${item.username} ${item.about_me} ${item.skills.map(value => value.name).join(' ')}`.toLowerCase().includes(query.toLowerCase()))).sort((a,b) => Number(b.payment_ready) - Number(a.payment_ready) || (b.rating || 0) - (a.rating || 0)), [advisors, skill, query]);
  if (isLoading || loading) return <div className="min-h-[70vh] flex items-center justify-center text-gray-600">Loading approved advisors…</div>;
  return <div className="min-h-screen bg-slate-50 py-12 px-4"><div className="mx-auto max-w-6xl space-y-7"><div><p className="eyebrow">Personal guidance</p><h1 className="mt-2 text-4xl font-bold text-slate-950">Find an approved advisor</h1><p className="mt-3 max-w-2xl text-slate-600">Compare expertise, availability and transparent session rates. Advisors marked ready have completed secure payout setup.</p></div>{error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">{error}</p>}<div className="grid gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:grid-cols-2"><label className="text-sm font-semibold text-slate-700">Search<input value={query} onChange={e => setQuery(e.target.value)} placeholder="Name or expertise" className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-[#69705a] focus:ring-4 focus:ring-[#69705a]/10"/></label><label className="text-sm font-semibold text-slate-700">Skill<select value={skill} onChange={e => setSkill(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-[#69705a] focus:ring-4 focus:ring-[#69705a]/10"><option value="">All skills</option>{skills.map(value => <option key={value}>{value}</option>)}</select></label></div><p className="text-sm text-slate-600">{visible.length} advisor{visible.length === 1 ? '' : 's'}</p><div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{visible.map(advisor => { const price = advisor.pricing.find(item => item.is_active); return <Link key={advisor.id} href={`/program/advisors/${advisor.id}`} className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-[#69705a]/40 hover:shadow-xl"><div className="flex items-center gap-4"><Image src={advisor.avatar_url || '/images/logo.png'} alt={advisor.name || advisor.username} width={64} height={64} className="h-16 w-16 rounded-2xl object-cover ring-1 ring-slate-200"/><div className="min-w-0"><h2 className="truncate text-lg font-bold text-slate-950">{advisor.name || advisor.username}</h2><p className="text-sm text-slate-500">@{advisor.username}</p><p className="mt-1 text-sm font-semibold text-amber-600">★ {(advisor.rating || 0).toFixed(1)}</p></div></div><div className={`mt-5 inline-flex rounded-full px-3 py-1 text-xs font-bold ${advisor.payment_ready ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>{advisor.payment_ready ? 'Ready for booking' : 'Payout setup pending'}</div><p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-600">{advisor.about_me}</p><div className="mt-4 flex flex-wrap gap-2">{advisor.skills.slice(0,3).map(value => <span key={value.id} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{value.name}</span>)}</div>{price && <div className="mt-5 flex items-end justify-between border-t border-slate-100 pt-4"><p className="font-bold text-slate-950">{price.currency} {price.amount}<span className="text-sm font-medium text-slate-500">/min</span></p><span className="text-sm font-bold text-[#69705a] group-hover:translate-x-1 transition">View profile →</span></div>}</Link>; })}</div>{!visible.length && !error && <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-slate-500 shadow-sm">No approved advisors match these filters.</div>}</div></div>;
}
