INSERT INTO equipment (serial, type, status, site_id, next_service_on)
SELECT
  v.serial,
  v.type,
  CASE WHEN s.id IS NULL THEN 'in_stock' ELSE v.status END,
  s.id,
  CURRENT_DATE + v.due_in_days
FROM (
  VALUES
    ('BY-204', 'blade_yoke',     'deployed',   'Chennai Plant',          -19),
    ('TG-11',  'tower_gripper',  'deployed',   'Pune Warehouse',         -16),
    ('TL-88',  'tagline_system', 'deployed',   'Kochi Port Yard',          3),
    ('BY-206', 'blade_yoke',     'deployed',   'Kolkata Logistics Park',   6),
    ('TL-90',  'tagline_system', 'deployed',   'Pune Warehouse',          -4),
    ('BY-207', 'blade_yoke',     'deployed',   'Chennai Plant',           15),
    ('TG-12',  'tower_gripper',  'deployed',   'Kolkata Logistics Park',  58),
    ('MR-3',   'mobile_robot',   'in_service', 'Chennai Plant',           50),
    ('MR-4',   'mobile_robot',   'deployed',   'Pune Warehouse',          72),
    ('TL-91',  'tagline_system', 'deployed',   'Kolkata Logistics Park',  88),
    ('BY-205', 'blade_yoke',     'in_stock',   NULL,                      41),
    ('TG-13',  'tower_gripper',  'in_stock',   NULL,                      24)
) AS v (serial, type, status, site_name, due_in_days)
LEFT JOIN sites s ON s.name = v.site_name
ON CONFLICT (serial) DO NOTHING;
