import Header from '../components/Header';
import Footer from '../components/Footer';
import ChatTrigger from '../components/ChatTrigger';

export default function ServiceGuarantee() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <ChatTrigger />

      <main className="pt-20">
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Service Delivery Guarantee & Customer Support
            </h1>
            <p className="text-lg text-gray-600">
              Our commitment to quality service and reliable support
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              1. Service Delivery Guarantee
            </h2>
            <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
              <p>
                We are committed to delivering all booked consultation sessions in a timely, professional, and reliable manner.
              </p>
              <p>
                All sessions are scheduled in advance and conducted digitally via secure video conferencing (Zoom). Once a booking is confirmed, users will receive session details including date, time, and access link.
              </p>
              <p>
                In the event that a session cannot be delivered as scheduled due to technical issues or advisor unavailability, we will:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Offer a rescheduled session at no additional cost, or</li>
                <li>Provide a full refund upon request</li>
              </ul>
              <p>
                We ensure that all advisors are vetted and qualified to deliver non-medical wellbeing, stress management, and personal development guidance.
              </p>
              <p className="font-semibold text-gray-900">
                Our services are non-clinical and intended for general wellbeing support only.
              </p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              2. Customer Support Tools
            </h2>
            <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
              <p>
                We provide multiple support channels to ensure a smooth user experience:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Email Support: support@wellbeingplatform.com</li>
                <li>Platform-based messaging system</li>
                <li>FAQ / Help Center</li>
                <li>Booking management dashboard for users</li>
              </ul>
              <p>
                Support requests are typically responded to within 24–48 hours.
              </p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              3. Booking, Cancellation & Refund Policy
            </h2>
            <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
              <p>
                Users may cancel or reschedule sessions within a defined time window prior to the scheduled session.
              </p>
              <p>
                Refunds are issued under the following conditions:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Session not delivered due to platform or advisor issues</li>
                <li>Cancellation within the allowed timeframe</li>
              </ul>
              <p className="font-semibold text-gray-900">
                No-shows or late cancellations may not be eligible for refunds.
              </p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              4. About Us
            </h2>
            <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
              <p>
                We operate an online platform offering paid one-to-one wellbeing and stress management consultation sessions designed for workplace environments.
              </p>
              <p>
                Our services are delivered by vetted human advisors and supported by an AI-powered advisory assistant. All services are non-medical and focus on general wellbeing, personal development, and stress management guidance aligned with each user's individual expectations and goals.
              </p>
              <p>
                Sessions are conducted digitally via our platform using Zoom for secure and reliable communication.
              </p>
            </div>
          </section>

          <div className="bg-emerald-50 border-l-4 border-emerald-500 p-6 rounded-r-lg">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Need Support?
            </h3>
            <p className="text-gray-700 mb-4">
              If you have any questions or concerns about our services, please don't hesitate to reach out to our customer support team.
            </p>
            <a
              href="/contact"
              className="inline-block bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
            >
              Contact Support
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
