SELECT
  s.region,
  COUNT(i.id) AS total_installations,
  COUNT(i.id) FILTER (WHERE i.status = 'completed') AS completed_installations,
  ROUND(
    COUNT(i.id) FILTER (WHERE i.status = 'completed') * 100.0 / NULLIF(COUNT(i.id), 0),
    1
  ) AS completion_rate
FROM sites s
LEFT JOIN installations i ON i.site_id = s.id
GROUP BY s.region
ORDER BY completion_rate DESC NULLS LAST;
