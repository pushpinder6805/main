"use client";

import Image from 'next/image';
import Link from 'next/link';
import {FormEvent, useEffect, useRef, useState} from 'react';
import {useParams, useRouter} from 'next/navigation';
import {useAuth} from '@/app/contexts/AuthContext';
import {Advisor, apiClient} from '@/lib/api-client';

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
    script.onerror = () => reject(new Error('Unable to load secure payment form.'));
    document.head.appendChild(script);
  });
  return stripeLoader;
}

export default function AdvisorProfilePage() {
  const params = useParams();
  const router = useRouter();
  const {user, isLoading} = useAuth();
  const [advisor, setAdvisor] = useState<Advisor | null>(null);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [duration, setDuration] = useState(30);
  const [customerFee, setCustomerFee] = useState(0);
  const [publishableKey, setPublishableKey] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [preparing, setPreparing] = useState(false);
  const [paying, setPaying] = useState(false);
  const stripe = useRef<StripeClient | null>(null);
  const elements = useRef<StripeElements | null>(null);
  const paymentElement = useRef<StripePaymentElement | null>(null);

  useEffect(() => {
    if (isLoading) return;
    if (!user) { router.replace('/login'); return; }
    if (user.type === 'advisor') { router.replace('/program/advisor-dashboard'); return; }
    void Promise.all([apiClient.getAdvisors(), fetch('/api/payments/config', {cache: 'no-store'}).then(response => response.json())])
      .then(([result, config]) => {
        if (result.error) setError(result.error);
        else {
          const found = (result.data || []).find(item => String(item.id) === String(params.id));
          if (found) setAdvisor(found); else setError('Advisor not found or no longer available.');
        }
        if (config.enabled && config.publishable_key) {
          setPublishableKey(config.publishable_key);
          setCustomerFee(Number(config.customer_fee_percent) || 0);
        }
      }).catch(() => setError('Unable to load the advisor and payment configuration.')).finally(() => setLoading(false));
  }, [user, isLoading, router, params.id]);

  useEffect(() => {
    if (!clientSecret || !publishableKey) return;
    let cancelled = false;
    void loadStripeJs().then(() => {
      if (cancelled || !window.Stripe) return;
      stripe.current = window.Stripe(publishableKey);
      elements.current = stripe.current.elements({clientSecret});
      paymentElement.current = elements.current.create('payment');
      paymentElement.current.mount('#stripe-payment-element');
    }).catch(reason => setError(reason instanceof Error ? reason.message : 'Unable to load secure payment form.'));
    return () => { cancelled = true; paymentElement.current?.destroy(); paymentElement.current = null; elements.current = null; stripe.current = null; };
  }, [clientSecret, publishableKey]);

  async function prepare(event: FormEvent) {
    event.preventDefault();
    if (!advisor || !date || !time) { setError('Choose a date and time.'); return; }
    setError(''); setPreparing(true);
    try {
      const start = new Date(`${date}T${time}:00`);
      if (Number.isNaN(start.getTime())) throw new Error('Choose a valid date and time.');
      const bookingResponse = await fetch('/api/payments/bookings', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({request_id: crypto.randomUUID(), advisor: advisor.username, start_date: start.toISOString(), duration})});
      const booking = await bookingResponse.json();
      if (!bookingResponse.ok) throw new Error(booking.error || 'Unable to reserve this time.');
      const paymentResponse = await fetch(`/api/payments/appointments/${booking.appointment_id}/prepare`, {method: 'POST'});
      const payment = await paymentResponse.json();
      if (!paymentResponse.ok || !payment.client_secret) throw new Error(payment.error || 'Unable to prepare payment.');
      setClientSecret(payment.client_secret);
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Unable to prepare payment.'); }
    finally { setPreparing(false); }
  }

  async function pay(event: FormEvent) {
    event.preventDefault();
    if (!stripe.current || !elements.current) return;
    setError(''); setPaying(true);
    const result = await stripe.current.confirmPayment({elements: elements.current, confirmParams: {return_url: `${window.location.origin}/program/appointments`}});
    if (result.error) setError(result.error.message || 'Payment could not be completed.');
    setPaying(false);
  }

  if (isLoading || loading) return <div className="min-h-[70vh] flex items-center justify-center text-gray-600">Loading advisor…</div>;
  if (!advisor) return <div className="min-h-[70vh] flex items-center justify-center px-4"><div className="rounded-2xl bg-white p-8 text-center shadow"><h1 className="text-2xl font-bold text-gray-900">Advisor unavailable</h1><p className="mt-3 text-gray-600">{error}</p><Link href="/program/advisors" className="mt-6 inline-block font-semibold text-blue-600">Browse advisors</Link></div></div>;
  const price = advisor.pricing.find(item => item.is_active);
  const base = Number(price?.amount || 0) * duration;
  const total = base * (1 + customerFee / 100);
  return <div className="min-h-screen bg-slate-50 py-10 px-4"><div className="mx-auto max-w-6xl space-y-6"><Link href="/program/advisors" className="font-semibold text-[#69705a]">← All advisors</Link><section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"><div className="flex flex-wrap items-center gap-6"><Image src={advisor.avatar_url || '/images/logo.png'} alt={advisor.name || advisor.username} width={112} height={112} className="h-28 w-28 rounded-3xl object-cover ring-1 ring-slate-200"/><div><div className={`mb-3 inline-flex rounded-full px-3 py-1 text-xs font-bold ${advisor.payment_ready ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>{advisor.payment_ready ? 'Ready for booking' : 'Payout setup pending'}</div><h1 className="text-3xl font-bold text-slate-950">{advisor.name || advisor.username}</h1><p className="mt-1 text-slate-500">@{advisor.username} · {advisor.timezone}</p><p className="mt-2 font-semibold text-amber-600">★ {(advisor.rating || 0).toFixed(1)}</p>{price && <p className="mt-2 text-lg font-bold text-slate-950">{price.currency} {price.amount}/minute</p>}</div></div><div className="mt-8 grid gap-8 lg:grid-cols-[1fr_390px]"><div><h2 className="text-xl font-bold text-slate-950">About</h2><p className="mt-3 whitespace-pre-wrap leading-7 text-slate-600">{advisor.about_me}</p><h2 className="mt-7 text-xl font-bold text-slate-950">Expertise</h2><div className="mt-3 flex flex-wrap gap-2">{advisor.skills.map(value => <span key={value.id} className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">{value.name}</span>)}</div><h2 className="mt-7 text-xl font-bold text-slate-950">Weekly availability</h2><div className="mt-3 grid gap-2 sm:grid-cols-2">{advisor.availabilities.map((slot,index) => <div key={`${slot.day_of_week}-${index}`} className="flex justify-between rounded-xl border border-slate-200 px-4 py-3"><span className="capitalize font-medium">{slot.day_of_week}</span><span className="text-slate-600">{slot.start_time.slice(0,5)}–{slot.end_time.slice(0,5)}</span></div>)}</div></div><aside className="rounded-3xl border border-slate-200 bg-slate-50 p-6">{!advisor.payment_ready ? <div><p className="text-sm font-bold uppercase tracking-[0.16em] text-amber-700">Temporarily unavailable</p><h2 className="mt-3 text-xl font-bold text-slate-950">Booking opens after payout setup</h2><p className="mt-3 leading-6 text-slate-600">This approved advisor is completing secure payout verification. Choose another ready advisor or check back soon.</p><Link href="/program/advisors" className="mt-6 inline-flex rounded-xl bg-slate-900 px-4 py-3 font-bold text-white">Browse ready advisors</Link></div> : clientSecret ? <form onSubmit={pay}><h2 className="text-xl font-bold text-slate-950">Secure payment</h2><p className="mt-2 text-sm text-slate-600">Total: USD {total.toFixed(2)}</p><div id="stripe-payment-element" className="mt-5 min-h-32"/>{error && <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}<button disabled={paying} className="mt-5 w-full rounded-xl bg-[#69705a] px-4 py-3 font-bold text-white disabled:opacity-60">{paying ? 'Processing…' : `Pay USD ${total.toFixed(2)}`}</button></form> : <form onSubmit={prepare} className="space-y-4"><h2 className="text-xl font-bold text-slate-950">Book a video session</h2><label className="block text-sm font-semibold text-slate-700">Date<input type="date" min={new Date().toISOString().slice(0,10)} value={date} onChange={event => setDate(event.target.value)} required className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-2"/></label><label className="block text-sm font-semibold text-slate-700">Your local time<input type="time" value={time} onChange={event => setTime(event.target.value)} required className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-2"/></label><label className="block text-sm font-semibold text-slate-700">Duration<select value={duration} onChange={event => setDuration(Number(event.target.value))} className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-2"><option value={15}>15 minutes</option><option value={30}>30 minutes</option><option value={40}>40 minutes</option></select></label><div className="rounded-xl bg-white p-4 text-sm"><div className="flex justify-between"><span>Advisor session</span><span>USD {base.toFixed(2)}</span></div><div className="mt-1 flex justify-between"><span>Customer fee ({customerFee}%)</span><span>USD {(total-base).toFixed(2)}</span></div><div className="mt-3 flex justify-between border-t border-slate-200 pt-3 font-bold"><span>Total</span><span>USD {total.toFixed(2)}</span></div></div>{error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}<button disabled={preparing || !publishableKey || !price} className="w-full rounded-xl bg-[#69705a] px-4 py-3 font-bold text-white disabled:opacity-60">{preparing ? 'Reserving…' : 'Continue to secure payment'}</button></form>}</aside></div></section></div></div>;
}
