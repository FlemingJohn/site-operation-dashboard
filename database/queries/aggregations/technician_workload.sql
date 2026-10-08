WITH technician_counts AS (
  SELECT
    u.full_name AS technician_name,
    FALSE AS is_unassigned,
    COUNT(i.id) AS count,
    COUNT(i.id) FILTER (WHERE i.status = 'completed') AS completed,
    COUNT(i.id) FILTER (WHERE i.status = 'in_progress') AS in_progress,
    COUNT(i.id) FILTER (WHERE i.status = 'pending') AS pending
  FROM users u
  LEFT JOIN installations i ON i.technician_id = u.id
  WHERE u.role = 'technician'
  GROUP BY u.id
),
unassigned_counts AS (
  SELECT
    'Unassigned' AS technician_name,
    TRUE AS is_unassigned,
    COUNT(i.id) AS count,
    COUNT(i.id) FILTER (WHERE i.status = 'completed') AS completed,
    COUNT(i.id) FILTER (WHERE i.status = 'in_progress') AS in_progress,
    COUNT(i.id) FILTER (WHERE i.status = 'pending') AS pending
  FROM installations i
  WHERE i.technician_id IS NULL
)
SELECT technician_name, count, completed, in_progress, pending
FROM (
  SELECT * FROM technician_counts
  UNION ALL
  SELECT * FROM unassigned_counts WHERE count > 0
) workload
ORDER BY is_unassigned, count DESC, technician_name
LIMIT 8;
