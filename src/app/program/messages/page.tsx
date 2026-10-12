"use client";

import {FormEvent, useEffect, useRef, useState} from 'react';
import {useRouter} from 'next/navigation';
import {useAuth} from '@/app/contexts/AuthContext';
import {apiClient, Conversation, Message} from '@/lib/api-client';

type Product = {duration: number; amount: number};
type PurchasedSession = {id: string; duration: number; amount: number; currency: string; state: string};
type AiConfig = {enabled: boolean; publishable_key: string; products: Product[]; unused: PurchasedSession[]; active: Conversation | null};
type StripePaymentElement = {mount: (selector: string) => void; destroy: () => void};
type StripeElements = {create: (type: 'payment') => StripePaymentElement};
type StripeClient = {
  elements: (options: {clientSecret: string}) => StripeElements;
  confirmPayment: (options: {elements: StripeElements; confirmParams: {return_url: string}}) => Promise<{error?: {message?: string}}>;
};
declare global { interface Window { Stripe?: (key: string) => StripeClient } }

let stripeLoader: Promise<void> | null = null;
function loadStripeJs(): Promise<void> {
  if (window.Stripe) return Promise.resolve();
  if (!stripeLoader) stripeLoader = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://js.stripe.com/v3/';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Unable to load the secure payment form.'));
    document.head.appendChild(script);
  });
  return stripeLoader;
}

async function jsonResponse(response: Response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || 'The request could not be completed.');
  return data;
}

export default function MessagesPage() {
  const router = useRouter();
  const {user, isLoading} = useAuth();
  const [config, setConfig] = useState<AiConfig | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selected, setSelected] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [content, setContent] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [orderId, setOrderId] = useState('');
  const [chosen, setChosen] = useState<Product | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const end = useRef<HTMLDivElement>(null);
  const stripe = useRef<StripeClient | null>(null);
  const elements = useRef<StripeElements | null>(null);
  const paymentElement = useRef<StripePaymentElement | null>(null);

  async function load() {
    const [history, ai] = await Promise.all([
      apiClient.getConversations(),
      fetch('/api/payments/ai/web/config', {cache: 'no-store'}).then(jsonResponse),
    ]);
    if (history.error) throw new Error(history.error);
    const items = history.data || [];
    setConversations(items);
    setConfig(ai as AiConfig);
    setSelected(current => current || (ai.active as Conversation | null) || items[0] || null);
  }

  useEffect(() => {
    if (isLoading) return;
    if (!user) { router.replace('/login'); return; }
    if (user.type === 'advisor') {
      router.replace(user.onboarded ? (user.approved ? '/program/advisor-dashboard' : '/program/pending') : '/program/onboard');
      return;
    }
    void load().catch(reason => setError(reason instanceof Error ? reason.message : 'Unable to load AI sessions.')).finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isLoading, router]);

  useEffect(() => {
    if (!selected) { setMessages([]); return; }
    let mounted = true;
    const refresh = async () => {
      const result = await apiClient.getMessages(selected.id);
      if (!mounted) return;
      if (result.error) setError(result.error); else setMessages(result.data || []);
    };
    void refresh();
    const timer = window.setInterval(() => void refresh(), 5000);
    return () => { mounted = false; window.clearInterval(timer); };
  }, [selected]);

  useEffect(() => end.current?.scrollIntoView({behavior: 'smooth'}), [messages]);

  useEffect(() => {
    if (!clientSecret || !config?.publishable_key) return;
    let cancelled = false;
    void loadStripeJs().then(() => {
      if (cancelled || !window.Stripe) return;
      stripe.current = window.Stripe(config.publishable_key);
      elements.current = stripe.current.elements({clientSecret});
      paymentElement.current = elements.current.create('payment');
      paymentElement.current.mount('#ai-stripe-payment-element');
    }).catch(reason => setError(reason instanceof Error ? reason.message : 'Unable to load secure payment.'));
    return () => {
      cancelled = true;
      paymentElement.current?.destroy();
      paymentElement.current = null; elements.current = null; stripe.current = null;
    };
  }, [clientSecret, config?.publishable_key]);

  async function choose(product: Product) {
    setBusy(true); setError(''); setChosen(product);
    try {
      const order = await fetch('/api/payments/ai/web/orders', {
        method: 'POST', headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({request_id: crypto.randomUUID(), duration: product.duration}),
      }).then(jsonResponse);
      const prepared = await fetch(`/api/payments/ai/web/orders/${order.id}/prepare`, {method: 'POST'}).then(jsonResponse);
      setOrderId(order.id); setClientSecret(prepared.client_secret);
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Unable to prepare payment.'); setChosen(null); }
    finally { setBusy(false); }
  }

  async function pay(event: FormEvent) {
    event.preventDefault();
    if (!stripe.current || !elements.current || !orderId) return;
    setBusy(true); setError('');
    const result = await stripe.current.confirmPayment({
      elements: elements.current,
      confirmParams: {return_url: `${window.location.origin}/program/messages?payment=${encodeURIComponent(orderId)}`},
    });
    if (result.error) setError(result.error.message || 'Payment could not be completed.');
    setBusy(false);
  }

  async function start(session: PurchasedSession) {
    setBusy(true); setError('');
    try {
      const conversation = await fetch(`/api/payments/ai/web/orders/${session.id}/start`, {method: 'POST'}).then(jsonResponse) as Conversation;
      setSelected(conversation);
      await load();
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Unable to start this session.'); }
    finally { setBusy(false); }
  }

  async function send(event: FormEvent) {
    event.preventDefault();
    if (!selected || !content.trim() || busy) return;
    setBusy(true); setError('');
    const result = await apiClient.sendMessage(selected.id, content.trim());
    if (result.error) setError(result.error);
    else {
      setContent('');
      const refreshed = await apiClient.getMessages(selected.id);
      if (refreshed.data) setMessages(refreshed.data);
    }
    setBusy(false);
  }

  if (isLoading || loading) return <div className="min-h-[70vh] flex items-center justify-center text-slate-600">Loading AI Advisor…</div>;
  const active = selected?.status === 'started' && new Date(selected.end_date) > new Date();

  return <div className="min-h-screen bg-[#f4f3ee] px-4 py-8">
    <div className="mx-auto max-w-7xl">
      <section className="overflow-hidden rounded-[2rem] bg-[#17231b] text-white shadow-xl">
        <div className="grid gap-8 px-6 py-9 md:px-10 lg:grid-cols-[1.2fr_.8fr] lg:items-center">
          <div><p className="text-xs font-bold uppercase tracking-[0.22em] text-[#c7d5a9]">Private workplace guidance</p><h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">Meet your AI Advisor</h1><p className="mt-4 max-w-2xl text-lg leading-8 text-white/70">Talk through difficult conversations, workplace decisions and next steps in a focused private session. Choose your time, pay securely and start when you are ready.</p></div>
          <div className="rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur"><div className="flex items-center gap-4"><div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#d9e8b8] text-2xl text-[#17231b]">✦</div><div><p className="font-semibold">Available whenever you need it</p><p className="mt-1 text-sm text-white/65">Text guidance · 15, 30 or 60 minutes</p></div></div><p className="mt-5 text-sm leading-6 text-white/60">Your timer starts only when you select Start session. AI can make mistakes and does not replace medical, legal or emergency support.</p></div>
        </div>
      </section>

      {error && <p role="alert" className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">{error}</p>}

      {config?.unused?.length ? <section className="mt-7 rounded-3xl border border-[#d8d8ce] bg-white p-6 shadow-sm"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#69705a]">Purchased sessions</p><h2 className="mt-1 text-2xl font-semibold text-slate-950">Ready when you are</h2></div><span className="rounded-full bg-[#eff4e3] px-3 py-1 text-sm font-semibold text-[#59604c]">Timer has not started</span></div><div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{config.unused.map(session => <button key={session.id} disabled={busy || Boolean(config.active)} onClick={() => void start(session)} className="group rounded-2xl border border-slate-200 p-5 text-left transition hover:-translate-y-0.5 hover:border-[#8b946f] hover:shadow-md disabled:opacity-50"><div className="flex items-center justify-between"><span className="text-xl font-semibold text-slate-950">{session.duration} minutes</span><span className="text-[#69705a] transition group-hover:translate-x-1">→</span></div><p className="mt-2 text-sm text-slate-500">Paid · Start this AI session</p></button>)}</div></section> : null}

      <div className="mt-7 grid gap-7 lg:grid-cols-[390px_1fr]">
        <aside className="space-y-5">
          <section className="rounded-3xl border border-[#d8d8ce] bg-white p-6 shadow-sm"><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#69705a]">Choose a session</p><div className="mt-5 space-y-3">{config?.products.map(product => <button key={product.duration} disabled={busy || Boolean(config.active)} onClick={() => void choose(product)} className={`flex w-full items-center justify-between rounded-2xl border p-4 text-left transition ${chosen?.duration === product.duration ? 'border-[#69705a] bg-[#f4f6ee]' : 'border-slate-200 hover:border-[#8b946f]'} disabled:opacity-50`}><span><span className="block text-lg font-semibold text-slate-950">{product.duration} minutes</span><span className="mt-1 block text-sm text-slate-500">One private text session</span></span><span className="text-lg font-bold text-slate-950">${(product.amount / 100).toFixed(2)}</span></button>)}</div>{!config?.enabled && <p className="mt-4 text-sm text-amber-700">Payments are temporarily unavailable.</p>}</section>

          {clientSecret && chosen && <form onSubmit={pay} className="rounded-3xl border border-[#d8d8ce] bg-white p-6 shadow-sm"><div className="flex items-center justify-between"><h2 className="text-xl font-semibold text-slate-950">Secure checkout</h2><button type="button" onClick={() => {setClientSecret(''); setChosen(null);}} className="text-sm font-semibold text-slate-500">Change</button></div><p className="mt-2 text-sm text-slate-500">{chosen.duration} minute AI session · ${(chosen.amount / 100).toFixed(2)}</p><div id="ai-stripe-payment-element" className="mt-5 min-h-36"/><button disabled={busy} className="mt-5 w-full rounded-xl bg-[#69705a] px-5 py-3 font-bold text-white transition hover:bg-[#59604c] disabled:opacity-50">{busy ? 'Processing…' : 'Pay securely'}</button></form>}

          <section className="overflow-hidden rounded-3xl border border-[#d8d8ce] bg-white shadow-sm"><div className="border-b border-slate-100 p-5"><h2 className="font-semibold text-slate-950">Session history</h2><p className="mt-1 text-sm text-slate-500">Your previous AI conversations</p></div>{conversations.length ? conversations.map(item => <button key={item.id} onClick={() => {setSelected(item); setError('');}} className={`w-full border-b border-slate-100 p-4 text-left last:border-0 ${selected?.id === item.id ? 'bg-[#f1f4e9]' : 'hover:bg-slate-50'}`}><div className="flex items-center justify-between gap-3"><p className="font-semibold text-slate-900">{item.duration} minute session</p><span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-semibold capitalize text-slate-600">{item.status.replace('_',' ')}</span></div><p className="mt-1 text-xs text-slate-500">{new Date(item.start_date).toLocaleString()}</p></button>) : <p className="p-6 text-center text-sm text-slate-500">Your first session will appear here.</p>}</section>
        </aside>

        <main className="flex min-h-[650px] min-w-0 flex-col overflow-hidden rounded-3xl border border-[#d8d8ce] bg-white shadow-sm">{selected ? <><header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-6 py-5"><div><h2 className="text-xl font-semibold text-slate-950">AI Advisor</h2><p className="mt-1 text-sm text-slate-500">{selected.duration} minutes · {active ? 'Session active' : 'Session ended'}</p></div>{active && <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">Live now</span>}</header><div className="flex-1 space-y-4 overflow-y-auto bg-[#fafaf7] p-5 md:p-7">{messages.length ? messages.map(message => <div key={message.id} className={`flex ${message.is_mine ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[85%] rounded-2xl px-4 py-3 md:max-w-[72%] ${message.is_mine ? 'rounded-br-md bg-[#59604c] text-white' : 'rounded-bl-md border border-slate-200 bg-white text-slate-900'}`}><p className="text-xs font-semibold opacity-65">{message.is_mine ? 'You' : 'AI Advisor'}</p>{message.content && <p className="mt-1 whitespace-pre-wrap text-sm leading-6">{message.content}</p>}{message.audio && <audio controls src={message.audio} className="mt-2 max-w-full"/>}<p className="mt-1 text-[11px] opacity-50">{new Date(message.created_at).toLocaleTimeString()}</p></div></div>) : <div className="flex h-full items-center justify-center"><div className="max-w-sm text-center"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eff4e3] text-2xl">✦</div><h3 className="mt-4 text-lg font-semibold text-slate-900">Start with what is on your mind</h3><p className="mt-2 text-sm leading-6 text-slate-500">Describe the workplace situation, decision or conversation you want help thinking through.</p></div></div>}<div ref={end}/></div><form onSubmit={send} className="flex gap-3 border-t border-slate-100 p-4 md:p-5"><input value={content} onChange={event => setContent(event.target.value)} disabled={!active || busy} maxLength={4000} placeholder={active ? 'Message your AI Advisor…' : 'This paid session has ended'} className="min-w-0 flex-1 rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-[#69705a] disabled:bg-slate-100"/><button disabled={!active || !content.trim() || busy} className="rounded-xl bg-[#69705a] px-5 py-3 font-bold text-white disabled:opacity-50">Send</button></form></> : <div className="flex flex-1 items-center justify-center p-8"><div className="max-w-md text-center"><div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-[#eff4e3] text-3xl">✦</div><h2 className="mt-5 text-2xl font-semibold text-slate-950">Your AI session space</h2><p className="mt-3 leading-7 text-slate-500">Purchase a session on the left, then start it whenever you are ready. Your conversation will appear here.</p></div></div>}</main>
      </div>
    </div>
  </div>;
}
