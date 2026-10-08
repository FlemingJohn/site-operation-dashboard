WITH months AS (
  SELECT month::date AS month_start
  FROM generate_series(
    DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '5 months',
    DATE_TRUNC('month', CURRENT_DATE),
    INTERVAL '1 month'
  ) AS month
)
SELECT
  TO_CHAR(m.month_start, 'YYYY-MM') AS month,
  TO_CHAR(m.month_start, 'Mon') AS label,
  COUNT(i.id) AS count,
  COUNT(i.id) FILTER (WHERE i.status = 'completed') AS completed,
  COUNT(i.id) FILTER (WHERE i.status = 'in_progress') AS in_progress,
  COUNT(i.id) FILTER (WHERE i.status = 'pending') AS pending
FROM months m
LEFT JOIN installations i
  ON i.installed_on >= m.month_start
 AND i.installed_on < (m.month_start + INTERVAL '1 month')::date
GROUP BY m.month_start
ORDER BY m.month_start;
