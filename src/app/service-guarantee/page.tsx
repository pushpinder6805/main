export default function ServiceGuarantee() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-blue-600 py-16 text-white">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl font-bold mb-4">Product & Service Delivery Guarantee</h1>
          <p className="text-xl max-w-2xl">Our commitment to ensuring quality service delivery for all users.</p>
        </div>
      </section>

      {/* Guarantee Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="prose prose-lg max-w-none text-black">
            <p className="text-sm text-black mb-8">
              <strong>Effective Date:</strong> {new Date().toLocaleDateString()}<br />
              <strong>Platform:</strong> WorkspherePulse
            </p>

            <p className="text-black mb-6">WorkspherePulse is committed to ensuring that users receive the professional meeting or consultation service they book through our platform. This Service Delivery Guarantee explains how we verify service delivery and protect both buyers and sellers.</p>

            <h2 className="text-black font-bold">1. Guaranteed Booking Confirmation</h2>
            <ul className="text-black space-y-2">
              <li>All meetings must be booked and paid for through the WorkspherePulse platform.</li>
              <li>Users receive confirmation of the scheduled date, time, and seller details.</li>
              <li>Payment is securely processed via PayPal at the time of booking.</li>
            </ul>

            <h2 className="text-black font-bold">2. Verified Meeting Attendance (Zoom Integration)</h2>
            <p className="text-black mb-3">To ensure transparency and fairness, WorkspherePulse uses Zoom integration with webhook verification to confirm attendance.</p>
            <ul className="text-black space-y-2">
              <li>Meetings are conducted via Zoom.</li>
              <li>Our backend system receives Zoom webhook event data.</li>
              <li>We verify whether both the seller and the user joined the scheduled meeting.</li>
              <li>Join time and session participation data are logged in our system.</li>
            </ul>
            <p className="text-black mt-3">This automated verification helps determine whether a session was properly delivered.</p>

            <h2 className="text-black font-bold">3. Seller No-Show Protection</h2>
            <p className="text-black mb-3">If Zoom webhook data confirms that the seller did not join the scheduled meeting:</p>
            <ul className="text-black space-y-2 mb-3">
              <li>The user may submit a support ticket.</li>
              <li>Our team verifies webhook attendance records.</li>
              <li>Upon confirmation of seller non-attendance, the user may receive:
                <ul className="ml-6 mt-2 space-y-1">
                  <li>A full refund; or</li>
                  <li>The option to reschedule.</li>
                </ul>
              </li>
            </ul>
            <p className="text-black">Repeated no-shows may result in seller account suspension or termination.</p>

            <h2 className="text-black font-bold">4. User No-Show Policy</h2>
            <p className="text-black mb-3">If Zoom webhook data confirms that the user did not join:</p>
            <ul className="text-black space-y-2">
              <li>The seller may report the no-show.</li>
              <li>Attendance logs are reviewed.</li>
              <li>Payout eligibility is determined according to platform policy.</li>
            </ul>

            <h2 className="text-black font-bold">5. Dispute & Resolution Process</h2>
            <p className="text-black mb-3">If a dispute arises:</p>
            <ul className="text-black space-y-2 mb-3">
              <li>A support ticket is submitted within the app.</li>
              <li>We review:
                <ul className="ml-6 mt-2 space-y-1">
                  <li>Payment transaction records</li>
                  <li>Booking details</li>
                  <li>Zoom webhook attendance logs</li>
                  <li>Relevant communications (if necessary)</li>
                </ul>
              </li>
              <li>Both parties may be contacted for clarification.</li>
              <li>A resolution is issued based on verified system data and platform policy.</li>
            </ul>

            <p className="text-black mb-2"><strong>Standard Resolution Time (SLA):</strong></p>
            <ul className="text-black space-y-2 mb-3">
              <li>48–72 hours for disputes</li>
              <li>12–24 hours for urgent same-day meeting issues</li>
            </ul>
            <p className="text-black">Approved refunds are processed to the original payment method.</p>

            <h2 className="text-black font-bold">6. Payment & Payout Controls</h2>
            <p className="text-black mb-3">To maintain marketplace integrity:</p>
            <ul className="text-black space-y-2">
              <li>Payments are monitored through our backend system.</li>
              <li>Payouts may be temporarily held until meeting completion is verified.</li>
              <li>In case of disputes, payouts may remain on hold during review.</li>
              <li>Fraudulent or policy-violating activity may result in payout reversal and account suspension.</li>
            </ul>

            <h2 className="text-black font-bold">7. What Is Not Covered</h2>
            <p className="text-black mb-3">This guarantee does not apply if:</p>
            <ul className="text-black space-y-2">
              <li>Zoom records confirm both parties attended and the session was completed.</li>
              <li>The dispute is unrelated to service delivery.</li>
              <li>The issue falls outside the cancellation policy timeframe.</li>
              <li>The service was delivered as described.</li>
            </ul>

            <h2 className="text-black font-bold">8. Compliance</h2>
            <ul className="text-black space-y-2">
              <li>All transactions are processed in accordance with PayPal policies.</li>
              <li>Sellers must comply with WorkspherePulse policies and PayPal's Acceptable Use Policy.</li>
            </ul>

            <h2 className="text-black font-bold">9. Contact Support</h2>
            <p className="text-black mb-3">If you experience any issue with a booking:</p>
            <ul className="text-black space-y-2">
              <li>Submit a support ticket within the app</li>
              <li>Email: support@workspherepulse.com</li>
            </ul>

            <p className="text-sm text-black mt-8">Last updated: {new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
