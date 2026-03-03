export default function SellerAUP() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-blue-600 py-16 text-white">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl font-bold mb-4">Seller Acceptable Use Policy</h1>
          <p className="text-xl max-w-2xl">Rules and standards for sellers offering services through our platform.</p>
        </div>
      </section>

      {/* AUP Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="prose prose-lg max-w-none text-black">
            <p className="text-sm text-black mb-8">
              <strong>Effective Date:</strong> {new Date().toLocaleDateString()}<br />
              <strong>Platform Name:</strong> WorkSphere Pulse
            </p>

            <h2 className="text-black">1. Purpose</h2>
            <p className="text-black">This Seller Acceptable Use Policy ("AUP") sets forth the rules and standards that all sellers must follow when offering services through our platform. By registering as a seller, you agree to comply with this AUP, our Seller Terms, and all applicable laws and payment processor policies, including PayPal's Acceptable Use Policy.</p>

            <h2 className="text-black">2. Permitted Services</h2>
            <p className="text-black">Sellers may offer lawful professional services, consultations, or scheduled meetings that:</p>
            <ul className="text-black">
              <li>Are accurately described</li>
              <li>Are delivered as scheduled</li>
              <li>Do not violate any applicable laws or regulations</li>
              <li>Comply with PayPal's Acceptable Use Policy</li>
            </ul>

            <h2 className="text-black">3. Prohibited Activities</h2>
            <p className="text-black">Sellers may NOT:</p>

            <h3 className="text-black">3.1 Illegal or Restricted Services</h3>
            <ul className="text-black">
              <li>Offer unlawful goods or services</li>
              <li>Engage in fraud, deception, or misrepresentation</li>
              <li>Offer regulated services without required licenses</li>
              <li>Promote hate, violence, or discrimination</li>
              <li>Provide adult/explicit services</li>
              <li>Engage in gambling, high-risk investment schemes, or get-rich-quick programs</li>
              <li>Sell counterfeit or infringing content</li>
            </ul>

            <h3 className="text-black">3.2 Payment Abuse</h3>
            <ul className="text-black">
              <li>Circumvent platform payment systems</li>
              <li>Request off-platform payments</li>
              <li>Manipulate refunds or chargebacks</li>
              <li>Engage in transaction laundering</li>
              <li>Use stolen financial information</li>
            </ul>

            <h3 className="text-black">3.3 Misrepresentation</h3>
            <ul className="text-black">
              <li>Provide false identity information</li>
              <li>Misrepresent qualifications or credentials</li>
              <li>Falsely claim professional certifications</li>
              <li>Provide misleading service descriptions</li>
            </ul>

            <h2 className="text-black">4. Service Delivery Standards</h2>
            <p className="text-black">Sellers must:</p>
            <ul className="text-black">
              <li>Attend scheduled meetings on time</li>
              <li>Deliver services as described</li>
              <li>Maintain professional conduct</li>
              <li>Respond to customer communication in a timely manner</li>
              <li>Respect privacy and confidentiality</li>
            </ul>
            <p className="text-black">Failure to deliver services may result in refunds, account suspension, or termination.</p>

            <h2 className="text-black">5. Cancellations & Refunds</h2>
            <p className="text-black">Sellers must comply with the platform's cancellation and refund policies, including:</p>
            <ul className="text-black">
              <li>Allowing user cancellations within the permitted timeframe</li>
              <li>Accepting refunds in cases of no-show or non-delivery</li>
              <li>Cooperating in dispute investigations</li>
            </ul>
            <p className="text-black">The platform reserves the right to withhold or reverse payouts in the event of disputes, chargebacks, or policy violations.</p>

            <h2 className="text-black">6. Monitoring & Enforcement</h2>
            <p className="text-black">We reserve the right to:</p>
            <ul className="text-black">
              <li>Monitor seller activity</li>
              <li>Review disputes and complaints</li>
              <li>Suspend or terminate accounts</li>
              <li>Withhold payouts during investigations</li>
              <li>Report illegal activity to authorities</li>
            </ul>
            <p className="text-black">Repeated violations may result in permanent removal from the platform.</p>

            <h2 className="text-black">7. Compliance with PayPal Policies</h2>
            <p className="text-black">Sellers must comply with:</p>
            <ul className="text-black">
              <li>PayPal's Acceptable Use Policy</li>
              <li>PayPal Seller Protection policies</li>
              <li>Applicable financial and anti-fraud regulations</li>
            </ul>
            <p className="text-black">Violation of PayPal's policies may result in immediate suspension.</p>

            <h2 className="text-black">8. Data Protection & Privacy</h2>
            <p className="text-black">Sellers must:</p>
            <ul className="text-black">
              <li>Use customer information only for service delivery</li>
              <li>Not store or misuse payment information</li>
              <li>Maintain confidentiality of user data</li>
              <li>Comply with applicable data protection laws</li>
            </ul>

            <h2 className="text-black">9. Amendments</h2>
            <p className="text-black">We may update this AUP at any time. Continued use of the platform constitutes acceptance of the revised policy.</p>

            <h2 className="text-black">10. Contact</h2>
            <p className="text-black">For questions regarding this policy:</p>
            <p className="text-black">
              <strong>Email:</strong> support@workspherepulse.com<br />
              <strong>Company Name:</strong> WorkSphere Pulse<br />
              <strong>Registered Address:</strong> 123 Lorem ipsum, Anytown, ST 12345
            </p>

            <p className="text-sm text-black mt-8">Last updated: {new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
