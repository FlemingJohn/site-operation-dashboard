INSERT INTO installations (site_id, technician_id, equipment, status, installed_on) VALUES
  (1, 2, 'Solar Inverter 50kW', 'completed', CURRENT_DATE - 130),
  (2, 3, 'HVAC Unit', 'completed', CURRENT_DATE - 100),
  (3, 4, 'Diesel Generator 250kVA', 'completed', CURRENT_DATE - 70),
  (4, 5, 'UPS Battery Bank', 'in_progress', CURRENT_DATE - 35),
  (1, NULL, 'CCTV Array', 'pending', CURRENT_DATE - 3);
