-- Add country field to patient_profiles table
ALTER TABLE public.patient_profiles 
ADD COLUMN IF NOT EXISTS country TEXT;
