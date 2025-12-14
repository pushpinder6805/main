import Link from "next/link";
import Image from "next/image";

export default function About() {
  return (
    <div className="min-h-screen">
      {/* About Header */}
      <section className="bg-blue-600 py-16 text-white">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl font-bold mb-4">About Workspherepulse</h1>
          <p className="text-xl max-w-2xl">WorkspherePulse is a professional platform that connects users with experienced advisors and a supportive community to address real-world workplace challenges.</p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-gray-800">Our Story</h2>
              <p className="text-gray-700 mb-4">WorkspherePulse was founded in 2024 with a clear mission: to create a trusted space where individuals can openly discuss workplace challenges and access meaningful, professional support. What began as a discussion forum for sharing experiences and perspectives has grown into a comprehensive platform designed to support workplace wellbeing and professional growth.</p>
              <p className="text-gray-700 mb-4">Today, WorkspherePulse brings together a secure online forum and a dedicated application that connects users with highly qualified, experienced advisors. These advisors are professionals from diverse fields who specialize in addressing real-world workplace issues such as communication challenges, leadership concerns, conflict resolution, motivation, wellbeing, and work–life balance.</p>
              <p className="text-gray-700">Our platform enables users to seek confidential guidance through one-to-one sessions with advisors who understand the complexities of modern workplaces. Sessions are conducted securely, allowing users to choose advisors based on expertise, availability, and individual needs.</p>
            </div>
            <div className="relative bg-gray-200 h-[400px] rounded-lg overflow-hidden">
              <Image 
                src="/images/logo.png" 
                alt="Workspherepulse Team" 
                fill 
                className="object-cover" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Integrity",
                description: "We believe in honest communication, transparent pricing, and doing what's right for our customers, even when it's not the most profitable option."
              },
              {
                title: "Excellence",
                description: "We strive for excellence in every job, no matter how big or small. Our team is committed to ongoing training and using the best techniques and materials."
              },
              {
                title: "Reliability",
                description: "When you schedule a service with us, you can count on us to show up on time, prepared to solve your plumbing issues efficiently and effectively."
              }
            ].map((value, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-3 text-gray-800">{value.title}</h3>
                <p className="text-gray-700">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { name: "John Smith", position: "Designation" },
              { name: "Sarah Johnson", position: "Operations Manager" },
              { name: "Michael Brown", position: "Senior Analyst" },
              { name: "Emily Davis", position: "Customer Service Manager" }
            ].map((member, index) => (
              <div key={index} className="text-center">
                <div className="relative bg-gray-200 h-64 rounded-lg mb-4 overflow-hidden">
                  <Image 
                    src="/images/logo.png" 
                    alt={`${member.name} - ${member.position}`}
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">{member.name}</h3>
                <p className="text-gray-700">{member.position}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Our Certifications & Affiliations</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="relative bg-white p-6 rounded-lg shadow-sm h-32 overflow-hidden">
                <Image 
                  src="/images/logo.png" 
                  alt="Certification" 
                  fill
                  className="object-contain p-2" 
                />
              </div>
            ))}
          </div>
          <p className="text-center mt-8 text-gray-700">Our advisors are highly qualified professionals who continuously update their skills and knowledge to stay current with evolving workplace practices, policies, and challenges.</p>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Work With Our Team?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">Join us today to experience professional guidance that can make a real difference in your workplace.</p>
          <Link href="/contact" className="bg-white hover:bg-gray-100 text-blue-600 font-bold py-3 px-6 rounded-md transition-colors">
            Get in Touch
          </Link>
        </div>
      </section>
    </div>
  );
} 
