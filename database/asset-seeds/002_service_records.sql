WITH technicians AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY email) - 1 AS position
  FROM users
  WHERE email IN (
    'ravi.kumar@siteops.example',
    'anita.sharma@siteops.example',
    'mohan.rao@siteops.example',
    'priya.nair@siteops.example'
  )
),
notes AS (
  SELECT *
  FROM (
    VALUES
      (0, 'Replaced clamp pads'),
      (1, 'Annual inspection'),
      (2, 'Hydraulic check'),
      (3, 'Calibrated sensors')
  ) AS n (position, text)
)
INSERT INTO service_records (equipment_id, technician_id, done_on, notes)
SELECT
  e.id,
  t.id,
  e.next_service_on - 90 * (step + 1),
  n.text
FROM equipment e
CROSS JOIN generate_series(0, 2) AS step
LEFT JOIN technicians t ON t.position = e.id % 4
LEFT JOIN notes n ON n.position = (e.id + step) % 4
WHERE NOT EXISTS (
  SELECT 1 FROM service_records r WHERE r.equipment_id = e.id
);
