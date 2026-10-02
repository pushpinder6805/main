import Image from "next/image";
import {
  ChatBubbleLeftRightIcon,
  HeartIcon,
  LockClosedIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import {InfoHero, PageCTA} from "@/app/components/InfoPage";

const values = [
  {title: "Human understanding", text: "Real workplace experiences deserve thoughtful, practical and respectful support.", icon: HeartIcon},
  {title: "Trust and privacy", text: "Confidential guidance, verified accounts and clear choices shape every part of the platform.", icon: LockClosedIcon},
  {title: "Useful next steps", text: "Support should help people move forward with greater clarity, confidence and perspective.", icon: ChatBubbleLeftRightIcon},
];

export default function AboutPage() {
  return <main className="min-h-screen bg-slate-50">
    <InfoHero eyebrow="About Workspherepulse" title="Workplace support built around real conversations." description="Workspherepulse connects people navigating workplace challenges with approved advisors, structured AI guidance and a supportive professional community." action={{label: "Explore the community", href: "https://community.workspherepulse.com/"}} />

    <section className="bg-white py-20"><div className="mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center"><div><p className="eyebrow">Our story</p><h2 className="section-title mt-3">A clearer place to talk about work.</h2><div className="mt-6 space-y-4 leading-8 text-slate-600"><p>Workspherepulse began in 2024 with a simple idea: people should have a trusted place to discuss workplace challenges and find useful support.</p><p>What started as a community for shared experience has grown into a connected platform for private advisor sessions, practical resources and timed AI guidance. Users can choose support based on expertise, availability and their own needs.</p><p>We focus on everyday workplace wellbeing, communication, leadership, conflict, motivation and work–life balance. Our services provide general professional guidance and are not a substitute for clinical or emergency care.</p></div></div><div className="relative min-h-[420px] overflow-hidden rounded-[2rem] bg-[#eff0ea]"><Image src="/images/banner.avif" alt="Sunlight through green leaves" fill sizes="(max-width: 1024px) 100vw, 45vw" className="object-cover"/><div className="absolute inset-x-5 bottom-5 rounded-2xl bg-white/90 p-5 shadow-lg backdrop-blur"><p className="text-sm font-bold text-slate-950">One connected Workspherepulse account</p><p className="mt-1 text-sm text-slate-600">Website, mobile app and professional community.</p></div></div></div></section>

    <section className="bg-slate-50 py-20"><div className="mx-auto max-w-6xl px-6"><div className="max-w-3xl"><p className="eyebrow">What guides us</p><h2 className="section-title mt-3">Support should feel safe, clear and useful.</h2></div><div className="mt-10 grid gap-6 md:grid-cols-3">{values.map(value => <article key={value.title} className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#69705a]/10 text-[#59604c]"><value.icon className="h-6 w-6"/></div><h3 className="mt-5 text-xl font-bold text-slate-950">{value.title}</h3><p className="mt-3 leading-7 text-slate-600">{value.text}</p></article>)}</div></div></section>

    <section className="bg-[#eff0ea] py-20"><div className="mx-auto grid max-w-6xl gap-8 px-6 lg:grid-cols-3"><div className="lg:col-span-1"><UserGroupIcon className="h-9 w-9 text-[#59604c]"/><h2 className="mt-5 text-3xl font-bold text-slate-950">A platform with three ways to find support.</h2></div><div className="grid gap-4 sm:grid-cols-3 lg:col-span-2">{[{n:"01",t:"Community",d:"Learn from shared workplace experiences."},{n:"02",t:"Human advisors",d:"Book private sessions with approved professionals."},{n:"03",t:"AI guidance",d:"Use timed sessions for immediate structured reflection."}].map(item => <div key={item.n} className="rounded-3xl bg-white p-6"><p className="text-xs font-bold tracking-[0.18em] text-slate-400">{item.n}</p><h3 className="mt-5 text-lg font-bold text-slate-950">{item.t}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{item.d}</p></div>)}</div></div></section>

    <PageCTA title="Find the support that fits your situation." description="Browse approved advisors, join the Workspherepulse community or create an account for connected access across the platform." primary={{label:"Find an advisor",href:"/program/advisors"}} secondary={{label:"Contact us",href:"/contact"}} />
  </main>;
}
