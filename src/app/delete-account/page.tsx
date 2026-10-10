"use client";

import Link from "next/link";
import {useState} from "react";
import {useAuth} from "@/app/contexts/AuthContext";

export default function DeleteAccountPage() {
  const {user, isLoading, logout} = useAuth();
  const [working, setWorking] = useState(false);
  const [complete, setComplete] = useState(false);
  const [error, setError] = useState("");

  async function requestDeletion() {
    setWorking(true);
    setError("");
    try {
      const response = await fetch("/api/backend/profile/delete-account", {method: "POST"});
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.success) throw new Error(data.error || "We could not submit your request.");
      setComplete(true);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "We could not submit your request.");
    } finally {
      setWorking(false);
    }
  }

  return <main className="bg-slate-50 px-6 py-20">
    <section className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-12">
      <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#69705a]">Account controls</p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950">Delete your Workspherepulse account</h1>
      <p className="mt-5 leading-7 text-slate-600">Submit a deletion request for your website, mobile app and community account. We will remove your profile and personal data, except records we must retain for payment, fraud prevention, tax or legal obligations.</p>
      {isLoading ? <p className="mt-8 text-slate-600">Checking your account…</p> : !user ? <div className="mt-8 rounded-2xl bg-slate-100 p-6">
        <p className="text-slate-700">Sign in to verify the account you want deleted.</p>
        <Link href="/login?return_to=%2Fdelete-account" className="mt-4 inline-flex rounded-xl bg-slate-950 px-5 py-3 font-bold text-white">Sign in to continue</Link>
      </div> : complete ? <div className="mt-8 rounded-2xl bg-emerald-50 p-6 text-emerald-900">
        <h2 className="text-xl font-bold">Request received</h2>
        <p className="mt-2">Your deletion request is pending. You can now sign out of this device.</p>
        <button onClick={() => void logout()} className="mt-4 rounded-xl bg-emerald-800 px-5 py-3 font-bold text-white">Sign out</button>
      </div> : <div className="mt-8">
        <p className="font-semibold text-slate-900">Signed in as {user.email}</p>
        <p className="mt-2 text-sm text-slate-600">This request affects your access across Workspherepulse. Active sessions and payment records may require review before deletion is completed.</p>
        {error && <p role="alert" className="mt-4 rounded-xl bg-red-50 p-4 text-red-700">{error}</p>}
        <button onClick={() => void requestDeletion()} disabled={working} className="mt-6 rounded-xl bg-red-700 px-5 py-3 font-bold text-white disabled:opacity-60">{working ? "Submitting…" : "Request account deletion"}</button>
      </div>}
    </section>
  </main>;
}
