SELECT
  s.name AS site_name,
  COUNT(i.id) AS count,
  COUNT(i.id) FILTER (WHERE i.status = 'completed') AS completed,
  COUNT(i.id) FILTER (WHERE i.status = 'in_progress') AS in_progress,
  COUNT(i.id) FILTER (WHERE i.status = 'pending') AS pending
FROM sites s
LEFT JOIN installations i ON i.site_id = s.id
GROUP BY s.id
ORDER BY count DESC, site_name
LIMIT 8;
