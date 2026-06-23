-- Run manually in Supabase SQL editor (not auto-applied)
-- Adds onboarding profile columns for conversational dog-guided flow

ALTER TABLE users ADD COLUMN IF NOT EXISTS display_name text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS major text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS onboarding_stressors jsonb;
ALTER TABLE users ADD COLUMN IF NOT EXISTS iris_tone text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS context_bio text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS fear_context text;
