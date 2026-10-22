CREATE TABLE IF NOT EXISTS part_requests (
  id SERIAL PRIMARY KEY,
  part_id INTEGER NOT NULL REFERENCES spare_parts (id) ON DELETE RESTRICT,
  equipment_id INTEGER REFERENCES equipment (id) ON DELETE SET NULL,
  requested_by INTEGER REFERENCES users (id) ON DELETE SET NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  status VARCHAR(20) NOT NULL DEFAULT 'requested'
    CHECK (status IN ('requested', 'ordered', 'delivered')),
  requested_on DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
