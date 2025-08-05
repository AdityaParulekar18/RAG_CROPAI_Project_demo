import { useState } from 'react';
import { supabase, ImageUpload } from '../lib/supabase';

export const useImageUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadImage = async (file: File): Promise<ImageUpload | null> => {
    try {
      setUploading(true);
      setError(null);

      // Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `crop-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      // Save image metadata to database
      const { data, error: dbError } = await supabase
        .from('images')
        .insert({
          file_name: file.name,
          file_path: publicUrl,
          file_size: file.size,
          mime_type: file.type,
          analysis_status: 'pending'
        })
        .select()
        .single();

      if (dbError) throw dbError;

      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const updateAnalysisStatus = async (imageId: string, status: string, results?: any) => {
    try {
      const { error } = await supabase
        .from('images')
        .update({
          analysis_status: status,
          ...(results && {
            crop_type: results.cropType,
            detected_disease: results.disease,
            confidence_score: results.confidence
          }),
          updated_at: new Date().toISOString()
        })
        .eq('id', imageId);

      if (error) throw error;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed');
    }
  };

  return { uploadImage, updateAnalysisStatus, uploading, error };
};