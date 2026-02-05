-- Auto-create patient profile on user signup
-- This migration adds a trigger to automatically create a patient profile when a user signs up

-- Drop existing policies and recreate them for clarity
DROP POLICY IF EXISTS "Users can view own profile" ON public.patient_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.patient_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.patient_profiles;

-- Recreate RLS policies
CREATE POLICY "Users can view own profile"
  ON public.patient_profiles
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON public.patient_profiles
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON public.patient_profiles
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Add country column if it doesn't exist
ALTER TABLE public.patient_profiles ADD COLUMN IF NOT EXISTS country TEXT;

-- Create function to handle new user profile creation
-- This function runs with SECURITY DEFINER to bypass RLS during automatic profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.patient_profiles (
    user_id,
    first_name,
    last_name,
    date_of_birth,
    phone,
    address,
    city,
    state,
    zip_code,
    country,
    diagnosis,
    stage,
    current_treatment,
    allergies
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'first_name', 'User'),
    COALESCE(NEW.raw_user_meta_data->>'last_name', 'Name'),
    COALESCE((NEW.raw_user_meta_data->>'date_of_birth')::date, CURRENT_DATE - INTERVAL '30 years'),
    NEW.raw_user_meta_data->>'phone',
    NEW.raw_user_meta_data->>'address',
    NEW.raw_user_meta_data->>'city',
    NEW.raw_user_meta_data->>'state',
    NEW.raw_user_meta_data->>'zip_code',
    NEW.raw_user_meta_data->>'country',
    NEW.raw_user_meta_data->>'diagnosis',
    NEW.raw_user_meta_data->>'stage',
    NEW.raw_user_meta_data->>'current_treatment',
    NEW.raw_user_meta_data->>'allergies'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

