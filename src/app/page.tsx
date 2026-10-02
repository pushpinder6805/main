import Image from "next/image";
import Link from "next/link";
import {
  ArrowRightIcon,
  CalendarDaysIcon,
  ChatBubbleLeftRightIcon,
  CheckBadgeIcon,
  CreditCardIcon,
  LockClosedIcon,
  SparklesIcon,
  UserGroupIcon,
  VideoCameraIcon,
} from "@heroicons/react/24/outline";

const services = [
  {title: "Workplace wellbeing", description: "Practical support for stress, confidence and sustainable performance at work.", image: "/images/Workplace-Wellbeing.jpg"},
  {title: "Communication", description: "Build clearer conversations, stronger boundaries and healthier professional relationships.", image: "/images/Effective-Communication.jpg"},
  {title: "Conflict resolution", description: "Navigate difficult workplace dynamics with structured, confidential guidance.", image: "/images/Common.png"},
  {title: "Leadership confidence", description: "Develop the clarity and presence to lead teams through complex situations.", image: "/images/lead.png"},
  {title: "Toxic work culture", description: "Recognise patterns, protect your wellbeing and plan constructive next steps.", image: "/images/toxic.png"},
  {title: "Work–life balance", description: "Create routines and expectations that support your work and your life.", image: "/images/work-life.jpg"},
];

const benefits = [
  {title: "Vetted advisors", description: "Advisor applications are reviewed before profiles become available for booking.", icon: CheckBadgeIcon},
  {title: "Pay per session", description: "Choose the duration you need and see the complete price before checkout.", icon: CreditCardIcon},
  {title: "Private by design", description: "Account, booking and payment details use secure, verified systems.", icon: LockClosedIcon},
  {title: "One connected account", description: "Use the same Workspherepulse identity across the website, app and community.", icon: UserGroupIcon},
];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden">
        <div className="relative mx-auto grid min-h-[80vh] grid-cols-1 lg:grid-cols-2">

          {/* LEFT: Text */}
          <div className="flex items-center bg-[rgb(75,78,61)] px-6 py-16 text-white lg:px-20">
            <div className="max-w-2xl">
              <h1 className="mb-4 text-4xl font-bold leading-tight md:text-6xl">
                Let's navigate together - address workplace issues, build bridges
              </h1>

              <p className="mb-8 text-xl text-slate-200">
                Our website is dedicated to professional growth through shared
                experiences and communal advice to foster mental and emotional
                well-being at your place of work.
              </p>

              <div className="flex flex-col gap-4 sm:flex-row">
                <Link
                  href="https://test.workspherepulse.com/"
                  className="rounded-md bg-blue-600 px-6 py-3 text-center font-bold text-white transition-colors hover:bg-blue-700"
                >
                  Join Workspherepulse
                </Link>
                
              </div>
            </div>
          </div>

          {/* RIGHT: Image */}
          <div className="relative h-[320px] lg:h-auto">
            <Image
              src="/images/banner.avif"
              alt="worksphere green banner"
              fill
              priority
              className="object-cover"
              style={{ objectPosition: "center top" }}
            />
          </div>
          
          {/* CENTER GRADIENT DIVIDER */}
          <div
            className="
              pointer-events-none
              absolute
              top-0
              bottom-0
              left-1/2
              z-30
              hidden
              w-[35px]
              -translate-x-1/2
              bg-gradient-to-r
              from-[rgb(75,78,61)]
              to-transparent
              lg:block
            "
          />
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-px bg-slate-200 sm:grid-cols-3">
          {[{value: "1:1", label: "Private advisor sessions"}, {value: "15–40 min", label: "Flexible session lengths"}, {value: "One account", label: "Website, app and community"}].map(item => <div key={item.label} className="bg-white px-6 py-7 text-center"><p className="text-2xl font-bold text-slate-950">{item.value}</p><p className="mt-1 text-sm text-slate-500">{item.label}</p></div>)}
        </div>
      </section>

      <section className="bg-slate-50 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-3xl"><p className="eyebrow">Support for real work challenges</p><h2 className="section-title mt-3">Find clear next steps, with guidance built around your situation.</h2><p className="section-copy mt-5">Browse focused areas of support, review advisor expertise and book a time that fits your schedule.</p></div>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">{services.map(service => <article key={service.title} className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"><div className="relative h-52 overflow-hidden"><Image src={service.image} alt="" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition duration-500 group-hover:scale-105"/></div><div className="p-6"><h3 className="text-xl font-bold text-slate-950">{service.title}</h3><p className="mt-3 leading-6 text-slate-600">{service.description}</p><Link href="/program/advisors" className="mt-5 inline-flex items-center gap-2 font-bold text-[#69705a]">Find an advisor <ArrowRightIcon className="h-4 w-4"/></Link></div></article>)}</div>
        </div>
      </section>

      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center"><div><p className="eyebrow">A simpler way to get support</p><h2 className="section-title mt-3">From searching to meeting, every step stays clear.</h2><p className="section-copy mt-5">Choose the type of support you need. Workspherepulse keeps profiles, availability, payment and meeting details connected.</p><Link href="/signup" className="mt-8 inline-flex items-center gap-2 rounded-full bg-slate-950 px-6 py-3 font-bold text-white transition hover:bg-slate-800">Create your account <ArrowRightIcon className="h-4 w-4"/></Link></div><ol className="space-y-4">{[
            {title: "Discover the right advisor", text: "Search approved profiles by expertise, rate and availability.", icon: UserGroupIcon},
            {title: "Choose your session", text: "Select a date, local time and session length with transparent pricing.", icon: CalendarDaysIcon},
            {title: "Pay securely", text: "Complete checkout through Stripe before the appointment is confirmed.", icon: CreditCardIcon},
            {title: "Meet online", text: "Open the scheduled meeting from your dashboard when it is time to join.", icon: VideoCameraIcon},
          ].map((step, index) => <li key={step.title} className="flex gap-5 rounded-3xl border border-slate-200 bg-slate-50 p-5"><div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#69705a] text-white"><step.icon className="h-6 w-6"/></div><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Step {index + 1}</p><h3 className="mt-1 text-lg font-bold text-slate-950">{step.title}</h3><p className="mt-1 text-slate-600">{step.text}</p></div></li>)}</ol></div>
        </div>
      </section>

      <section className="bg-[#eff0ea] py-24">
        <div className="mx-auto max-w-7xl px-6"><div className="text-center"><p className="eyebrow">Designed for trust</p><h2 className="section-title mx-auto mt-3 max-w-3xl">Professional support without hidden steps.</h2></div><div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">{benefits.map(item => <div key={item.title} className="rounded-3xl bg-white p-6 shadow-sm"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#69705a]/10 text-[#59604c]"><item.icon className="h-6 w-6"/></div><h3 className="mt-5 text-lg font-bold text-slate-950">{item.title}</h3><p className="mt-2 leading-6 text-slate-600">{item.description}</p></div>)}</div></div>
      </section>

      <section className="bg-slate-950 py-24 text-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 lg:grid-cols-2"><div className="rounded-3xl border border-white/10 bg-white/5 p-8"><ChatBubbleLeftRightIcon className="h-9 w-9 text-[#d5a1ab]"/><h2 className="mt-6 text-3xl font-bold">Talk with a human advisor</h2><p className="mt-4 leading-7 text-slate-300">Book private video guidance with an approved professional whose experience matches your workplace challenge.</p><Link href="/program/advisors" className="mt-7 inline-flex items-center gap-2 font-bold text-white">Browse advisors <ArrowRightIcon className="h-4 w-4"/></Link></div><div className="rounded-3xl border border-white/10 bg-white/5 p-8"><SparklesIcon className="h-9 w-9 text-[#d5a1ab]"/><h2 className="mt-6 text-3xl font-bold">Use the AI advisor</h2><p className="mt-4 leading-7 text-slate-300">Start a timed AI session for immediate structured reflection and practical prompts between human appointments.</p><Link href="/program/messages" className="mt-7 inline-flex items-center gap-2 font-bold text-white">Open AI sessions <ArrowRightIcon className="h-4 w-4"/></Link></div></div>
      </section>

      <section className="bg-white py-24">
        <div className="mx-auto max-w-5xl px-6 text-center"><p className="eyebrow">Join Workspherepulse</p><h2 className="section-title mt-3">Make your next workplace decision with more clarity.</h2><p className="section-copy mx-auto mt-5 max-w-2xl">Create one account for advisor sessions, AI support and the Workspherepulse community.</p><div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"><Link href="/signup" className="rounded-full bg-[#69705a] px-7 py-3 font-bold text-white transition hover:bg-[#59604c]">Create an account</Link><Link href="/program/onboard" className="rounded-full border border-slate-300 bg-white px-7 py-3 font-bold text-slate-800 transition hover:border-slate-500">Apply as an advisor</Link></div></div>
      </section>
    </div>
  );
}
