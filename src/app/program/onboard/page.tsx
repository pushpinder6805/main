"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

export default function OnboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    about_me: '',
    timezone: 'America/New_York',
    language: 'en',
    rate: '',
    skills: [] as string[],
  });
  const [availabilities, setAvailabilities] = useState<Array<{ day_of_week: number; start_time: string; end_time: string }>>([]);
  const [avatar, setAvatar] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [skillInput, setSkillInput] = useState('');

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const handleAddSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData({ ...formData, skills: [...formData.skills, skillInput.trim()] });
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setFormData({ ...formData, skills: formData.skills.filter((s) => s !== skill) });
  };

  const handleAddAvailability = () => {
    setAvailabilities([...availabilities, { day_of_week: 0, start_time: '09:00', end_time: '17:00' }]);
  };

  const handleRemoveAvailability = (index: number) => {
    setAvailabilities(availabilities.filter((_, i) => i !== index));
  };

  const handleAvailabilityChange = (index: number, field: string, value: string | number) => {
    const updated = [...availabilities];
    updated[index] = { ...updated[index], [field]: value };
    setAvailabilities(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!user) {
      setError('Please login first');
      return;
    }

    if (!formData.about_me || !formData.rate || formData.skills.length === 0) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      const { data: advisor, error: insertError } = await supabase
        .from('advisors')
        .insert({
          user_id: user.username,
          name: user.name || user.username,
          email: user.email,
          avatar_url: user.avatar_url || '',
          about_me: formData.about_me,
          timezone: formData.timezone,
          language: formData.language,
          rate: parseFloat(formData.rate),
          skills: formData.skills,
        })
        .select()
        .single();

      if (insertError) {
        setError(`Error: ${insertError.message}`);
        setLoading(false);
        return;
      }

      if (availabilities.length > 0 && advisor) {
        const availabilityInserts = availabilities.map(a => ({
          advisor_id: advisor.id,
          day_of_week: a.day_of_week,
          start_time: a.start_time,
          end_time: a.end_time,
        }));

        await supabase.from('advisor_availabilities').insert(availabilityInserts);
      }

      router.push('/program/advisor-dashboard');
    } catch (err) {
      setError('Failed to submit onboarding');
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Login Required</h1>
          <p className="text-gray-600 mb-6">Please login to become an advisor</p>
          <a
            href="/program/login"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
          >
            Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-6 max-w-3xl">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Become an Advisor</h1>
          <p className="text-gray-600 mb-8">Complete your profile to start helping others</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profile Picture
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setAvatar(e.target.files?.[0] || null)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                About Me *
              </label>
              <textarea
                value={formData.about_me}
                onChange={(e) => setFormData({ ...formData, about_me: e.target.value })}
                rows={5}
                placeholder="Tell us about your experience and expertise..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Timezone
                </label>
                <select
                  value={formData.timezone}
                  onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="America/New_York">Eastern Time</option>
                  <option value="America/Chicago">Central Time</option>
                  <option value="America/Denver">Mountain Time</option>
                  <option value="America/Los_Angeles">Pacific Time</option>
                  <option value="Europe/London">London</option>
                  <option value="Europe/Paris">Paris</option>
                  <option value="Asia/Tokyo">Tokyo</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Language
                </label>
                <select
                  value={formData.language}
                  onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hourly Rate ($) *
              </label>
              <input
                type="number"
                value={formData.rate}
                onChange={(e) => setFormData({ ...formData, rate: e.target.value })}
                placeholder="50"
                min="1"
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Skills & Expertise *
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                  placeholder="Add a skill..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.skills.map((skill) => (
                  <span
                    key={skill}
                    className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full flex items-center gap-2"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="hover:text-blue-900"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="block text-sm font-medium text-gray-700">
                  Availability
                </label>
                <button
                  type="button"
                  onClick={handleAddAvailability}
                  className="text-sm bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded-lg transition-colors"
                >
                  + Add Slot
                </button>
              </div>
              <div className="space-y-3">
                {availabilities.map((avail, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <select
                      value={avail.day_of_week}
                      onChange={(e) => handleAvailabilityChange(index, 'day_of_week', parseInt(e.target.value))}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {daysOfWeek.map((day, i) => (
                        <option key={i} value={i}>{day}</option>
                      ))}
                    </select>
                    <input
                      type="time"
                      value={avail.start_time}
                      onChange={(e) => handleAvailabilityChange(index, 'start_time', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-gray-500">to</span>
                    <input
                      type="time"
                      value={avail.end_time}
                      onChange={(e) => handleAvailabilityChange(index, 'end_time', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveAvailability(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 rounded-lg transition-colors"
            >
              {loading ? 'Setting up your profile...' : 'Complete Setup'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
