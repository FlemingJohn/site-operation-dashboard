SELECT
  u.full_name AS technician_name,
  COUNT(DISTINCT s.id) AS site_count,
  STRING_AGG(DISTINCT s.name, ', ' ORDER BY s.name) AS sites
FROM users u
INNER JOIN installations i ON i.technician_id = u.id
INNER JOIN sites s ON s.id = i.site_id
WHERE u.role = 'technician'
GROUP BY u.id, u.full_name
ORDER BY site_count DESC, technician_name;
