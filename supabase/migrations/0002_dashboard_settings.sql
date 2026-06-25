-- Run manually in Supabase SQL editor (not auto-applied)
-- Adds persistent dashboard settings toggles.

ALTER TABLE users ADD COLUMN IF NOT EXISTS briefing_enabled boolean DEFAULT true;
ALTER TABLE users ADD COLUMN IF NOT EXISTS deadline_interventions boolean DEFAULT true;
ALTER TABLE users ADD COLUMN IF NOT EXISTS low_stakes_reminders boolean DEFAULT false;

UPDATE users SET briefing_enabled = true WHERE briefing_enabled IS NULL;
UPDATE users SET deadline_interventions = true WHERE deadline_interventions IS NULL;
UPDATE users SET low_stakes_reminders = false WHERE low_stakes_reminders IS NULL;

ALTER TABLE users ALTER COLUMN briefing_enabled SET NOT NULL;
ALTER TABLE users ALTER COLUMN deadline_interventions SET NOT NULL;
ALTER TABLE users ALTER COLUMN low_stakes_reminders SET NOT NULL;
