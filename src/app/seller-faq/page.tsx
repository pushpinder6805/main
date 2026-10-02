import Link from "next/link";
import {ArticleLayout, ArticleSection, CheckList, InfoHero, PageCTA} from "@/app/components/InfoPage";

const questions = [
  {title:"What is Workspherepulse?", body:<p>Workspherepulse is a platform where approved professionals offer paid, scheduled workplace-guidance sessions. Advisors manage their expertise, rate and availability through their account.</p>},
  {title:"Who can apply as an advisor?", body:<><p>You may apply if you provide lawful professional guidance, can accurately describe your qualifications and agree to Workspherepulse policies.</p><CheckList items={["Complete the advisor application and identity details.","Provide your expertise, rate and availability.","Wait for Workspherepulse approval before using advisor features.","Complete payment-provider onboarding before accepting bookings."]}/></>},
  {title:"How do I set my rate?", body:<p>Set a USD per-minute rate during advisor onboarding. Customers see the session price before checkout, and applicable platform fees are shown through the payment flow.</p>},
  {title:"How and when do I get paid?", body:<CheckList items={["Customers pay when they confirm a booking.","Payment is processed securely by the platform payment provider.","Advisor earnings become eligible for release after successful session completion.","A dispute or refund review may temporarily pause a payout."]}/>},
  {title:"What happens when a customer cancels?", body:<p>Refund and payout eligibility depend on the cancellation timing, booking status and available attendance records. Workspherepulse reviews disputed cases before releasing or refunding funds.</p>},
  {title:"What happens if I miss a meeting?", body:<><p>A confirmed advisor no-show may result in a customer refund, payout hold, account review or suspension. Repeated no-shows may lead to removal from the platform.</p></>},
  {title:"What if the customer does not attend?", body:<p>Report the no-show to support. We may review meeting and booking records to determine whether the session qualifies for payout under the applicable policy.</p>},
  {title:"How are disputes handled?", body:<><p>Our team reviews the transaction, booking, meeting records and relevant communications. We may contact both parties before deciding whether to refund, reschedule or release a payout.</p><p>Most disputes are reviewed within 48–72 hours.</p></>},
  {title:"Which services are prohibited?", body:<><p>Advisors may not offer illegal, deceptive, explicit, unlicensed regulated or payment-prohibited services. Off-platform payment requests are also prohibited.</p><Link href="/seller-AUP" className="font-bold text-[#59604c]">Read the full Advisor Acceptable Use Policy →</Link></>},
  {title:"Can I accept payment outside Workspherepulse?", body:<p>No. Bookings arranged through Workspherepulse must be paid through the platform. Requesting off-platform payment may result in suspension.</p>},
  {title:"How do I contact support?", body:<p>Email <a href="mailto:admin@workspherepulse.com" className="font-bold text-[#59604c]">admin@workspherepulse.com</a>. Include your username and booking date when asking about a session. Most requests receive a reply within 24–48 hours.</p>},
  {title:"Am I an employee of Workspherepulse?", body:<p>No. Advisors operate as independent service providers and are responsible for their taxes, licences and professional obligations.</p>},
];

export default function AdvisorFAQPage() {
  return <main className="min-h-screen">
    <InfoHero eyebrow="Advisor help centre" title="Answers for Workspherepulse advisors." description="Understand applications, bookings, session delivery, payouts and the standards that apply when you offer guidance through Workspherepulse." action={{label:"Apply as an advisor",href:"/program/onboard"}} />
    <ArticleLayout label="Current and prospective advisors" aside={<div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Related policy</p><h2 className="mt-3 text-lg font-bold text-slate-950">Advisor standards</h2><p className="mt-2 text-sm leading-6 text-slate-600">Review the services and conduct permitted on Workspherepulse.</p><Link href="/seller-AUP" className="mt-4 inline-flex text-sm font-bold text-[#59604c]">Read agreement →</Link></div>}>
      {questions.map((question,index)=><ArticleSection key={question.title} number={String(index+1).padStart(2,"0")} title={question.title}>{question.body}</ArticleSection>)}
    </ArticleLayout>
    <PageCTA title="Ready to offer your expertise?" description="Create an account, complete your advisor profile and submit it for review." primary={{label:"Start advisor application",href:"/program/onboard"}} secondary={{label:"Contact support",href:"/contact"}} />
  </main>;
}
