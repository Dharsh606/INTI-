import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const submitConsultation = async (bookingData) => {
  const { data, error } = await supabase
    .from('consultations')
    .insert([
      {
        first_name: bookingData.firstName,
        last_name: bookingData.lastName,
        email: bookingData.email,
        phone: bookingData.phone,
        project_type: bookingData.projectType,
        message: bookingData.message,
      }
    ]);
  if (error) throw error;
  return data;
};
