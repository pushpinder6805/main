/*
  # Create Advisor System Tables

  1. New Tables
    - `advisors`
      - `id` (uuid, primary key)
      - `user_id` (text, discourse username)
      - `name` (text)
      - `email` (text)
      - `avatar_url` (text)
      - `about_me` (text)
      - `language` (text)
      - `timezone` (text)
      - `rate` (numeric, hourly rate)
      - `skills` (text[], array of skills)
      - `rating` (numeric, average rating)
      - `reviews_count` (integer)
      - `wallet_balance` (numeric, default 0)
      - `is_active` (boolean, default true)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `advisor_availabilities`
      - `id` (uuid, primary key)
      - `advisor_id` (uuid, foreign key to advisors)
      - `day_of_week` (integer, 0-6 for Sunday-Saturday)
      - `start_time` (time)
      - `end_time` (time)
      - `created_at` (timestamptz)

    - `appointments`
      - `id` (uuid, primary key)
      - `advisor_id` (uuid, foreign key to advisors)
      - `user_id` (text, discourse username)
      - `user_name` (text)
      - `user_email` (text)
      - `user_avatar` (text)
      - `scheduled_at` (timestamptz)
      - `duration` (integer, minutes)
      - `status` (text, pending/confirmed/completed/cancelled)
      - `meeting_link` (text)
      - `notes` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to read advisor data
    - Add policies for advisors to manage their own data
*/

CREATE TABLE IF NOT EXISTS advisors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text UNIQUE NOT NULL,
  name text NOT NULL,
  email text NOT NULL,
  avatar_url text DEFAULT '',
  about_me text DEFAULT '',
  language text DEFAULT 'en',
  timezone text DEFAULT 'UTC',
  rate numeric DEFAULT 0,
  skills text[] DEFAULT '{}',
  rating numeric DEFAULT 0,
  reviews_count integer DEFAULT 0,
  wallet_balance numeric DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS advisor_availabilities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  advisor_id uuid REFERENCES advisors(id) ON DELETE CASCADE,
  day_of_week integer NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time time NOT NULL,
  end_time time NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  advisor_id uuid REFERENCES advisors(id) ON DELETE CASCADE,
  user_id text NOT NULL,
  user_name text NOT NULL,
  user_email text NOT NULL,
  user_avatar text DEFAULT '',
  scheduled_at timestamptz NOT NULL,
  duration integer DEFAULT 60,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  meeting_link text DEFAULT '',
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE advisors ENABLE ROW LEVEL SECURITY;
ALTER TABLE advisor_availabilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active advisors"
  ON advisors FOR SELECT
  USING (is_active = true);

CREATE POLICY "Advisors can update own profile"
  ON advisors FOR UPDATE
  TO authenticated
  USING (user_id = current_setting('request.jwt.claims', true)::json->>'username')
  WITH CHECK (user_id = current_setting('request.jwt.claims', true)::json->>'username');

CREATE POLICY "Advisors can insert own profile"
  ON advisors FOR INSERT
  TO authenticated
  WITH CHECK (user_id = current_setting('request.jwt.claims', true)::json->>'username');

CREATE POLICY "Anyone can view advisor availabilities"
  ON advisor_availabilities FOR SELECT
  USING (true);

CREATE POLICY "Advisors can manage own availabilities"
  ON advisor_availabilities FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM advisors
      WHERE advisors.id = advisor_availabilities.advisor_id
      AND advisors.user_id = current_setting('request.jwt.claims', true)::json->>'username'
    )
  );

CREATE POLICY "Users can view own appointments"
  ON appointments FOR SELECT
  TO authenticated
  USING (
    user_id = current_setting('request.jwt.claims', true)::json->>'username'
    OR EXISTS (
      SELECT 1 FROM advisors
      WHERE advisors.id = appointments.advisor_id
      AND advisors.user_id = current_setting('request.jwt.claims', true)::json->>'username'
    )
  );

CREATE POLICY "Users can create appointments"
  ON appointments FOR INSERT
  TO authenticated
  WITH CHECK (user_id = current_setting('request.jwt.claims', true)::json->>'username');

CREATE POLICY "Users and advisors can update appointments"
  ON appointments FOR UPDATE
  TO authenticated
  USING (
    user_id = current_setting('request.jwt.claims', true)::json->>'username'
    OR EXISTS (
      SELECT 1 FROM advisors
      WHERE advisors.id = appointments.advisor_id
      AND advisors.user_id = current_setting('request.jwt.claims', true)::json->>'username'
    )
  )
  WITH CHECK (
    user_id = current_setting('request.jwt.claims', true)::json->>'username'
    OR EXISTS (
      SELECT 1 FROM advisors
      WHERE advisors.id = appointments.advisor_id
      AND advisors.user_id = current_setting('request.jwt.claims', true)::json->>'username'
    )
  );

CREATE INDEX IF NOT EXISTS idx_advisors_user_id ON advisors(user_id);
CREATE INDEX IF NOT EXISTS idx_advisor_availabilities_advisor_id ON advisor_availabilities(advisor_id);
CREATE INDEX IF NOT EXISTS idx_appointments_advisor_id ON appointments(advisor_id);
CREATE INDEX IF NOT EXISTS idx_appointments_user_id ON appointments(user_id);
CREATE INDEX IF NOT EXISTS idx_appointments_scheduled_at ON appointments(scheduled_at);