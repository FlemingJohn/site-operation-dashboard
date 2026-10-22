CREATE TABLE IF NOT EXISTS spare_parts (
  id SERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL UNIQUE,
  stock INTEGER NOT NULL DEFAULT 0 CONSTRAINT spare_parts_stock_check CHECK (stock >= 0),
  reorder_at INTEGER NOT NULL DEFAULT 0 CHECK (reorder_at >= 0),
  capacity INTEGER NOT NULL CHECK (capacity > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
