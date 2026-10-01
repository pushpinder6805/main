"use client";

import {FormEvent, useEffect, useRef, useState} from 'react';
import {useRouter} from 'next/navigation';
import {useAuth} from '@/app/contexts/AuthContext';
import {apiClient, Conversation, Message} from '@/lib/api-client';

export default function MessagesPage() {
  const router = useRouter();
  const {user, isLoading} = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selected, setSelected] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const end = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isLoading) return;
    if (!user) { router.replace('/login'); return; }
    if (user.type === 'advisor') { router.replace(user.onboarded ? (user.approved ? '/program/advisor-dashboard' : '/program/pending') : '/program/onboard'); return; }
    void apiClient.getConversations().then(result => { if (result.error) setError(result.error); else { const items = result.data || []; setConversations(items); setSelected(items[0] || null); } setLoading(false); });
  }, [user, isLoading, router]);

  useEffect(() => {
    if (!selected) { setMessages([]); return; }
    let active = true;
    const load = async () => { const result = await apiClient.getMessages(selected.id); if (!active) return; if (result.error) setError(result.error); else setMessages(result.data || []); };
    void load();
    const timer = window.setInterval(() => void load(), 5000);
    return () => { active = false; window.clearInterval(timer); };
  }, [selected]);
  useEffect(() => end.current?.scrollIntoView({behavior: 'smooth'}), [messages]);

  async function send(event: FormEvent) {
    event.preventDefault();
    if (!selected || !content.trim() || sending) return;
    setError(''); setSending(true);
    const result = await apiClient.sendMessage(selected.id, content.trim());
    if (result.error) setError(result.error);
    else { setContent(''); const refreshed = await apiClient.getMessages(selected.id); if (refreshed.data) setMessages(refreshed.data); }
    setSending(false);
  }

  if (isLoading || loading) return <div className="min-h-[70vh] flex items-center justify-center text-gray-600">Loading AI sessions…</div>;
  const active = selected?.status === 'started' && new Date(selected.end_date) > new Date();
  return <div className="h-[calc(100vh-88px)] bg-gray-50 p-4"><div className="mx-auto flex h-full max-w-6xl overflow-hidden rounded-2xl bg-white shadow">
    <aside className="w-80 shrink-0 overflow-y-auto border-r border-gray-200"><div className="border-b border-gray-200 p-5"><h1 className="text-xl font-bold text-gray-900">AI sessions</h1><p className="mt-1 text-sm text-gray-500">Paid session history</p></div>{conversations.length ? conversations.map(item => <button key={item.id} onClick={() => {setSelected(item); setError('');}} className={`w-full border-b border-gray-100 p-4 text-left ${selected?.id === item.id ? 'bg-blue-50' : 'hover:bg-gray-50'}`}><p className="font-semibold text-gray-900">AI advisor</p><p className="mt-1 text-sm text-gray-600">{new Date(item.start_date).toLocaleString()}</p><span className="mt-2 inline-block rounded-full bg-gray-100 px-2 py-1 text-xs capitalize text-gray-600">{item.status.replace('_',' ')}</span></button>) : <p className="p-6 text-center text-sm text-gray-500">No AI sessions yet.</p>}</aside>
    <main className="flex min-w-0 flex-1 flex-col">{selected ? <><header className="border-b border-gray-200 p-5"><h2 className="font-bold text-gray-900">AI advisor · {selected.duration} minutes</h2><p className="text-sm text-gray-500">{active ? 'Session active' : 'Session ended'}</p></header>{error && <p role="alert" className="m-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}<div className="flex-1 space-y-4 overflow-y-auto p-5">{messages.map(message => <div key={message.id} className={`flex ${message.is_mine ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[75%] rounded-2xl px-4 py-3 ${message.is_mine ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-900'}`}><p className="text-xs font-semibold opacity-70">{message.sender.name}</p>{message.content && <p className="mt-1 whitespace-pre-wrap text-sm">{message.content}</p>}{message.audio && <audio controls src={message.audio} className="mt-2 max-w-full"/>}<p className="mt-1 text-xs opacity-60">{new Date(message.created_at).toLocaleTimeString()}</p></div></div>)}<div ref={end}/></div><form onSubmit={send} className="flex gap-3 border-t border-gray-200 p-4"><input value={content} onChange={e => setContent(e.target.value)} disabled={!active || sending} maxLength={4000} placeholder={active ? 'Message the AI advisor' : 'This paid session has ended'} className="min-w-0 flex-1 rounded-lg border border-gray-300 px-4 py-3 disabled:bg-gray-100"/><button disabled={!active || !content.trim() || sending} className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white disabled:opacity-50">{sending ? 'Sending…' : 'Send'}</button></form></> : <div className="flex flex-1 items-center justify-center text-gray-500">Choose an AI session.</div>}</main>
  </div></div>;
}
