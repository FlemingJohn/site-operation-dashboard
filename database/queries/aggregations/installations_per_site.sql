SELECT
  s.name AS site_name,
  s.region,
  s.status,
  COUNT(i.id) AS installation_count
FROM sites s
LEFT JOIN installations i ON i.site_id = s.id
GROUP BY s.id, s.name, s.region, s.status
ORDER BY installation_count DESC, site_name;
