INSERT INTO spare_parts (name, stock, reorder_at, capacity) VALUES
  ('Hydraulic pin set', 8, 10, 30),
  ('Lifting sling 12 t', 22, 6, 30),
  ('Sensor kit', 1, 2, 8),
  ('Clamp pad for blade yoke', 0, 4, 16),
  ('Winch brake set', 6, 3, 10),
  ('Tagline rope 60 m', 3, 4, 12),
  ('Gripper liner', 14, 5, 20)
ON CONFLICT (name) DO NOTHING;
