CREATE TABLE IF NOT EXISTS installations (
  id SERIAL PRIMARY KEY,
  site_id INTEGER NOT NULL REFERENCES sites (id) ON DELETE CASCADE,
  technician_id INTEGER REFERENCES users (id) ON DELETE SET NULL,
  equipment VARCHAR(150) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'in_progress', 'completed')),
  installed_on DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
