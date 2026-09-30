"use client";

import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/contexts/AuthContext';
import {apiClient, Skill} from '@/lib/api-client';

type Slot = {day_of_week: string; start_time: string; end_time: string};
const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

export default function OnboardPage() {
  const router = useRouter();
  const {user, isLoading, refresh} = useAuth();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<number[]>([]);
  const [slots, setSlots] = useState<Slot[]>([{day_of_week: 'monday', start_time: '09:00', end_time: '17:00'}]);
  const [about, setAbout] = useState('');
  const [rate, setRate] = useState('');
  const [timezone, setTimezone] = useState('America/New_York');
  const [language, setLanguage] = useState('en');
  const [avatar, setAvatar] = useState<File | null>(null);
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isLoading) return;
    if (!user) { router.replace('/login'); return; }
    if (user.type === 'advisor' && user.onboarded) { router.replace(user.approved ? '/program/advisor-dashboard' : '/program/pending'); return; }
    void (async () => {
      if (user.type !== 'advisor') {
        const applied = await apiClient.applyAsAdvisor();
        if (applied.error) { setError(applied.error); return; }
        await refresh();
      }
      const result = await apiClient.getSkills();
      if (result.error) setError(result.error); else setSkills(result.data || []);
    })();
  }, [user, isLoading, router, refresh]);

  function updateSlot(index: number, field: keyof Slot, value: string) {
    setSlots(items => items.map((slot, position) => position === index ? {...slot, [field]: value} : slot));
  }

  async function submit(event: FormEvent) {
    event.preventDefault(); setError(''); setLoading(true);
    try {
      const input = {about_me: about, rate, skills: selectedSkills, timezone, language, privacy_policy_accepted: accepted, availabilities: slots};
      const body = new FormData();
      body.append('input', JSON.stringify(input));
      if (avatar) body.append('avatar', avatar);
      const result = await apiClient.onboardAdvisor(body);
      if (result.error) throw new Error(result.error);
      await refresh();
      router.replace('/program/pending');
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Unable to submit your application.'); }
    finally { setLoading(false); }
  }

  if (isLoading || !user) return <div className="min-h-[70vh] flex items-center justify-center text-gray-600">Loading your account…</div>;

  return <div className="min-h-screen bg-gray-50 py-12 px-4"><form onSubmit={submit} className="mx-auto max-w-3xl space-y-7 rounded-2xl bg-white p-8 shadow-lg">
    <div><h1 className="text-3xl font-bold text-gray-900">Advisor application</h1><p className="mt-2 text-gray-600">Tell us about your expertise and availability. Your profile will stay pending until it is reviewed.</p></div>
    {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
    <label className="block text-sm font-medium text-gray-700">Experience and expertise<textarea value={about} onChange={e => setAbout(e.target.value)} required rows={6} className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3" /></label>
    <div className="grid gap-5 sm:grid-cols-2">
      <label className="text-sm font-medium text-gray-700">Rate per minute (USD)<input type="number" min="0.01" max="1000" step="0.01" value={rate} onChange={e => setRate(e.target.value)} required className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3" /></label>
      <label className="text-sm font-medium text-gray-700">Profile photo (optional)<input type="file" accept="image/jpeg,image/png" onChange={e => setAvatar(e.target.files?.[0] || null)} className="mt-2 block w-full rounded-lg border border-gray-300 px-3 py-2" /></label>
      <label className="text-sm font-medium text-gray-700">Time zone<select value={timezone} onChange={e => setTimezone(e.target.value)} className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3"><option value="America/New_York">US Eastern</option><option value="America/Chicago">US Central</option><option value="America/Denver">US Mountain</option><option value="America/Los_Angeles">US Pacific</option><option value="Europe/London">London</option><option value="Europe/Paris">Central Europe</option><option value="Asia/Kolkata">India</option><option value="Asia/Tokyo">Japan</option><option value="UTC">UTC</option></select></label>
      <label className="text-sm font-medium text-gray-700">Language<select value={language} onChange={e => setLanguage(e.target.value)} className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3"><option value="en">English</option><option value="fr">French</option></select></label>
    </div>
    <fieldset><legend className="text-sm font-medium text-gray-700">Skills</legend><div className="mt-3 grid gap-2 sm:grid-cols-2">{skills.map(skill => <label key={skill.id} className="rounded-lg border border-gray-200 p-3"><input type="checkbox" checked={selectedSkills.includes(skill.id)} onChange={e => setSelectedSkills(values => e.target.checked ? [...values, skill.id] : values.filter(id => id !== skill.id))} className="mr-2" />{skill.name}</label>)}</div></fieldset>
    <fieldset><div className="flex items-center justify-between"><legend className="text-sm font-medium text-gray-700">Weekly availability</legend><button type="button" onClick={() => setSlots(values => [...values, {day_of_week: 'monday', start_time: '09:00', end_time: '17:00'}])} className="font-semibold text-blue-600">Add time</button></div><div className="mt-3 space-y-3">{slots.map((slot, index) => <div key={index} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2"><select value={slot.day_of_week} onChange={e => updateSlot(index, 'day_of_week', e.target.value)} className="rounded-lg border border-gray-300 px-3 py-2">{DAYS.map(day => <option key={day} value={day}>{day[0].toUpperCase() + day.slice(1)}</option>)}</select><input type="time" value={slot.start_time} onChange={e => updateSlot(index, 'start_time', e.target.value)} className="rounded-lg border border-gray-300 px-3 py-2"/><input type="time" value={slot.end_time} onChange={e => updateSlot(index, 'end_time', e.target.value)} className="rounded-lg border border-gray-300 px-3 py-2"/><button type="button" disabled={slots.length === 1} onClick={() => setSlots(values => values.filter((_, position) => position !== index))} className="px-2 text-red-600 disabled:opacity-30">Remove</button></div>)}</div></fieldset>
    <label className="flex items-start gap-3 text-sm text-gray-700"><input type="checkbox" checked={accepted} onChange={e => setAccepted(e.target.checked)} required className="mt-1"/><span>I accept the <Link href="/privacy-policy" className="font-semibold text-blue-600">privacy policy</Link> and confirm the information is accurate.</span></label>
    <button disabled={loading || skills.length === 0} className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white disabled:opacity-60">{loading ? 'Submitting…' : 'Submit application'}</button>
  </form></div>;
}
