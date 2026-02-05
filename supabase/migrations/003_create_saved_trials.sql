-- Create saved_trials table to store user's saved clinical trials
CREATE TABLE IF NOT EXISTS public.saved_trials (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    nct_id TEXT NOT NULL,
    title TEXT NOT NULL,
    status TEXT,
    phase TEXT,
    condition TEXT[],
    brief_summary TEXT,
    saved_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    notes TEXT, -- User's personal notes about this trial
    UNIQUE(user_id, nct_id) -- Prevent duplicate saves
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_saved_trials_user_id ON public.saved_trials(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_trials_nct_id ON public.saved_trials(nct_id);
CREATE INDEX IF NOT EXISTS idx_saved_trials_saved_at ON public.saved_trials(saved_at DESC);

-- Enable RLS
ALTER TABLE public.saved_trials ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own saved trials
CREATE POLICY "Users can view own saved trials"
    ON public.saved_trials
    FOR SELECT
    USING (auth.uid() = user_id);

-- Policy: Users can insert their own saved trials
CREATE POLICY "Users can save trials"
    ON public.saved_trials
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own saved trials
CREATE POLICY "Users can delete own saved trials"
    ON public.saved_trials
    FOR DELETE
    USING (auth.uid() = user_id);

-- Policy: Users can update their own saved trials (e.g., notes)
CREATE POLICY "Users can update own saved trials"
    ON public.saved_trials
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
