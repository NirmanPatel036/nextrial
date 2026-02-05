-- Debug and fix profile creation issues
-- This migration adds better error handling and debugging

-- First, let's check if the trigger exists and is working
-- Create a more robust version of the profile creation function

-- Drop existing function and trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create improved function with error handling and logging
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_first_name TEXT;
  v_last_name TEXT;
  v_dob DATE;
BEGIN
  -- Extract and validate data with better error handling
  v_first_name := COALESCE(NEW.raw_user_meta_data->>'first_name', '');
  v_last_name := COALESCE(NEW.raw_user_meta_data->>'last_name', '');
  
  -- Handle date of birth with better error handling
  BEGIN
    v_dob := (NEW.raw_user_meta_data->>'date_of_birth')::date;
  EXCEPTION WHEN OTHERS THEN
    v_dob := NULL;
  END;

  -- Insert profile with explicit error handling
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
    allergies,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    v_first_name,
    v_last_name,
    v_dob,
    NEW.raw_user_meta_data->>'phone',
    NEW.raw_user_meta_data->>'address',
    NEW.raw_user_meta_data->>'city',
    NEW.raw_user_meta_data->>'state',
    NEW.raw_user_meta_data->>'zip_code',
    COALESCE(NEW.raw_user_meta_data->>'country', 'United States'),
    NEW.raw_user_meta_data->>'diagnosis',
    NEW.raw_user_meta_data->>'stage',
    NEW.raw_user_meta_data->>'current_treatment',
    NEW.raw_user_meta_data->>'allergies',
    NOW(),
    NOW()
  )
  ON CONFLICT (user_id) DO UPDATE
  SET
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    date_of_birth = EXCLUDED.date_of_birth,
    phone = EXCLUDED.phone,
    address = EXCLUDED.address,
    city = EXCLUDED.city,
    state = EXCLUDED.state,
    zip_code = EXCLUDED.zip_code,
    country = EXCLUDED.country,
    diagnosis = EXCLUDED.diagnosis,
    stage = EXCLUDED.stage,
    current_treatment = EXCLUDED.current_treatment,
    allergies = EXCLUDED.allergies,
    updated_at = NOW();

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't fail the user creation
    RAISE WARNING 'Failed to create patient profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON public.patient_profiles TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;

-- Ensure RLS is enabled
ALTER TABLE public.patient_profiles ENABLE ROW LEVEL SECURITY;

-- Recreate policies with better coverage
DROP POLICY IF EXISTS "Users can view own profile" ON public.patient_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.patient_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.patient_profiles;
DROP POLICY IF EXISTS "Service role can manage all profiles" ON public.patient_profiles;

-- Allow users to view their own profile
CREATE POLICY "Users can view own profile"
  ON public.patient_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Allow users to insert their own profile (though trigger should handle this)
CREATE POLICY "Users can insert own profile"
  ON public.patient_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile"
  ON public.patient_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Allow service role to manage all profiles (for the trigger)
CREATE POLICY "Service role can manage all profiles"
  ON public.patient_profiles
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_patient_profiles_user_id ON public.patient_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_patient_profiles_created_at ON public.patient_profiles(created_at);

COMMENT ON FUNCTION public.handle_new_user() IS 'Automatically creates a patient profile when a new user signs up. Runs with SECURITY DEFINER to bypass RLS.';
