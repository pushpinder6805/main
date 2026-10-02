"use client";

import Link from "next/link";
import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {useAuth} from "@/app/contexts/AuthContext";
import {apiClient, AdvisorProfile, Appointment} from "@/lib/api-client";

type PayoutStatus = {
  onboarded: boolean;
  payouts_enabled: boolean;
  country?: string;
};

export default function AdvisorDashboard() {
  const router = useRouter();
  const {user, isLoading} = useAuth();
  const [profile, setProfile] = useState<AdvisorProfile | null>(null);
  const [sessions, setSessions] = useState<Appointment[]>([]);
  const [payout, setPayout] = useState<PayoutStatus | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [openingPayouts, setOpeningPayouts] = useState(false);

  useEffect(() => {
    if (isLoading) return;
    if (!user) { router.replace("/login"); return; }
    if (user.type !== "advisor") { router.replace("/program/dashboard"); return; }
    if (!user.onboarded) { router.replace("/program/onboard"); return; }
    if (!user.approved) { router.replace("/program/pending"); return; }

    void Promise.all([
      apiClient.getAdvisorProfile(),
      apiClient.getAppointments(),
      fetch("/api/payments/advisor/status", {cache: "no-store"}).then(async response => {
        const body = await response.json();
        if (!response.ok) throw new Error(body.error || "Unable to check payout setup.");
        return body as PayoutStatus;
      }),
    ]).then(([profileResult, appointmentsResult, payoutStatus]) => {
      if (profileResult.error || appointmentsResult.error) {
        setError(profileResult.error || appointmentsResult.error || "Unable to load advisor data.");
      } else {
        setProfile(profileResult.data || null);
        setSessions(appointmentsResult.data || []);
      }
      setPayout(payoutStatus);
    }).catch(reason => {
      setError(reason instanceof Error ? reason.message : "Unable to load advisor dashboard.");
    }).finally(() => setLoading(false));
  }, [user, isLoading, router]);

  async function continuePayoutSetup() {
    setError("");
    setOpeningPayouts(true);
    try {
      const response = await fetch("/api/payments/advisor/onboard", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({country: "US"}),
      });
      const body = await response.json();
      if (!response.ok || !body.url) throw new Error(body.error || "Unable to open payout setup.");
      window.location.assign(body.url);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to open payout setup.");
      setOpeningPayouts(false);
    }
  }

  if (isLoading || loading) return <div className="min-h-[70vh] flex items-center justify-center text-slate-600">Loading advisor dashboard…</div>;
  if (!user) return null;

  const upcoming = sessions.filter(item => !item.is_deleted && ["scheduled", "started"].includes(item.status));
  const completed = sessions.filter(item => item.status === "completed");
  const rate = profile?.pricing?.find(item => item.is_active);
  const payoutReady = Boolean(payout?.onboarded && payout?.payouts_enabled);

  return <div className="min-h-screen bg-slate-50 px-4 py-12"><div className="mx-auto max-w-6xl space-y-8">
    <div className="flex flex-wrap items-center justify-between gap-4"><div><p className="eyebrow">Advisor workspace</p><h1 className="mt-2 text-4xl font-bold text-slate-950">Welcome, {user.name || user.username}</h1><p className="mt-2 text-slate-600">{rate ? `${rate.currency} ${rate.amount}/minute` : "Add your active session rate"}</p></div><Link href="/program/appointments" className="rounded-xl bg-slate-950 px-5 py-3 font-bold text-white transition hover:bg-slate-800">View all meetings</Link></div>
    {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">{error}</p>}

    <section className={`rounded-3xl border p-6 ${payoutReady ? "border-emerald-200 bg-emerald-50" : "border-amber-200 bg-amber-50"}`}>
      <div className="flex flex-wrap items-center justify-between gap-5"><div><p className={`text-xs font-bold uppercase tracking-[0.18em] ${payoutReady ? "text-emerald-700" : "text-amber-700"}`}>Payout account</p><h2 className="mt-2 text-2xl font-bold text-slate-950">{payoutReady ? "Ready to accept bookings" : "Complete Stripe payout setup"}</h2><p className="mt-2 max-w-2xl text-slate-600">{payoutReady ? "Customers can book and pay for your available session times. Earnings are released after a successfully completed session." : "Customers cannot book you until Stripe verifies your identity and enables transfers. Setup is hosted securely by Stripe."}</p></div>{!payoutReady && <button onClick={continuePayoutSetup} disabled={openingPayouts} className="rounded-xl bg-[#69705a] px-5 py-3 font-bold text-white shadow-sm transition hover:bg-[#59604c] disabled:opacity-60">{openingPayouts ? "Opening Stripe…" : payout ? "Continue payout setup" : "Set up payouts"}</button>}</div>
    </section>

    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"><Stat label="Wallet" value={`${profile?.wallet.currency || "USD"} ${(profile?.wallet.balance || 0).toFixed(2)}`}/><Stat label="Upcoming" value={upcoming.length.toString()}/><Stat label="Completed" value={completed.length.toString()}/><Stat label="Released earnings" value={`${profile?.wallet.currency || "USD"} ${(profile?.stats?.earnings || 0).toFixed(2)}`}/></div>
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex items-center justify-between"><div><p className="eyebrow">Schedule</p><h2 className="mt-2 text-2xl font-bold text-slate-950">Upcoming customer meetings</h2></div><span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-bold text-slate-600">{upcoming.length}</span></div><div className="mt-5 space-y-3">{upcoming.length ? upcoming.slice(0, 8).map(item => <div key={item.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 p-4"><div><p className="font-bold text-slate-950">{item.user_name}</p><p className="mt-1 text-sm text-slate-600">{new Date(item.start_date).toLocaleString()} · {item.duration} minutes</p></div><Link href="/program/appointments" className="font-bold text-[#69705a]">Open meeting →</Link></div>) : <p className="py-10 text-center text-slate-500">No upcoming customer meetings.</p>}</div></section>
  </div></div>;
}

function Stat({label, value}: {label: string; value: string}) {
  return <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><p className="text-sm font-medium text-slate-500">{label}</p><p className="mt-2 text-2xl font-bold text-slate-950">{value}</p></div>;
}
