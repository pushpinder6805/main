"use client"

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/app/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import Link from 'next/link';

interface Advisor {
  id: string;
  name: string;
  email: string;
  avatar_url: string;
  about_me: string;
  language: string;
  timezone: string;
  rate: number;
  skills: string[];
  rating: number;
  reviews_count: number;
}

export default function AdvisorProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const advisorId = parseInt(params.id as string);

  const [advisor, setAdvisor] = useState<Advisor | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [duration, setDuration] = useState(60);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingType, setBookingType] = useState<'appointment' | 'conversation'>('appointment');

  useEffect(() => {
    loadAdvisor();
  }, []);

  const loadAdvisor = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('advisors')
      .select('*')
      .eq('id', params.id)
      .maybeSingle();

    if (data) {
      const foundAdvisor = data;
      if (foundAdvisor) {
        setAdvisor(foundAdvisor);
      }
    }
    setLoading(false);
  };

  const handleBooking = async () => {
    if (!user) {
      router.push('/program/login');
      return;
    }

    if (bookingType === 'appointment') {
      if (!selectedDate || !selectedTime) {
        alert('Please select date and time');
        return;
      }

      const scheduledAt = `${selectedDate}T${selectedTime}:00`;

      const { error } = await supabase
        .from('appointments')
        .insert({
          advisor_id: params.id,
          user_id: user.username,
          scheduled_at: scheduledAt,
          duration: duration,
          status: 'confirmed',
          meeting_link: '',
          notes: '',
        });

      if (error) {
        alert(`Error: ${error.message}`);
        return;
      }

      alert('Appointment booked successfully!');
      router.push('/program/appointments');
    } else {
      alert('Conversation booking coming soon!');
      setShowBookingModal(false);
    }
  };

  const calculateCost = () => {
    if (!advisor) return 0;
    return (advisor.rate * duration) / 60;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!advisor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Advisor Not Found</h1>
          <Link
            href="/program/advisors"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
          >
            Browse Advisors
          </Link>
        </div>
      </div>
    );
  }

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
        <div className="container mx-auto px-6">
          <Link href="/program/advisors" className="text-blue-100 hover:text-white mb-4 inline-flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Advisors
          </Link>
          <div className="flex items-center gap-6 mt-4">
            <Image
              src={advisor.avatar_url || '/images/logo.png'}
              alt={advisor.name}
              width={120}
              height={120}
              className="rounded-full border-4 border-white"
            />
            <div>
              <h1 className="text-4xl font-bold mb-2">{advisor.name}</h1>
              <p className="text-xl text-blue-100">{advisor.email}</p>
              <div className="flex items-center gap-4 mt-3">
                <span className="bg-white bg-opacity-20 px-4 py-2 rounded-full font-semibold">
                  ${advisor.rate}/hour
                </span>
                {advisor.rating > 0 && (
                  <div className="flex items-center gap-2 bg-white bg-opacity-20 px-4 py-2 rounded-full">
                    <svg className="w-5 h-5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="font-semibold">{advisor.rating.toFixed(1)}</span>
                    <span className="text-blue-100">({advisor.reviews_count} reviews)</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">About</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{advisor.about_me}</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Skills & Expertise</h2>
              <div className="flex flex-wrap gap-3">
                {advisor.skills.map((skill) => (
                  <span key={skill} className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {false && advisor && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Availability</h2>
                <div className="space-y-2">
                  <p>Availability information coming soon</p>
                </div>
              </div>
            )}
          </div>

          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Book a Session</h3>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Session Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setBookingType('appointment')}
                    className={`py-2 px-4 rounded-lg font-medium transition-colors ${
                      bookingType === 'appointment'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Video Call
                  </button>
                  <button
                    onClick={() => setBookingType('conversation')}
                    className={`py-2 px-4 rounded-lg font-medium transition-colors ${
                      bookingType === 'conversation'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Chat
                  </button>
                </div>
              </div>

              {bookingType === 'appointment' && (
                <>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                    <input
                      type="time"
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </>
              )}

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={30}>30 minutes</option>
                  <option value={60}>60 minutes</option>
                  {bookingType === 'appointment' && (
                    <>
                      <option value={90}>90 minutes</option>
                      <option value={120}>120 minutes</option>
                    </>
                  )}
                </select>
              </div>

              <div className="border-t border-gray-200 pt-4 mb-4">
                <div className="flex justify-between text-gray-700 mb-2">
                  <span>Duration:</span>
                  <span>{duration} minutes</span>
                </div>
                <div className="flex justify-between text-gray-700 mb-2">
                  <span>Rate:</span>
                  <span>${advisor.rate}/hour</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-gray-800">
                  <span>Total:</span>
                  <span>${calculateCost().toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleBooking}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors"
              >
                Book Now
              </button>

              {!user && (
                <p className="text-sm text-gray-500 text-center mt-3">
                  Please <Link href="/program/login" className="text-blue-600 hover:underline">login</Link> to book
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
