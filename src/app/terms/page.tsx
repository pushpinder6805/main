export default function TermsOfService() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-blue-600 py-16 text-white">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
          <p className="text-xl max-w-2xl">Please read these terms carefully before using our services.</p>
        </div>
      </section>

      {/* Terms Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="prose prose-lg max-w-none text-black">
            <h2 className="text-black">1. Acceptance of Terms</h2>
            <p className="text-black">By accessing or using our services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.</p>
            
            <h2 className="text-black">2. Service Description</h2>
            <p className="text-black">We provide professional advisory services for individuals and organizations, including one-to-one consultations, guided sessions, and expert support for workplace-related challenges. The scope and details of each service are clearly agreed upon before any session begins.</p>
            
            <h2 className="text-black">3. Scheduling and Appointments</h2>
            <p className="text-black">We will make every effort to start at the scheduled appointment time. However, due to the nature of human emergencies, there may occasionally be delays. We will communicate any changes to the schedule as promptly as possible.</p>
            
            <h2 className="text-black">4. Estimates and Pricing</h2>
            <p className="text-black">We provide clear session pricing based on the advisor’s rates and the services requested. Any changes to the scope of a session or additional requirements will be communicated in advance, and no adjustments will be made without your approval.</p>
            
            <h2 className="text-black">5. Payment Terms</h2>
            <p className="text-black">All sessions require advance payment at the time of booking. Payments are processed securely through our platform using approved payment methods, and sessions are confirmed only after payment is successfully completed.</p>
            
            <h2 className="text-black">6. Warranties</h2>
            <p className="text-black">We are committed to delivering high-quality advisory services. While individual outcomes may vary, every session is conducted professionally, and any applicable terms or guarantees are clearly communicated at the time of booking.</p>
            
            <h2 className="text-black">7. Customer Responsibilities</h2>
            <p className="text-black">Users are responsible for providing accurate and complete information about their workplace concerns, participating honestly in sessions, and disclosing any relevant details that may affect the quality or outcome of the advisory service.</p>
            
            <h2 className="text-black">8. Cancellation Policy</h2>
            <p className="text-black">We request at least 24 hours' notice for cancellation of scheduled appointments. Late cancellations or no-shows may incur a service fee.</p>
            
            <h2 className="text-black">9. Dispute Resolution</h2>
            <p className="text-black">Any disputes arising from our services shall first be addressed through good-faith negotiation. If resolution cannot be reached, disputes will be resolved through arbitration in accordance with local laws.</p>
            
            <h2 className="text-black">10. Modifications to Terms</h2>
            <p className="text-black">We reserve the right to modify these terms at any time. Changes will be effective upon posting to our website. Continued use of our services constitutes acceptance of modified terms.</p>
            
            <h2 className="text-black">11. Contact Information</h2>
            <p className="text-black">If you have questions about these Terms of Service, please contact us at info@workspherepulse.com or call (555) 123-4567.</p>
            
            <p className="text-sm text-black mt-8">Last updated: {new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </section>
    </div>
  );
} 
