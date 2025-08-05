import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);


// Database types
export interface TeamMember {
  id: string;
  name: string;
  role: string;
  specialization: string;
  description: string;
  image_url: string | null;
  github_url: string | null;
  linkedin_url: string | null;
  email: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ImageUpload {
  id: string;
  user_id: string | null;
  file_name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  crop_type: string | null;
  detected_disease: string | null;
  confidence_score: number | null;
  analysis_status: 'pending' | 'processing' | 'completed' | 'failed';
  created_at: string;
  updated_at: string;
}

export interface AnalysisResult {
  id: string;
  image_id: string;
  crop_type: string;
  crop_confidence: number;
  disease_name: string | null;
  disease_confidence: number | null;
  description: string | null;
  treatment_recommendations: any[];
  severity_level: 'low' | 'medium' | 'high' | 'critical' | null;
  affected_area_percentage: number | null;
  model_version: string;
  processing_time_ms: number;
  created_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  user_id: string | null;
  created_at: string;
  updated_at: string;
}