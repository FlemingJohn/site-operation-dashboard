SELECT
  TO_CHAR(m.month, 'YYYY-MM') AS month,
  TO_CHAR(m.month, 'Mon') AS label,
  COUNT(i.id) AS total
FROM generate_series(
  DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '5 months',
  DATE_TRUNC('month', CURRENT_DATE),
  INTERVAL '1 month'
) AS m(month)
LEFT JOIN installations i ON DATE_TRUNC('month', i.installed_on) = m.month
GROUP BY m.month
ORDER BY m.month;
