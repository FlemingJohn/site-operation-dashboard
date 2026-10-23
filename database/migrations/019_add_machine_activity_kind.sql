ALTER TABLE activity_log DROP CONSTRAINT IF EXISTS activity_log_kind_check;

ALTER TABLE activity_log ADD CONSTRAINT activity_log_kind_check
  CHECK (kind IN ('installation', 'service', 'part', 'site', 'user', 'machine'));
