# 🚨 URGENT: Fix Patient Profile Creation

## Problem
Patient profiles are not being created automatically when users sign up.

## Root Causes Identified
1. ❌ `NOT NULL` constraints on `first_name`, `last_name`, `date_of_birth` causing trigger failures
2. ❌ Missing `country` column in database
3. ❌ Trigger function not handling empty strings properly
4. ❌ No error logging to identify issues

## 🔧 IMMEDIATE FIX - Follow These Steps

### Step 1: Run the Emergency Fix SQL

**Go to Supabase Dashboard:**
1. Navigate to: https://app.supabase.com
2. Select your project
3. Go to **SQL Editor** (left sidebar)
4. Click **New Query**
5. Copy the ENTIRE contents of: `supabase/EMERGENCY_FIX_PROFILE.sql`
6. Paste and click **Run**

### Step 2: Verify the Fix

After running the SQL, you should see:
- ✅ Confirmation messages in the output
- ✅ Trigger name: `on_auth_user_created`
- ✅ Function definition displayed

### Step 3: Test User Signup

1. **Delete any test users:**
   - Go to **Authentication** → **Users**
   - Delete any test accounts you created

2. **Create a new test account:**
   - Use your signup form at `/auth/signup`
   - Fill in all three steps
   - Complete signup

3. **Verify profile creation:**
   - Go to **Table Editor** → `patient_profiles`
   - You should see a new row for your test user
   - All fields should be populated

### Step 4: Check for Errors (if still failing)

If profiles still aren't created, check logs:

```sql
-- Run this in SQL Editor to see trigger logs
SELECT * FROM pg_stat_activity WHERE query LIKE '%handle_new_user%';

-- Check if trigger is enabled
SELECT 
  tgname as trigger_name,
  tgenabled as status,
  tgrelid::regclass as table_name
FROM pg_trigger 
WHERE tgname = 'on_auth_user_created';

-- Manually test the function
DO $$
DECLARE
  test_user_id UUID := gen_random_uuid();
BEGIN
  -- Simulate user creation
  RAISE NOTICE 'Testing profile creation for user: %', test_user_id;
END $$;
```

## 🔍 What Changed

### 1. Made Columns Nullable
```sql
ALTER TABLE public.patient_profiles 
  ALTER COLUMN first_name DROP NOT NULL,
  ALTER COLUMN last_name DROP NOT NULL,
  ALTER COLUMN date_of_birth DROP NOT NULL;
```

**Why:** NOT NULL constraints were causing trigger failures when users skipped optional fields.

### 2. Added Country Column
```sql
ALTER TABLE public.patient_profiles ADD COLUMN IF NOT EXISTS country TEXT;
```

**Why:** Your signup form collects country data but the database didn't have this column.

### 3. Improved Trigger Function
- ✅ Better error handling with `EXCEPTION` block
- ✅ Properly trims and converts empty strings to NULL
- ✅ Uses `ON CONFLICT` to handle race conditions
- ✅ Logs warnings without breaking user creation
- ✅ Uses `SECURITY DEFINER` to bypass RLS

### 4. Updated RLS Policies
- ✅ Added explicit `service_role` policy
- ✅ Scoped policies to `authenticated` users
- ✅ Maintained user data isolation

## 🧪 Manual Test Script

If automatic creation still doesn't work, run this to test:

```sql
-- Test the trigger function manually
-- Replace 'test@example.com' with your test email
SELECT 
  id,
  email,
  raw_user_meta_data
FROM auth.users
WHERE email = 'test@example.com';

-- Check if profile exists for this user
SELECT 
  p.*
FROM public.patient_profiles p
JOIN auth.users u ON p.user_id = u.id
WHERE u.email = 'test@example.com';
```

## 🚨 Troubleshooting

### Issue: Trigger Still Not Working

**Check trigger status:**
```sql
SELECT 
  tgname,
  tgenabled,
  pg_get_triggerdef(oid)
FROM pg_trigger 
WHERE tgname = 'on_auth_user_created';
```

**Manually create profile:**
```sql
-- Get your user ID first
SELECT id, email FROM auth.users WHERE email = 'your@email.com';

-- Then insert profile manually
INSERT INTO public.patient_profiles (
  user_id,
  first_name,
  last_name
) VALUES (
  'YOUR_USER_ID_HERE',
  'Test',
  'User'
);
```

### Issue: RLS Policy Errors

**Temporarily disable RLS for testing:**
```sql
-- ⚠️ ONLY FOR TESTING - RE-ENABLE AFTER!
ALTER TABLE public.patient_profiles DISABLE ROW LEVEL SECURITY;

-- After testing, re-enable:
ALTER TABLE public.patient_profiles ENABLE ROW LEVEL SECURITY;
```

### Issue: Function Permission Errors

**Grant explicit permissions:**
```sql
GRANT ALL ON public.patient_profiles TO postgres, anon, authenticated, service_role;
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
```

## ✅ Success Indicators

You'll know it's working when:
1. ✅ New users can sign up without errors
2. ✅ Profile appears in `patient_profiles` table immediately
3. ✅ Dashboard loads without "profile not found" errors
4. ✅ User data is properly populated from signup form

## 📞 Still Having Issues?

If you've followed all steps and it's still not working:

1. **Check Supabase logs:**
   - Go to **Database** → **Logs**
   - Look for errors related to `patient_profiles` or `handle_new_user`

2. **Check function execution:**
   ```sql
   -- See recent function calls
   SELECT * FROM pg_stat_user_functions 
   WHERE funcname = 'handle_new_user';
   ```

3. **Verify user metadata:**
   ```sql
   -- Check what data is being saved
   SELECT 
     email,
     raw_user_meta_data
   FROM auth.users
   ORDER BY created_at DESC
   LIMIT 5;
   ```

## 📝 Prevention for Future

After fixing, add monitoring:

```sql
-- Create a view to monitor profile creation
CREATE OR REPLACE VIEW public.users_without_profiles AS
SELECT 
  u.id,
  u.email,
  u.created_at,
  u.raw_user_meta_data
FROM auth.users u
LEFT JOIN public.patient_profiles p ON u.id = p.user_id
WHERE p.id IS NULL
ORDER BY u.created_at DESC;

-- Check this view periodically
SELECT * FROM public.users_without_profiles;
```

## 🎯 Next Steps After Fix

Once working:
1. ✅ Test the entire signup → email confirmation → dashboard flow
2. ✅ Verify all user data persists correctly
3. ✅ Test with multiple user signups
4. ✅ Monitor the `users_without_profiles` view
5. ✅ Set up alerts for failed profile creations

---

**Last Updated:** 2026-02-02
**Status:** 🔴 Critical - Needs immediate attention
