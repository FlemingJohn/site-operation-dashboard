INSERT INTO installations (site_id, technician_id, equipment, status, installed_on)
SELECT
  s.id,
  u.id,
  v.equipment,
  v.status,
  CURRENT_DATE - v.days_ago
FROM (
  VALUES
    ('Chennai Plant',          'ravi.kumar@siteops.example',   'Solar Inverter 50kW',     'completed',   130),
    ('Pune Warehouse',         'anita.sharma@siteops.example', 'HVAC Unit',               'completed',   100),
    ('Delhi Hub',              'mohan.rao@siteops.example',    'Diesel Generator 250kVA', 'completed',   70),
    ('Kolkata Logistics Park', 'priya.nair@siteops.example',   'UPS Battery Bank',        'in_progress', 35),
    ('Chennai Plant',          NULL,                           'CCTV Array',              'pending',     3)
) AS v (site_name, technician_email, equipment, status, days_ago)
INNER JOIN sites s ON s.name = v.site_name
LEFT JOIN users u ON u.email = v.technician_email;
