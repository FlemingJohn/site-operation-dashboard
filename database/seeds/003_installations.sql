INSERT INTO installations (site_id, technician_id, equipment, status, installed_on)
SELECT
  (n * 7) % 12 + 1,
  (n * 3) % 5 + 2,
  (ARRAY[
    'Solar Inverter 50kW',
    'HVAC Unit',
    'Diesel Generator 250kVA',
    'Fire Suppression Panel',
    'UPS Battery Bank',
    'Distribution Transformer',
    'CCTV Array',
    'Access Control Gates',
    'Conveyor Motor',
    'Rooftop Solar Panels',
    'Server Rack Cooling',
    'LED Floodlight Mast'
  ])[n % 12 + 1],
  CASE
    WHEN n <= 40 AND n % 5 = 1 THEN 'pending'
    WHEN n <= 45 AND n % 5 IN (3, 4) THEN 'in_progress'
    ELSE 'completed'
  END,
  CURRENT_DATE - (n * 1.4)::INTEGER
FROM generate_series(1, 112) AS n;
