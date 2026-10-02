import Image from "next/image";
import Link from "next/link";

const links = {
  Platform: [["Find an advisor", "/program/advisors"], ["AI sessions", "/program/messages"], ["Become an advisor", "/program/onboard"], ["Community", "https://community.workspherepulse.com"]],
  Company: [["About", "/about"], ["Contact", "/contact"], ["Service guarantee", "/service-guarantee"], ["Seller FAQ", "/seller-faq"]],
  Legal: [["Terms of service", "/terms"], ["Privacy policy", "/privacy"], ["Cancellations & refunds", "/cancellations-refunds"], ["Advisor agreement", "/seller-AUP"]],
};

export default function Footer() {
  return <footer className="bg-[#11150f] text-white"><div className="mx-auto max-w-7xl px-6 py-16"><div className="grid gap-12 lg:grid-cols-[1.3fr_2fr]"><div><Image src="/images/logo.png" alt="Workspherepulse" width={128} height={48} className="brightness-0 invert"/><p className="mt-6 max-w-sm leading-7 text-slate-400">Professional guidance, shared experience and practical support for navigating workplace challenges.</p><a href="mailto:admin@workspherepulse.com" className="mt-6 inline-block font-semibold text-white hover:text-[#d5a1ab]">admin@workspherepulse.com</a></div><div className="grid gap-8 sm:grid-cols-3">{Object.entries(links).map(([group, values]) => <div key={group}><h2 className="text-sm font-bold uppercase tracking-[0.16em] text-slate-500">{group}</h2><ul className="mt-5 space-y-3">{values.map(([label, href]) => <li key={href}><Link href={href} className="text-sm text-slate-300 transition hover:text-white">{label}</Link></li>)}</ul></div>)}</div></div><div className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-7 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between"><p>© {new Date().getFullYear()} Workspherepulse LLC. All rights reserved.</p><p>Secure sessions · Transparent pricing · Verified accounts</p></div></div></footer>;
}
