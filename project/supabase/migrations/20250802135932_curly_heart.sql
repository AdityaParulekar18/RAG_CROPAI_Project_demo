/*
  # Create images table for crop disease detection

  1. New Tables
    - `images`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `file_name` (text)
      - `file_path` (text)
      - `file_size` (integer)
      - `mime_type` (text)
      - `crop_type` (text, nullable)
      - `detected_disease` (text, nullable)
      - `confidence_score` (decimal, nullable)
      - `analysis_status` (text, default 'pending')
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `images` table
    - Add policy for authenticated users to manage their own images
    - Add policy for public read access to processed images
*/

CREATE TABLE IF NOT EXISTS images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name text NOT NULL,
  file_path text NOT NULL,
  file_size integer NOT NULL,
  mime_type text NOT NULL,
  crop_type text,
  detected_disease text,
  confidence_score decimal(5,2),
  analysis_status text DEFAULT 'pending' CHECK (analysis_status IN ('pending', 'processing', 'completed', 'failed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE images ENABLE ROW LEVEL SECURITY;

-- Policy for users to manage their own images
CREATE POLICY "Users can manage own images"
  ON images
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy for public read access to completed analyses
CREATE POLICY "Public can view completed analyses"
  ON images
  FOR SELECT
  TO public
  USING (analysis_status = 'completed');

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_images_user_id ON images(user_id);
CREATE INDEX IF NOT EXISTS idx_images_status ON images(analysis_status);
CREATE INDEX IF NOT EXISTS idx_images_created_at ON images(created_at DESC);