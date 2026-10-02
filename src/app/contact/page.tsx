import Link from "next/link";
import {
  ArrowRightIcon,
  ChatBubbleLeftRightIcon,
  EnvelopeIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";

const supportOptions = [
  {
    title: "Booking and payment support",
    text: "Include your Workspherepulse username and booking date so our team can find the correct session.",
    subject: "Booking support request",
    icon: ShieldCheckIcon,
  },
  {
    title: "Account support",
    text: "Get help with sign-in, email verification, advisor applications or account access.",
    subject: "Account support request",
    icon: ChatBubbleLeftRightIcon,
  },
  {
    title: "General enquiries",
    text: "Ask about Workspherepulse, partnerships, privacy or anything else that is not tied to a booking.",
    subject: "Workspherepulse enquiry",
    icon: EnvelopeIcon,
  },
];

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="border-b border-slate-200 bg-white py-20">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <p className="eyebrow">Contact Workspherepulse</p>
          <h1 className="section-title mx-auto mt-3 max-w-3xl">Tell us what you need help with.</h1>
          <p className="section-copy mx-auto mt-5 max-w-2xl">
            Our support team handles account, booking, payment and advisor questions by email so every request has a clear record.
          </p>
          <a href="mailto:admin@workspherepulse.com?subject=Workspherepulse%20support%20request" className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#69705a] px-7 py-3 font-bold text-white transition hover:bg-[#59604c]">
            Email support <ArrowRightIcon className="h-4 w-4" />
          </a>
          <p className="mt-4 text-sm text-slate-500">admin@workspherepulse.com</p>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto grid max-w-6xl gap-6 px-6 md:grid-cols-3">
          {supportOptions.map((option) => (
            <article key={option.title} className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#69705a]/10 text-[#59604c]">
                <option.icon className="h-6 w-6" />
              </div>
              <h2 className="mt-5 text-xl font-bold text-slate-950">{option.title}</h2>
              <p className="mt-3 leading-7 text-slate-600">{option.text}</p>
              <a href={`mailto:admin@workspherepulse.com?subject=${encodeURIComponent(option.subject)}`} className="mt-6 inline-flex items-center gap-2 font-bold text-[#59604c]">
                Start an email <ArrowRightIcon className="h-4 w-4" />
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white py-16">
        <div className="mx-auto flex max-w-4xl flex-col items-start justify-between gap-6 px-6 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-950">Need help with an upcoming session?</h2>
            <p className="mt-2 text-slate-600">You can also review the booking and refund policy before contacting support.</p>
          </div>
          <Link href="/cancellations-refunds" className="shrink-0 rounded-full border border-slate-300 px-6 py-3 font-bold text-slate-800 transition hover:border-slate-500">View policy</Link>
        </div>
      </section>
    </main>
  );
}
