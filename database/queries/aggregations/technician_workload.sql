SELECT
  u.full_name AS technician_name,
  COUNT(i.id) AS total_jobs,
  COUNT(i.id) FILTER (WHERE i.status <> 'completed') AS open_jobs
FROM users u
LEFT JOIN installations i ON i.technician_id = u.id
WHERE u.role = 'technician'
GROUP BY u.id, u.full_name
ORDER BY open_jobs DESC, technician_name;
