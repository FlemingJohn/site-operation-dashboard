CREATE TABLE IF NOT EXISTS idempotency_keys (
  key UUID PRIMARY KEY,
  request_hash CHAR(64) NOT NULL,
  status_code SMALLINT,
  response_body JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
