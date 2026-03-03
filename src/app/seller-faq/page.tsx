export default function SellerFAQ() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-blue-600 py-16 text-white">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl font-bold mb-4">Seller FAQ</h1>
          <p className="text-xl max-w-2xl">Frequently asked questions for sellers on our platform.</p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="space-y-8 text-black">

            <div>
              <h2 className="text-2xl font-bold text-black mb-4">1. What is WorkspherePulse?</h2>
              <p className="text-black mb-3">WorkspherePulse is a marketplace platform where professionals ("Sellers") offer paid scheduled meetings or consultations to users. Sellers set their own pricing, availability, and service descriptions.</p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-black mb-4">2. Who can become a seller?</h2>
              <p className="text-black mb-3">Anyone who:</p>
              <ul className="list-disc pl-6 space-y-2 text-black mb-3">
                <li>Provides lawful professional services</li>
                <li>Agrees to our Seller Terms and policies</li>
                <li>Agrees to our Seller Acceptable Use Policy (AUP)</li>
                <li>Complies with PayPal's policies</li>
              </ul>
              <p className="text-black">
                <strong>Seller AUP:</strong><br />
                <a href="https://workspherepulse.com/seller-AUP" className="text-blue-600 hover:underline">https://workspherepulse.com/seller-AUP</a>
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-black mb-4">3. How do I set my price?</h2>
              <p className="text-black mb-3">You can set your own meeting price within your seller dashboard. The listed price is what users pay when booking your session.</p>
              <p className="text-black">Platform service fees (if applicable) will be clearly disclosed before payout.</p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-black mb-4">4. How and when do I get paid?</h2>
              <ul className="list-disc pl-6 space-y-2 text-black">
                <li>Users pay at the time of booking.</li>
                <li>Payment is processed securely via PayPal.</li>
                <li>Payout is released after successful completion of the scheduled meeting.</li>
                <li>If a dispute is raised, payout may be temporarily held until resolution.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-black mb-4">5. What happens if a user cancels?</h2>
              <p className="text-black mb-3">Cancellation rules depend on the platform's cancellation policy:</p>
              <ul className="list-disc pl-6 space-y-2 text-black">
                <li>If a user cancels within the allowed timeframe, the booking may be refunded.</li>
                <li>If cancellation occurs outside the allowed timeframe, payout eligibility may vary.</li>
                <li>In case of disputes, the platform reviews the transaction before making a decision.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-black mb-4">6. What happens if I miss a meeting?</h2>
              <p className="text-black mb-3">Failure to attend a scheduled meeting may result in:</p>
              <ul className="list-disc pl-6 space-y-2 text-black mb-3">
                <li>Refund to the user</li>
                <li>Warning or account review</li>
                <li>Temporary payout hold</li>
                <li>Suspension for repeated violations</li>
              </ul>
              <p className="text-black">Consistent attendance and professionalism are required.</p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-black mb-4">7. What if a user does not attend?</h2>
              <p className="text-black mb-3">If a user does not attend:</p>
              <ul className="list-disc pl-6 space-y-2 text-black">
                <li>You should report the no-show through the support/ticket system.</li>
                <li>The platform will verify meeting details.</li>
                <li>If confirmed, payout may still be eligible according to policy.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-black mb-4">8. How are disputes handled?</h2>
              <p className="text-black mb-3">If a user raises a dispute:</p>
              <ul className="list-disc pl-6 space-y-2 text-black mb-3">
                <li>A support ticket is created.</li>
                <li>The platform reviews transaction details and meeting records.</li>
                <li>Both seller and buyer may be contacted for clarification.</li>
                <li>A resolution is determined (refund, reschedule, or payout release).</li>
              </ul>
              <p className="text-black">Average resolution time: 48–72 hours</p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-black mb-4">9. Are there prohibited services?</h2>
              <p className="text-black mb-3">Yes. Sellers must comply with our Acceptable Use Policy and may not offer:</p>
              <ul className="list-disc pl-6 space-y-2 text-black mb-3">
                <li>Illegal services</li>
                <li>Fraudulent or deceptive services</li>
                <li>Adult or explicit services</li>
                <li>Gambling or high-risk financial schemes</li>
                <li>Services violating PayPal's Acceptable Use Policy</li>
              </ul>
              <p className="text-black">
                <strong>Full details:</strong><br />
                <a href="https://workspherepulse.com/seller-AUP" className="text-blue-600 hover:underline">https://workspherepulse.com/seller-AUP</a>
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-black mb-4">10. Can I accept payment outside the platform?</h2>
              <p className="text-black mb-3"><strong>No.</strong></p>
              <p className="text-black">All transactions must be processed through the WorkspherePulse platform. Requesting off-platform payments may result in immediate suspension.</p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-black mb-4">11. How do I contact support?</h2>
              <p className="text-black mb-3">If you need assistance:</p>
              <ul className="list-disc pl-6 space-y-2 text-black mb-3">
                <li>Submit a support ticket within the app</li>
                <li>Email: support@workspherepulse.com</li>
              </ul>
              <p className="text-black">Our standard response time is 24–48 hours.</p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-black mb-4">12. Can my account be suspended?</h2>
              <p className="text-black mb-3">Yes. Accounts may be suspended for:</p>
              <ul className="list-disc pl-6 space-y-2 text-black">
                <li>Repeated no-shows</li>
                <li>Policy violations</li>
                <li>Fraud or payment abuse</li>
                <li>Misrepresentation of qualifications</li>
                <li>Violating PayPal's policies</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-black mb-4">13. Do I need to comply with PayPal policies?</h2>
              <p className="text-black mb-3"><strong>Yes.</strong></p>
              <p className="text-black">By using the platform, you agree to comply with PayPal's terms, including their Acceptable Use Policy. Violations may result in payment restrictions or account termination.</p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-black mb-4">14. Am I an employee of WorkspherePulse?</h2>
              <p className="text-black mb-3"><strong>No.</strong></p>
              <p className="text-black">Sellers operate as independent service providers. You are responsible for your own taxes, licensing, and regulatory compliance.</p>
            </div>

            <p className="text-sm text-black mt-12">Last updated: {new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
