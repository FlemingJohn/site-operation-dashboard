WITH site_totals AS (
  SELECT
    COUNT(*) AS sites,
    COUNT(*) FILTER (WHERE status = 'active') AS active_sites
  FROM sites
),
installation_totals AS (
  SELECT
    COUNT(*) AS installations,
    COUNT(*) FILTER (WHERE status = 'completed') AS completed_installations,
    COUNT(*) FILTER (WHERE status = 'in_progress') AS in_progress_installations,
    COUNT(*) FILTER (WHERE status = 'pending') AS pending_installations
  FROM installations
)
SELECT
  st.sites,
  st.active_sites,
  it.installations,
  it.completed_installations,
  it.in_progress_installations,
  it.pending_installations
FROM site_totals st
CROSS JOIN installation_totals it;
