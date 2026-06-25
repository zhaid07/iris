-- Run manually in Supabase SQL editor (not auto-applied)

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
