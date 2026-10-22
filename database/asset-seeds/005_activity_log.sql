INSERT INTO activity_log (kind, occurred_at, actor_name, verb, target_label, target_path, after_text, note)
SELECT
  'service',
  r.done_on + TIME '10:00',
  u.full_name,
  'recorded a check-up on',
  CASE e.type
    WHEN 'blade_yoke' THEN 'Blade Yoke '
    WHEN 'tower_gripper' THEN 'Tower Gripper '
    WHEN 'tagline_system' THEN 'Tagline System '
    ELSE 'Mobile Robot '
  END || e.serial,
  '/equipment/' || e.id,
  CASE WHEN s.name IS NULL THEN NULL ELSE 'at ' || s.name END,
  r.notes
FROM service_records r
INNER JOIN equipment e ON e.id = r.equipment_id
LEFT JOIN sites s ON s.id = e.site_id
LEFT JOIN users u ON u.id = r.technician_id
WHERE r.done_on >= CURRENT_DATE - 45
  AND NOT EXISTS (SELECT 1 FROM activity_log);

INSERT INTO activity_log (kind, occurred_at, actor_name, verb, target_label, target_path, after_text, change)
SELECT
  'part',
  pr.requested_on + TIME '09:00',
  u.full_name,
  'asked for',
  pr.quantity || ' × ' || p.name,
  '/spare-parts',
  CASE WHEN e.serial IS NULL THEN 'for the store' ELSE 'for ' || e.serial END,
  jsonb_build_array(pr.status)
FROM part_requests pr
INNER JOIN spare_parts p ON p.id = pr.part_id
LEFT JOIN equipment e ON e.id = pr.equipment_id
LEFT JOIN users u ON u.id = pr.requested_by
WHERE NOT EXISTS (SELECT 1 FROM activity_log WHERE kind = 'part');
