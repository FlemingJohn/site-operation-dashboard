CREATE TABLE IF NOT EXISTS activity_log (
  id BIGSERIAL PRIMARY KEY,
  kind VARCHAR(20) NOT NULL
    CHECK (kind IN ('installation', 'service', 'part', 'site', 'user')),
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  actor_name VARCHAR(100),
  verb VARCHAR(100) NOT NULL,
  target_label VARCHAR(200) NOT NULL,
  target_path VARCHAR(200) NOT NULL,
  after_text VARCHAR(200),
  change JSONB,
  note VARCHAR(500)
);
