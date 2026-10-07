CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  role VARCHAR(20) NOT NULL DEFAULT 'technician' CHECK (role IN ('admin', 'technician')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
