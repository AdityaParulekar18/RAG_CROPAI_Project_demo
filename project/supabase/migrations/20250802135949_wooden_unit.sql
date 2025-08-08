/*
  # Create analysis results table for AI predictions

  1. New Tables
    - `analysis_results`
      - `id` (uuid, primary key)
      - `image_id` (uuid, references images)
      - `crop_type` (text)
      - `crop_confidence` (decimal)
      - `disease_name` (text)
      - `disease_confidence` (decimal)
      - `description` (text)
      - `treatment_recommendations` (jsonb)
      - `severity_level` (text)
      - `affected_area_percentage` (decimal, nullable)
      - `model_version` (text)
      - `processing_time_ms` (integer)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `analysis_results` table
    - Add policy for users to view results of their images
    - Add policy for public read access to completed results
*/

CREATE TABLE IF NOT EXISTS analysis_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_id uuid REFERENCES images(id) ON DELETE CASCADE NOT NULL,
  crop_type text NOT NULL,
  crop_confidence decimal(5,2) NOT NULL,
  disease_name text,
  disease_confidence decimal(5,2),
  description text,
  treatment_recommendations jsonb DEFAULT '[]'::jsonb,
  severity_level text CHECK (severity_level IN ('low', 'medium', 'high', 'critical')),
  affected_area_percentage decimal(5,2),
  model_version text DEFAULT 'v1.0',
  processing_time_ms integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE analysis_results ENABLE ROW LEVEL SECURITY;

-- Policy for users to view results of their own images
CREATE POLICY "Users can view own analysis results"
  ON analysis_results
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM images 
      WHERE images.id = analysis_results.image_id 
      AND images.user_id = auth.uid()
    )
  );

-- Policy for public read access to results of public images
CREATE POLICY "Public can view public analysis results"
  ON analysis_results
  FOR SELECT
  TO public
  USING (
    EXISTS (
      SELECT 1 FROM images 
      WHERE images.id = analysis_results.image_id 
      AND images.analysis_status = 'completed'
    )
  );

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_analysis_results_image_id ON analysis_results(image_id);
CREATE INDEX IF NOT EXISTS idx_analysis_results_crop_type ON analysis_results(crop_type);
CREATE INDEX IF NOT EXISTS idx_analysis_results_created_at ON analysis_results(created_at DESC);