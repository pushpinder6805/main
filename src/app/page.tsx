import Image from "next/image";
import Link from "next/link";
import { ShieldCheckIcon, ClockIcon, CurrencyDollarIcon, CheckBadgeIcon } from "@heroicons/react/24/outline";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <section className="relative w-full overflow-hidden">
        <div className="relative mx-auto grid min-h-[80vh] grid-cols-1 lg:grid-cols-2">

          {/* LEFT: Text */}
          <div className="flex items-center bg-[rgb(75,78,61)] px-6 py-16 text-white lg:px-20">
            <div className="max-w-2xl">

              {/* TITLE */}
              <h1 className="mb-[20px] text-left text-[3.6rem] font-bold leading-[1.2] text-white">
                Let’s navigate together – address workplace issues, build bridges
              </h1>

              {/* DESCRIPTION */}
              <p className="mb-[30px] text-left text-[17px] leading-[1.6] text-[#e8e8e8]">
                Our website is dedicated to professional growth through shared
                experiences and communal advice to foster mental and emotional
                well-being at your place of work.
              </p>

              <div className="flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/contact"
                  className="rounded-md bg-blue-600 px-6 py-3 text-center font-bold text-white transition-colors hover:bg-blue-700"
                >
                  Request Service
                </Link>

                <Link
                  href="/services"
                  className="rounded-md bg-white px-6 py-3 text-center font-bold text-blue-600 transition-colors hover:bg-gray-100"
                >
                  Our Services
                </Link>
              </div>
            </div>
          </div>

          {/* RIGHT: Image */}
          <div className="relative h-[320px] lg:h-auto">
            <Image
              src="/images/banner.avif"
              alt="worksphere green banner"
              fill
              priority
              className="object-cover"
              style={{ objectPosition: "center top" }}
            />
          </div>

          {/* CENTER GRADIENT DIVIDER */}
          <div
            className="
              pointer-events-none
              absolute
              top-0
              bottom-0
              left-1/2
              z-30
              hidden
              w-[35px]
              -translate-x-1/2
              bg-gradient-to-r
              from-[rgb(75,78,61)]
              to-transparent
              lg:block
            "
          />
        </div>
      </section>
    </div>
  );
}



      {/* Services Preview */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Workspherepulse Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Workplace Wellbeing",
                description: "Expert guidance to improve wellbeing, balance, and performance at work.",
                image: "/images/Workplace-Wellbeing.jpg"
              },
              {
                title: "Boosting Motivation",
                description: "Supporting sustained motivation through expert guidance and practical strategies.",
                image: "/images/motivation.webp"
              },
              {
                title: "Effective Communication",
                description: "Expert support to build clear, confident, and effective communication.",
                image: "/images/Effective-Communication.jpg"
              },
              {
                title: "Conflict Resolution & Workplace Relationships",
                description: "Expert support to resolve conflict and improve workplace relationships.",
                image: "/images/Common.png"
              },
              {
                title: "Leading with Confidence",
                description: "Expert support to build confidence and lead with clarity.",
                image: "/images/lead.png"
              },
              {
                title: "Navigating Toxic Work Culture",
                description: "Expert support to navigate and manage toxic work cultures.",
                image: "/images/toxic.png"
              },
              {
                title: "Work-Life Balance",
                description: "Expert support to build a healthier work–life balance.",
                image: "/images/work-life.jpg"
              },
            ].map((service, index) => (
              <div key={index} className="bg-gray-100 rounded-lg hover:shadow-lg transition-shadow border border-gray-200 overflow-hidden">
                <div className="h-48 relative">
                  <Image 
                    src={service.image} 
                    alt={service.title} 
                    fill 
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">{service.title}</h3>
                  <p className="text-gray-700 mb-4">{service.description}</p>
                  <Link href="/services" className="text-blue-600 font-medium hover:underline">
                    Learn more →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Why Choose Workspherepulse</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { 
                title: "Expert Advisors", 
                description: "Connect with verified advisors and book one-to-one sessions based on your specific issue or requirement.",
                icon: ShieldCheckIcon
              },
              { 
                title: "Pay Per Session", 
                description: "Choose an advisor, view their rate, and pay only for the session you book—no subscriptions required.",
                icon: ClockIcon
              },
              { 
                title: "Safe PayPal Payments", 
                description: "Payments are processed securely via PayPal, ensuring buyer protection and a trusted checkout experience.",
                icon: CurrencyDollarIcon
              },
              { 
                title: "Secure Zoom Meetings", 
                description: "All sessions are conducted through secure, scheduled Zoom meetings set up directly by our platform",
                icon: CheckBadgeIcon
              }
            ].map((item, index) => (
              <div key={index} className="text-center p-6 bg-white rounded-lg shadow-sm">
                <div className="flex justify-center mb-4">
                  <item.icon className="h-12 w-12 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">{item.title}</h3>
                <p className="text-gray-700">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Meet Our Advisors</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                location: "Downtown",
                quote: "lorem ipsum some text"
              },
              {
                name: "Michael Davis",
                location: "Westside",
                quote: "lorem ipsum some text"
              },
              {
                name: "Michael Davis",
                location: "Westside",
                quote: "lorem ipsum some text"
              },
              {
                name: "Michael Davis",
                location: "Westside",
                quote: "lorem ipsum some text"
              },
              {
                name: "Michael Davis",
                location: "Westside",
                quote: "lorem ipsum some text"
              },
              {
                name: "Jennifer Smith",
                location: "Northside",
                quote: "lorem ipsum some text"
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-gray-100 p-6 rounded-lg border border-gray-200">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white font-bold">{testimonial.name.charAt(0)}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{testimonial.name}</h3>
                    <p className="text-gray-600 text-sm">{testimonial.location}</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">"{testimonial.quote}"</p>
                <div className="flex mt-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Apply as an Advisor</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">We invite you to apply as an advisor. Our platform connects advisors with users seeking reliable guidance Apply to join our advisor network, showcase your experience, and start supporting users through one-to-one sessions and consultations.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/contact" className="bg-white hover:bg-gray-100 text-blue-600 font-bold py-3 px-6 rounded-md transition-colors">
              Join Workspherepulse
            </Link>
            <a href="tel:+15551234567" className="border-2 border-white hover:bg-white/10 text-white font-bold py-3 px-6 rounded-md transition-colors">
              Call (555) 123-4567
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
