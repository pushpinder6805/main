export default function ServiceGuarantee() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-blue-600 py-16 text-white">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl font-bold mb-4">Service Delivery Guarantee & Customer Support</h1>
          <p className="text-xl max-w-2xl">Our commitment to quality service and reliable support</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="prose prose-lg max-w-none text-black">
            <h2 className="text-black font-bold">1. Service Delivery Guarantee</h2>
            <p className="text-black mb-3">
              We are committed to delivering all booked consultation sessions in a timely, professional, and reliable manner.
            </p>
            <p className="text-black mb-3">
              All sessions are scheduled in advance and conducted digitally via secure video conferencing (Zoom). Once a booking is confirmed, users will receive session details including date, time, and access link.
            </p>
            <p className="text-black mb-3">
              In the event that a session cannot be delivered as scheduled due to technical issues or advisor unavailability, we will:
            </p>
            <ul className="text-black space-y-2 mb-3">
              <li>Offer a rescheduled session at no additional cost, or</li>
              <li>Provide a full refund upon request</li>
            </ul>
            <p className="text-black mb-3">
              We ensure that all advisors are vetted and qualified to deliver non-medical wellbeing, stress management, and personal development guidance.
            </p>
            <p className="text-black mb-6">
              <strong>Our services are non-clinical and intended for general wellbeing support only.</strong>
            </p>

            <h2 className="text-black font-bold">2. Customer Support Tools</h2>
            <p className="text-black mb-3">
              We provide multiple support channels to ensure a smooth user experience:
            </p>
            <ul className="text-black space-y-2 mb-3">
              <li>Email Support: admin@workspherepulse.com</li>
              <li>Platform-based messaging system</li>
              <li>FAQ / Help Center</li>
              <li>Booking management dashboard for users</li>
            </ul>
            <p className="text-black mb-6">
              Support requests are typically responded to within 24–48 hours.
            </p>

            <h2 className="text-black font-bold">3. Booking, Cancellation & Refund Policy</h2>
            <p className="text-black mb-3">
              Users may cancel or reschedule sessions within a defined time window prior to the scheduled session.
            </p>
            <p className="text-black mb-3">
              Refunds are issued under the following conditions:
            </p>
            <ul className="text-black space-y-2 mb-3">
              <li>Session not delivered due to platform or advisor issues</li>
              <li>Cancellation within the allowed timeframe</li>
            </ul>
            <p className="text-black mb-6">
              <strong>No-shows or late cancellations may not be eligible for refunds.</strong>
            </p>

            <h2 className="text-black font-bold">4. About Us</h2>
            <p className="text-black mb-3">
              We operate an online platform offering paid one-to-one wellbeing and stress management consultation sessions designed for workplace environments.
            </p>
            <p className="text-black mb-3">
              Our services are delivered by vetted human advisors and supported by an AI-powered advisory assistant. All services are non-medical and focus on general wellbeing, personal development, and stress management guidance aligned with each user's individual expectations and goals.
            </p>
            <p className="text-black mb-6">
              Sessions are conducted digitally via our platform using Zoom for secure and reliable communication.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
