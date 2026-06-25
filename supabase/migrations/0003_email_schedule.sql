-- Run manually in Supabase SQL editor (not auto-applied)
-- Adds email priority and class schedule onboarding fields.

ALTER TABLE users ADD COLUMN IF NOT EXISTS email_priorities jsonb;
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_priorities_other text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS class_days jsonb;
ALTER TABLE users ADD COLUMN IF NOT EXISTS schedule_context text;
