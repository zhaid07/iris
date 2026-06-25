CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_id text UNIQUE NOT NULL,
  email text NOT NULL,
  phone_number text,
  briefing_time text DEFAULT '10:00',
  timezone text DEFAULT 'America/Los_Angeles',
  display_name text,
  major text,
  onboarding_stressors jsonb,
  iris_tone text,
  context_bio text,
  fear_context text,
  email_priorities jsonb,
  email_priorities_other text,
  class_days jsonb,
  schedule_context text,
  briefing_enabled boolean DEFAULT true,
  deadline_interventions boolean DEFAULT true,
  low_stakes_reminders boolean DEFAULT false,
  onboarding_complete boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS integrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  provider text NOT NULL,
  access_token text,
  refresh_token text,
  token_expiry timestamptz,
  canvas_token text,
  canvas_domain text,
  connected_at timestamptz DEFAULT now(),
  is_active boolean DEFAULT true
);

CREATE INDEX IF NOT EXISTS integrations_user_id_idx ON integrations(user_id);

CREATE TABLE IF NOT EXISTS briefings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  content text NOT NULL,
  raw_data jsonb,
  sent_via_sms boolean DEFAULT false,
  sms_sent_at timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS briefings_user_id_idx ON briefings(user_id);

CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  role text NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS chat_messages_user_id_idx ON chat_messages(user_id);

CREATE TABLE IF NOT EXISTS syllabi (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_name text NOT NULL,
  grade_weights jsonb,
  exam_dates jsonb,
  office_hours text,
  drop_policy text,
  professor_name text,
  professor_email text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS syllabi_user_id_idx ON syllabi(user_id);
