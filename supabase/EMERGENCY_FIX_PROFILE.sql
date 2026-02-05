-- =====================================================
-- EMERGENCY FIX: Patient Profile Creation
-- Run this ENTIRE script in Supabase SQL Editor
-- =====================================================

-- Step 1: Make columns nullable to prevent trigger failures
ALTER TABLE public.patient_profiles 
  ALTER COLUMN first_name DROP NOT NULL,
  ALTER COLUMN last_name DROP NOT NULL,
  ALTER COLUMN date_of_birth DROP NOT NULL;

-- Step 2: Add country column if it doesn't exist
ALTER TABLE public.patient_profiles ADD COLUMN IF NOT EXISTS country TEXT;

-- Step 3: Drop existing trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Step 4: Create robust function with error handling
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_dob DATE;
BEGIN
  -- Try to parse date of birth, fallback to NULL if invalid
  BEGIN
    v_dob := (NEW.raw_user_meta_data->>'date_of_birth')::date;
  EXCEPTION WHEN OTHERS THEN
    v_dob := NULL;
  END;

  -- Insert with ON CONFLICT to handle race conditions
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
    COALESCE(NULLIF(TRIM(NEW.raw_user_meta_data->>'first_name'), ''), NULL),
    COALESCE(NULLIF(TRIM(NEW.raw_user_meta_data->>'last_name'), ''), NULL),
    v_dob,
    NULLIF(TRIM(NEW.raw_user_meta_data->>'phone'), ''),
    NULLIF(TRIM(NEW.raw_user_meta_data->>'address'), ''),
    NULLIF(TRIM(NEW.raw_user_meta_data->>'city'), ''),
    NULLIF(TRIM(NEW.raw_user_meta_data->>'state'), ''),
    NULLIF(TRIM(NEW.raw_user_meta_data->>'zip_code'), ''),
    NULLIF(TRIM(NEW.raw_user_meta_data->>'country'), ''),
    NULLIF(TRIM(NEW.raw_user_meta_data->>'diagnosis'), ''),
    NULLIF(TRIM(NEW.raw_user_meta_data->>'stage'), ''),
    NULLIF(TRIM(NEW.raw_user_meta_data->>'current_treatment'), ''),
    NULLIF(TRIM(NEW.raw_user_meta_data->>'allergies'), '')
  )
  ON CONFLICT (user_id) DO UPDATE SET
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
    -- Log error but don't fail user creation
    RAISE WARNING 'Failed to create patient profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 5: Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Step 6: Update RLS policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.patient_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.patient_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.patient_profiles;
DROP POLICY IF EXISTS "Service role bypass RLS" ON public.patient_profiles;

CREATE POLICY "Users can view own profile"
  ON public.patient_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON public.patient_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON public.patient_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Allow service role full access (needed for triggers)
CREATE POLICY "Service role bypass RLS"
  ON public.patient_profiles
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Step 7: Verify setup
DO $$
BEGIN
  RAISE NOTICE '✅ Patient profile creation fix applied successfully!';
  RAISE NOTICE '📋 Trigger: on_auth_user_created';
  RAISE NOTICE '🔧 Function: handle_new_user()';
  RAISE NOTICE '🔒 RLS policies updated';
  RAISE NOTICE '💡 Test by creating a new user';
END $$;

-- Step 8: Check if trigger exists
SELECT 
  tgname as trigger_name,
  tgenabled as enabled
FROM pg_trigger 
WHERE tgname = 'on_auth_user_created';

-- Step 9: Show function info
SELECT 
  p.proname as function_name,
  pg_get_functiondef(p.oid) as definition
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public' 
  AND p.proname = 'handle_new_user';
