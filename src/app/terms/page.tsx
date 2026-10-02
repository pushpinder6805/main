import {ArticleLayout, ArticleSection, InfoHero} from "@/app/components/InfoPage";

export default function TermsPage() {
  return <main className="min-h-screen">
    <InfoHero eyebrow="Legal" title="Terms of Service" description="The rules that apply when you create an account, book or provide a session, use the community, or access other Workspherepulse services." />
    <ArticleLayout label="All Workspherepulse users">
      <ArticleSection number="01" title="Acceptance of terms"><p>By accessing or using Workspherepulse services, you agree to these Terms of Service and the policies linked from the platform. If you do not agree, do not use the services.</p></ArticleSection>
      <ArticleSection number="02" title="Service description"><p>Workspherepulse provides a professional platform for workplace guidance, including one-to-one consultations, timed AI sessions, resources and community participation. Services are intended for general workplace wellbeing and professional development.</p></ArticleSection>
      <ArticleSection number="03" title="Accounts and accurate information"><p>You are responsible for the accuracy of your account information, protecting access to your account and activity performed through it. Advisor accounts require completed onboarding and Workspherepulse approval.</p></ArticleSection>
      <ArticleSection number="04" title="Scheduling and appointments"><p>Session details are agreed at booking. Users and advisors should attend on time and use the meeting access provided through the platform. Availability or technical issues may occasionally require a session to be rescheduled.</p></ArticleSection>
      <ArticleSection number="05" title="Pricing and payment"><p>Session pricing is displayed before checkout. Paid bookings require advance payment through the platform’s approved payment method. A booking is confirmed only after payment succeeds.</p></ArticleSection>
      <ArticleSection number="06" title="Service scope"><p>Workspherepulse and its advisors do not guarantee a particular personal or professional outcome. Guidance is non-clinical and does not replace medical, mental-health, legal, financial or emergency services.</p></ArticleSection>
      <ArticleSection number="07" title="User responsibilities"><p>Users must provide accurate information, behave professionally, respect confidentiality and avoid unlawful, harmful or deceptive use. Advisors must also follow the Advisor Acceptable Use Policy and applicable professional requirements.</p></ArticleSection>
      <ArticleSection number="08" title="Cancellations and refunds"><p>Cancellation, no-show, dispute and refund decisions follow the Cancellations and Refunds Policy in effect for the booking.</p></ArticleSection>
      <ArticleSection number="09" title="Suspension and termination"><p>We may restrict or terminate access where necessary to address fraud, abuse, safety concerns, policy violations, payment risk or legal obligations.</p></ArticleSection>
      <ArticleSection number="10" title="Disputes"><p>Parties should first attempt good-faith resolution through Workspherepulse support. Unresolved disputes will be handled under applicable law and any legally binding dispute terms.</p></ArticleSection>
      <ArticleSection number="11" title="Changes and contact"><p>We may update these terms to reflect changes in services, law or operations. Updated terms take effect when posted, subject to applicable notice requirements.</p><p>Questions may be sent to <a href="mailto:admin@workspherepulse.com" className="font-bold text-[#59604c]">admin@workspherepulse.com</a>.</p></ArticleSection>
    </ArticleLayout>
  </main>;
}
