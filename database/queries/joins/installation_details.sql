SELECT
  i.id,
  i.equipment,
  i.status,
  i.installed_on,
  s.name AS site_name,
  s.region,
  COALESCE(u.full_name, 'Unassigned') AS technician_name
FROM installations i
INNER JOIN sites s ON s.id = i.site_id
LEFT JOIN users u ON u.id = i.technician_id
ORDER BY i.installed_on DESC, i.id DESC
LIMIT 10;
