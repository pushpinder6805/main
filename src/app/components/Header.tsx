"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [programDropdownOpen, setProgramDropdownOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <Image
              src="/images/logo.png"
              alt="Worksphere Pulse"
              width={80}
              height={30}
              priority
            />
          </Link>


          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium">
              Home
            </Link>
            <div
              className="relative"
              onMouseEnter={() => setProgramDropdownOpen(true)}
              onMouseLeave={() => setProgramDropdownOpen(false)}
            >
              <button className="text-gray-700 hover:text-blue-600 font-medium flex items-center gap-1">
                Program
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {programDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 bg-white shadow-lg rounded-lg py-2 w-56 z-50">
                  <Link href="/program/login" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600">
                    Login
                  </Link>
                  <Link href="/program/advisors" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600">
                    Browse Advisors
                  </Link>
                  <Link href="/program/dashboard" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600">
                    My Dashboard
                  </Link>
                  <Link href="/program/appointments" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600">
                    My Appointments
                  </Link>
                  <Link href="/program/messages" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600">
                    Messages
                  </Link>
                  <div className="border-t border-gray-200 my-2"></div>
                  <Link href="/program/onboard" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600">
                    Become an Advisor
                  </Link>
                  <Link href="/program/advisor-dashboard" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600">
                    Advisor Dashboard
                  </Link>
                </div>
              )}
            </div>
            <Link href="/about" className="text-gray-700 hover:text-blue-600 font-medium">
              About
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-blue-600 font-medium">
              Contact
            </Link>
          </nav>
          
          <div className="flex items-center">
            <a href="tel:+15551234567" className="hidden md:flex items-center text-blue-600 font-bold">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              (555) 123-4567
            </a>
            
            <button 
              className="md:hidden text-gray-700"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4">
              <Link
                href="/"
                className="text-gray-700 hover:text-blue-600 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <div>
                <p className="text-gray-700 font-medium mb-2">Program</p>
                <div className="pl-4 space-y-2">
                  <Link
                    href="/program/login"
                    className="block text-gray-600 hover:text-blue-600"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/program/advisors"
                    className="block text-gray-600 hover:text-blue-600"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Browse Advisors
                  </Link>
                  <Link
                    href="/program/dashboard"
                    className="block text-gray-600 hover:text-blue-600"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    My Dashboard
                  </Link>
                  <Link
                    href="/program/onboard"
                    className="block text-gray-600 hover:text-blue-600"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Become an Advisor
                  </Link>
                </div>
              </div>
              <Link
                href="/about"
                className="text-gray-700 hover:text-blue-600 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/contact"
                className="text-gray-700 hover:text-blue-600 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>
              <a
                href="tel:+15551234567"
                className="flex items-center text-blue-600 font-bold"
                onClick={() => setMobileMenuOpen(false)}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                (555) 123-4567
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
} 
