SELECT
  (SELECT COUNT(*) FROM sites) AS total_sites,
  (SELECT COUNT(*) FROM sites WHERE status = 'active') AS active_sites,
  COUNT(i.id) AS total_installations,
  COUNT(i.id) FILTER (WHERE i.status = 'completed') AS completed_installations,
  COUNT(i.id) FILTER (WHERE i.status = 'in_progress') AS in_progress_installations,
  COUNT(i.id) FILTER (WHERE i.status = 'pending') AS pending_installations
FROM installations i;
