CREATE TABLE IF NOT EXISTS equipment (
  id SERIAL PRIMARY KEY,
  serial VARCHAR(40) NOT NULL UNIQUE,
  type VARCHAR(20) NOT NULL
    CHECK (type IN ('blade_yoke', 'tower_gripper', 'tagline_system', 'mobile_robot')),
  status VARCHAR(20) NOT NULL DEFAULT 'in_stock'
    CHECK (status IN ('deployed', 'in_service', 'in_stock')),
  site_id INTEGER REFERENCES sites (id) ON DELETE SET NULL,
  next_service_on DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
