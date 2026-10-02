import Link from "next/link";
import type {ReactNode} from "react";
import {
  ArrowRightIcon,
  CheckIcon,
  DocumentTextIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";

export function InfoHero({eyebrow, title, description, action}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: {label: string; href: string};
}) {
  return <section className="relative overflow-hidden border-b border-slate-200 bg-white py-20 sm:py-24">
    <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#d5a1ab]/15 blur-3xl" />
    <div className="pointer-events-none absolute -bottom-36 -left-24 h-96 w-96 rounded-full bg-[#69705a]/10 blur-3xl" />
    <div className="relative mx-auto max-w-6xl px-6">
      <div className="max-w-3xl">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="section-title mt-4">{title}</h1>
        <p className="section-copy mt-6 max-w-2xl">{description}</p>
        {action && <Link href={action.href} className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#69705a] px-6 py-3 font-bold text-white transition hover:bg-[#59604c]">{action.label}<ArrowRightIcon className="h-4 w-4" /></Link>}
      </div>
    </div>
  </section>;
}

export function ArticleLayout({children, label = "Workspherepulse", updated = "October 2, 2026", aside}: {
  children: ReactNode;
  label?: string;
  updated?: string;
  aside?: ReactNode;
}) {
  return <section className="bg-slate-50 py-16 sm:py-20">
    <div className="mx-auto grid max-w-6xl gap-8 px-6 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start">
      <article className="space-y-6">{children}</article>
      <aside className="space-y-5 lg:sticky lg:top-28">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <DocumentTextIcon className="h-7 w-7 text-[#69705a]" />
          <p className="mt-4 text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Document details</p>
          <dl className="mt-4 space-y-4 text-sm"><div><dt className="text-slate-500">Applies to</dt><dd className="mt-1 font-bold text-slate-950">{label}</dd></div><div><dt className="text-slate-500">Last updated</dt><dd className="mt-1 font-bold text-slate-950">{updated}</dd></div></dl>
        </div>
        {aside}
        <div className="rounded-3xl bg-[#11150f] p-6 text-white">
          <EnvelopeIcon className="h-7 w-7 text-[#d5a1ab]" />
          <h2 className="mt-4 text-lg font-bold">Have a question?</h2>
          <p className="mt-2 text-sm leading-6 text-slate-300">Contact our team for help with an account, policy, booking or payment.</p>
          <a href="mailto:admin@workspherepulse.com" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-white">Email support<ArrowRightIcon className="h-4 w-4" /></a>
        </div>
      </aside>
    </div>
  </section>;
}

export function ArticleSection({number, title, children}: {number?: string; title: string; children: ReactNode}) {
  return <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
    <div className="flex gap-4">
      {number && <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#69705a]/10 text-sm font-bold text-[#59604c]">{number}</span>}
      <div className="min-w-0 flex-1"><h2 className="text-xl font-bold text-slate-950 sm:text-2xl">{title}</h2><div className="mt-4 space-y-4 leading-7 text-slate-600">{children}</div></div>
    </div>
  </section>;
}

export function CheckList({items}: {items: ReactNode[]}) {
  return <ul className="space-y-3">{items.map((item, index) => <li key={index} className="flex gap-3"><span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700"><CheckIcon className="h-3.5 w-3.5" /></span><span>{item}</span></li>)}</ul>;
}

export function PageCTA({title, description, primary, secondary}: {
  title: string;
  description: string;
  primary: {label: string; href: string};
  secondary?: {label: string; href: string};
}) {
  return <section className="bg-white py-20"><div className="mx-auto max-w-5xl px-6"><div className="rounded-[2rem] bg-[#11150f] px-7 py-12 text-center text-white sm:px-12"><h2 className="text-3xl font-bold sm:text-4xl">{title}</h2><p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-300">{description}</p><div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"><Link href={primary.href} className="rounded-full bg-[#d5a1ab] px-6 py-3 font-bold text-[#11150f] transition hover:bg-[#e2bbc2]">{primary.label}</Link>{secondary && <Link href={secondary.href} className="rounded-full border border-white/20 px-6 py-3 font-bold text-white transition hover:bg-white/10">{secondary.label}</Link>}</div></div></div></section>;
}
