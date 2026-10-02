"use client";

import Image from "next/image";
import Link from "next/link";
import {useState} from "react";
import {ChevronDownIcon, XMarkIcon, Bars3Icon} from "@heroicons/react/24/outline";
import {useAuth} from "@/app/contexts/AuthContext";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [programOpen, setProgramOpen] = useState(false);
  const {user, logout} = useAuth();
  const advisor = user?.type === "advisor";

  const programLinks = advisor ? [
    ["Advisor dashboard", "/program/advisor-dashboard"],
    ["My meetings", "/program/appointments"],
  ] : [
    ["Browse advisors", "/program/advisors"],
    ["My dashboard", "/program/dashboard"],
    ["Appointments", "/program/appointments"],
    ["AI sessions", "/program/messages"],
    ["Become an advisor", "/program/onboard"],
  ];

  return <header className="sticky top-0 z-[60] border-b border-slate-200/80 bg-white/95 shadow-[0_1px_20px_rgba(15,23,42,0.04)] backdrop-blur">
    <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-6">
      <Link href="/" className="flex items-center gap-3" aria-label="Workspherepulse home"><Image src="/images/logo.png" alt="" width={104} height={40} priority className="w-[104px]" style={{height: "auto"}}/></Link>
      <nav className="hidden items-center gap-8 md:flex" aria-label="Primary navigation">
        <Link href="/" className="nav-link">Home</Link>
        <div className="relative"><button type="button" onClick={() => setProgramOpen(value => !value)} className="nav-link inline-flex items-center gap-1" aria-expanded={programOpen}>Program <ChevronDownIcon className={`h-4 w-4 transition ${programOpen ? "rotate-180" : ""}`}/></button>{programOpen && <><button aria-label="Close menu" className="fixed inset-0 z-40 cursor-default" onClick={() => setProgramOpen(false)}/><div className="absolute left-1/2 top-full z-50 mt-4 w-64 -translate-x-1/2 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">{programLinks.map(([label, href]) => <Link key={href} href={href} onClick={() => setProgramOpen(false)} className="block rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-950">{label}</Link>)}</div></>}
        </div>
        <Link href="/about" className="nav-link">About</Link>
        <Link href="/contact" className="nav-link">Contact</Link>
        <Link href="https://community.workspherepulse.com/" className="nav-link">Community</Link>
      </nav>
      <div className="hidden items-center gap-3 md:flex">{user ? <><span className="max-w-40 truncate text-sm font-semibold text-slate-600">{user.name || user.username}</span><button onClick={logout} className="rounded-full border border-slate-300 px-5 py-2.5 text-sm font-bold text-slate-800 transition hover:border-slate-500">Sign out</button></> : <><Link href="/login" className="rounded-full px-5 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-100">Sign in</Link><Link href="/signup" className="rounded-full bg-[#69705a] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#59604c]">Create account</Link></>}</div>
      <button type="button" className="rounded-xl border border-slate-200 p-2.5 text-slate-800 md:hidden" onClick={() => setMobileOpen(value => !value)} aria-expanded={mobileOpen} aria-label="Toggle navigation">{mobileOpen ? <XMarkIcon className="h-6 w-6"/> : <Bars3Icon className="h-6 w-6"/>}</button>
    </div>
    {mobileOpen && <nav className="border-t border-slate-200 bg-white px-5 py-5 md:hidden" aria-label="Mobile navigation"><div className="mx-auto max-w-7xl space-y-1"><MobileLink href="/" close={() => setMobileOpen(false)}>Home</MobileLink><p className="px-3 pb-1 pt-4 text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Program</p>{programLinks.map(([label, href]) => <MobileLink key={href} href={href} close={() => setMobileOpen(false)}>{label}</MobileLink>)}<MobileLink href="/about" close={() => setMobileOpen(false)}>About</MobileLink><MobileLink href="/contact" close={() => setMobileOpen(false)}>Contact</MobileLink><MobileLink href="https://community.workspherepulse.com/" close={() => setMobileOpen(false)}>Community</MobileLink><div className="mt-4 grid gap-2 border-t border-slate-200 pt-4">{user ? <button onClick={() => {setMobileOpen(false); logout();}} className="rounded-xl bg-slate-950 px-4 py-3 text-center font-bold text-white">Sign out</button> : <><MobileLink href="/login" close={() => setMobileOpen(false)}>Sign in</MobileLink><Link href="/signup" onClick={() => setMobileOpen(false)} className="rounded-xl bg-[#69705a] px-4 py-3 text-center font-bold text-white">Create account</Link></>}</div></div></nav>}
  </header>;
}

function MobileLink({href, close, children}: {href: string; close: () => void; children: React.ReactNode}) {
  return <Link href={href} onClick={close} className="block rounded-xl px-3 py-3 font-semibold text-slate-700 hover:bg-slate-100">{children}</Link>;
}
