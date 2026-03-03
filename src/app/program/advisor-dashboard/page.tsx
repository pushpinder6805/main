"use client"

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import Image from 'next/image';

interface AdvisorProfile {
  id: string;
  user_id: string;
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
  wallet_balance: number;
}

interface Appointment {
  id: string;
  user_id: string;
  user_name: string;
  user_avatar: string;
  scheduled_at: string;
  duration: number;
  status: string;
  meeting_link: string;
  notes: string;
}

interface Transaction {
  id: string;
  amount: number;
  type: string;
  created_at: string;
  description: string;
}

export default function AdvisorDashboard() {
  const { user, isLoading, isAdvisor } = useAuth();
  const [advisorProfile, setAdvisorProfile] = useState<AdvisorProfile | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (user && isAdvisor) {
      loadAdvisorData();
    }
  }, [user, isAdvisor]);

  const loadAdvisorData = async () => {
    setLoadingData(true);

    try {
      const { data: profile } = await supabase
        .from('advisors')
        .select('*')
        .eq('user_id', user?.username || '')
        .maybeSingle();

      if (profile) {
        setAdvisorProfile(profile);

        const { data: appointmentsData } = await supabase
          .from('appointments')
          .select('*')
          .eq('advisor_id', profile.id)
          .order('scheduled_at', { ascending: false });

        setAppointments(appointmentsData || []);
      }

      setTransactions([]);
    } catch (error) {
      console.error('Error loading advisor data:', error);
    }

    setLoadingData(false);
  };

  const handleWithdraw = async () => {
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount < 100) {
      alert('Minimum withdrawal amount is $100');
      return;
    }

    if (amount > (user?.wallet_balance || 0)) {
      alert('Insufficient balance');
      return;
    }

    alert('Withdrawal functionality coming soon!');
    setShowWithdrawModal(false);
    setWithdrawAmount('');
  };

  if (isLoading || loadingData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user || !isAdvisor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Advisor Access Required</h1>
          <p className="text-gray-600 mb-6">This page is only accessible to advisors</p>
          <Link
            href="/program/dashboard"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const upcomingAppointments = appointments.filter(
    (a) => a.status === 'confirmed' && new Date(a.scheduled_at) > new Date()
  );

  const completedAppointments = appointments.filter((a) => a.status === 'completed');
  const totalEarnings = completedAppointments.reduce((sum, a) => sum + ((advisorProfile?.rate || 0) * (a.duration / 60)), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-6 py-8">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <Image
                src={user.avatar_url || '/images/logo.png'}
                alt={user.name}
                width={80}
                height={80}
                className="rounded-full border-4 border-white"
              />
              <div>
                <h1 className="text-3xl font-bold">Advisor Dashboard</h1>
                <p className="text-blue-100">{user.name || user.username}</p>
                <div className="flex items-center gap-4 mt-2">
                  {advisorProfile && (
                    <>
                      <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">
                        ${advisorProfile.rate}/hour
                      </span>
                      {advisorProfile.rating > 0 && (
                        <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                          <svg className="w-4 h-4 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          {advisorProfile.rating.toFixed(1)}
                        </span>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
            <Link
              href="/program/advisor-profile-edit"
              className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Edit Profile
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Wallet Balance</p>
                <p className="text-2xl font-bold text-gray-800">${(user.wallet_balance || 0).toFixed(2)}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <button
              onClick={() => setShowWithdrawModal(true)}
              className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Withdraw
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Earnings</p>
                <p className="text-2xl font-bold text-gray-800">${totalEarnings.toFixed(2)}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Upcoming Sessions</p>
                <p className="text-2xl font-bold text-gray-800">{upcomingAppointments.length}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Completed</p>
                <p className="text-2xl font-bold text-gray-800">{completedAppointments.length}</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Upcoming Appointments</h2>
            {upcomingAppointments.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No upcoming appointments</p>
            ) : (
              <div className="space-y-4">
                {upcomingAppointments.slice(0, 5).map((appointment) => (
                  <div key={appointment.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4">
                      <Image
                        src={appointment.user_avatar || '/images/logo.png'}
                        alt={appointment.user_name}
                        width={48}
                        height={48}
                        className="rounded-full"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800">{appointment.user_name}</h3>
                        <p className="text-sm text-gray-600">
                          {new Date(appointment.scheduled_at).toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-500">{appointment.duration} minutes</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">${((advisorProfile?.rate || 0) * (appointment.duration / 60)).toFixed(2)}</p>
                        <Link
                          href={`/program/appointments`}
                          className="text-sm text-blue-600 hover:underline"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Transactions</h2>
            {transactions.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No transactions yet</p>
            ) : (
              <div className="space-y-3">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <div>
                      <p className="font-medium text-gray-800 capitalize">{transaction.type}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(transaction.created_at).toLocaleDateString()}
                      </p>
                      {transaction.description && (
                        <p className="text-sm text-gray-600">{transaction.description}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(transaction.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Withdraw Funds</h2>
            <p className="text-gray-600 mb-2">Available balance: ${(user.wallet_balance || 0).toFixed(2)}</p>
            <p className="text-sm text-gray-500 mb-6">Minimum withdrawal: $100</p>
            <input
              type="number"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              placeholder="Amount ($)"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
              min="100"
              step="0.01"
            />
            <div className="flex gap-4">
              <button
                onClick={() => setShowWithdrawModal(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleWithdraw}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium transition-colors"
              >
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
