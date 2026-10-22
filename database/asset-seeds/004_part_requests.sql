INSERT INTO part_requests (part_id, equipment_id, requested_by, quantity, status, requested_on)
SELECT
  p.id,
  e.id,
  u.id,
  v.quantity,
  v.status,
  CURRENT_DATE - v.days_ago
FROM (
  VALUES
    ('Hydraulic pin set',        'BY-204', 'ravi.kumar@siteops.example',   4, 'ordered',    3),
    ('Lifting sling 12 t',       'TL-88',  'anita.sharma@siteops.example', 2, 'requested',  1),
    ('Gripper liner',            'TG-11',  'mohan.rao@siteops.example',    1, 'delivered', 19),
    ('Clamp pad for blade yoke', 'BY-204', 'priya.nair@siteops.example',   2, 'requested',  0),
    ('Tagline rope 60 m',        'TL-90',  'ravi.kumar@siteops.example',   1, 'ordered',    6),
    ('Sensor kit',               'MR-3',   'anita.sharma@siteops.example', 3, 'delivered', 12)
) AS v (part_name, serial, requester_email, quantity, status, days_ago)
INNER JOIN spare_parts p ON p.name = v.part_name
LEFT JOIN equipment e ON e.serial = v.serial
LEFT JOIN users u ON u.email = v.requester_email
WHERE NOT EXISTS (SELECT 1 FROM part_requests);
