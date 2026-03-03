"use client"

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import Image from 'next/image';

interface Advisor {
  id: string;
  user_id: string;
  name: string;
  avatar_url: string;
  about_me: string;
  language: string;
  timezone: string;
  rate: number;
  skills: string[];
  rating: number;
  reviews_count: number;
}

export default function AdvisorsPage() {
  const [advisors, setAdvisors] = useState<Advisor[]>([]);
  const [filteredAdvisors, setFilteredAdvisors] = useState<Advisor[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [selectedSkill, setSelectedSkill] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [sortBy, setSortBy] = useState<'rating' | 'price_low' | 'price_high'>('rating');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterAndSortAdvisors();
  }, [advisors, selectedSkill, searchQuery, sortBy]);

  const loadData = async () => {
    setLoading(true);
    setError('');

    try {
      const { data: advisorsData, error: advisorsError } = await supabase
        .from('advisors')
        .select('*')
        .eq('is_active', true)
        .order('rating', { ascending: false });

      if (advisorsError) {
        console.error('Error loading advisors:', advisorsError);
        setError(advisorsError.message);
        setAdvisors([]);
      } else {
        setAdvisors(advisorsData || []);

        const allSkills = new Set<string>();
        (advisorsData || []).forEach((advisor) => {
          advisor.skills?.forEach((skill: string) => allSkills.add(skill));
        });
        setSkills(Array.from(allSkills));
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to load advisors');
      setAdvisors([]);
    }

    setLoading(false);
  };

  const filterAndSortAdvisors = () => {
    let filtered = [...advisors];

    if (selectedSkill) {
      filtered = filtered.filter((advisor) =>
        advisor.skills.includes(selectedSkill)
      );
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((advisor) =>
        advisor.name.toLowerCase().includes(query) ||
        advisor.user_id.toLowerCase().includes(query) ||
        advisor.about_me.toLowerCase().includes(query)
      );
    }

    filtered.sort((a, b) => {
      if (sortBy === 'rating') {
        return b.rating - a.rating;
      } else if (sortBy === 'price_low') {
        return a.rate - b.rate;
      } else {
        return b.rate - a.rate;
      }
    });

    setFilteredAdvisors(filtered);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading advisors...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Error Loading Advisors</h1>
          <p className="text-red-600 mb-6">{error}</p>
          <button
            onClick={loadData}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl font-bold mb-4">Find Your Perfect Advisor</h1>
          <p className="text-xl text-blue-100">Connect with expert advisors for personalized guidance</p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name or expertise..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Skill</label>
              <select
                value={selectedSkill}
                onChange={(e) => setSelectedSkill(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Skills</option>
                {skills.map((skill) => (
                  <option key={skill} value={skill}>
                    {skill}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'rating' | 'price_low' | 'price_high')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="rating">Highest Rated</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
              </select>
            </div>
          </div>

          {(selectedSkill || searchQuery) && (
            <div className="mt-4 flex items-center gap-2">
              <span className="text-sm text-gray-600">Active filters:</span>
              {selectedSkill && (
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                  {selectedSkill}
                  <button onClick={() => setSelectedSkill('')} className="hover:text-blue-900">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              )}
              {searchQuery && (
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                  Search: {searchQuery}
                  <button onClick={() => setSearchQuery('')} className="hover:text-blue-900">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        <div className="mb-4">
          <p className="text-gray-600">
            Showing <span className="font-semibold">{filteredAdvisors.length}</span> advisors
          </p>
        </div>

        {filteredAdvisors.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No advisors found</h3>
            <p className="text-gray-500">Try adjusting your search filters</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAdvisors.map((advisor) => (
              <Link
                key={advisor.id}
                href={`/program/advisors/${advisor.id}`}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <Image
                      src={advisor.avatar_url || '/images/logo.png'}
                      alt={advisor.name}
                      width={64}
                      height={64}
                      className="rounded-full"
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-800">{advisor.name}</h3>
                      <p className="text-sm text-gray-600">@{advisor.user_id}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {advisor.rating > 0 && (
                          <div className="flex items-center gap-1">
                            <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className="text-sm font-medium text-gray-700">{advisor.rating.toFixed(1)}</span>
                            <span className="text-xs text-gray-500">({advisor.reviews_count})</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{advisor.about_me}</p>

                  {advisor.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {advisor.skills.slice(0, 3).map((skill) => (
                        <span key={skill} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                          {skill}
                        </span>
                      ))}
                      {advisor.skills.length > 3 && (
                        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                          +{advisor.skills.length - 3} more
                        </span>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div>
                      <p className="text-xs text-gray-500">Starting at</p>
                      <p className="text-xl font-bold text-blue-600">${advisor.rate}/hr</p>
                    </div>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                      View Profile
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
