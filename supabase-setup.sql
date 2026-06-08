-- Run this in Supabase SQL Editor → New Query

CREATE TABLE IF NOT EXISTS rsvp (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at  TIMESTAMPTZ DEFAULT NOW()             NOT NULL,
  full_name   TEXT                                  NOT NULL,
  mobile_number TEXT                                NOT NULL UNIQUE,
  attending   BOOLEAN                               NOT NULL,
  guest_count INTEGER
);

-- Prevent reading via anon key (only service role can insert/read)
ALTER TABLE rsvp ENABLE ROW LEVEL SECURITY;

-- Allow inserts from the API (using service role key, bypasses RLS)
-- No public SELECT policy — only admin API (service role) can read

-- Index for duplicate check
CREATE INDEX IF NOT EXISTS rsvp_mobile_idx ON rsvp (mobile_number);
