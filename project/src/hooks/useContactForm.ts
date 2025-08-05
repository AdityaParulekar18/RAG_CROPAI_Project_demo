import { useState } from 'react';
import { supabase } from '../lib/supabase';

export const useContactForm = () => {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitMessage = async (formData: { name: string; email: string; message: string }) => {
    try {
      setSubmitting(true);
      setError(null);

      const { error } = await supabase
        .from('contact_messages')
        .insert({
          name: formData.name,
          email: formData.email,
          message: formData.message,
          status: 'unread'
        });

      if (error) throw error;
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submission failed');
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  return { submitMessage, submitting, error };
};