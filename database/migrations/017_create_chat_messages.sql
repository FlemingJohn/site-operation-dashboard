CREATE TABLE IF NOT EXISTS chat_messages (
  id BIGSERIAL PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES chat_sessions (id) ON DELETE CASCADE,
  role VARCHAR(10) NOT NULL CHECK (role IN ('user', 'assistant')),
  text VARCHAR(4000) NOT NULL,
  card JSONB,
  records JSONB NOT NULL DEFAULT '[]'::jsonb,
  sources JSONB NOT NULL DEFAULT '[]'::jsonb,
  status VARCHAR(10) NOT NULL DEFAULT 'done' CHECK (status IN ('done', 'error', 'stopped')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
