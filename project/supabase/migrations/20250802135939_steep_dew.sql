/*
  # Create team members table

  1. New Tables
    - `team_members`
      - `id` (uuid, primary key)
      - `name` (text, not null)
      - `role` (text, not null)
      - `specialization` (text, not null)
      - `description` (text)
      - `image_url` (text)
      - `github_url` (text, nullable)
      - `linkedin_url` (text, nullable)
      - `email` (text, nullable)
      - `display_order` (integer, default 0)
      - `is_active` (boolean, default true)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `team_members` table
    - Add policy for public read access
    - Add policy for admin users to manage team members
*/

CREATE TABLE IF NOT EXISTS team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text NOT NULL DEFAULT 'AI&DS Student',
  specialization text NOT NULL DEFAULT 'TSEC, Mumbai',
  description text DEFAULT 'Final year AI&DS student at Thadomal Shahani Engineering College, Mumbai.',
  image_url text,
  github_url text,
  linkedin_url text,
  email text,
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- Policy for public read access to active team members
CREATE POLICY "Public can view active team members"
  ON team_members
  FOR SELECT
  TO public
  USING (is_active = true);

-- Policy for authenticated users to manage team members (for admin functionality)
CREATE POLICY "Authenticated users can manage team members"
  ON team_members
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_team_members_display_order ON team_members(display_order);
CREATE INDEX IF NOT EXISTS idx_team_members_active ON team_members(is_active);

-- Insert initial team members data
INSERT INTO team_members (name, role, specialization, description, display_order, email) VALUES
  ('Aditya Parulekar', 'AI&DS Student', 'TSEC, Mumbai', 'Final year AI&DS student at Thadomal Shahani Engineering College, Mumbai.', 1, 'aditya.parulekar@student.tsec.in'),
  ('Harsh Patel', 'AI&DS Student', 'TSEC, Mumbai', 'Final year AI&DS student at Thadomal Shahani Engineering College, Mumbai.', 2, 'harsh.patel@student.tsec.in'),
  ('Atharva Vichare', 'AI&DS Student', 'TSEC, Mumbai', 'Final year AI&DS student at Thadomal Shahani Engineering College, Mumbai.', 3, 'atharva.vichare@student.tsec.in'),
  ('Sairaj Vinayagamoorthy', 'AI&DS Student', 'TSEC, Mumbai', 'Final year AI&DS student at Thadomal Shahani Engineering College, Mumbai.', 4, 'sairaj.vinayagamoorthy@student.tsec.in');