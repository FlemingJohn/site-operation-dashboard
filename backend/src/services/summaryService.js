import { pool } from '../config/database.js';
import { RECENT_INSTALLATIONS_LIMIT } from '../constants.js';
import { findRecent } from './installationService.js';

const TOTALS_QUERY = `
  WITH site_totals AS (
    SELECT
      COUNT(*)::int AS sites,
      COUNT(*) FILTER (WHERE status = 'active')::int AS active_sites
    FROM sites
  ),
  installation_totals AS (
    SELECT
      COUNT(*)::int AS installations,
      COUNT(*) FILTER (WHERE status = 'completed')::int AS completed_installations,
      COUNT(*) FILTER (WHERE status = 'in_progress')::int AS in_progress_installations,
      COUNT(*) FILTER (WHERE status = 'pending')::int AS pending_installations
    FROM installations
  )
  SELECT
    st.sites AS "sites",
    st.active_sites AS "activeSites",
    it.installations AS "installations",
    it.completed_installations AS "completedInstallations",
    it.in_progress_installations AS "inProgressInstallations",
    it.pending_installations AS "pendingInstallations"
  FROM site_totals st
  CROSS JOIN installation_totals it
`;

const STATUS_BREAKDOWN_QUERY = `
  SELECT
    status,
    COUNT(*)::int AS count
  FROM installations
  GROUP BY status
  ORDER BY count DESC
`;

const MONTHLY_INSTALLATIONS_QUERY = `
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
    COUNT(i.id)::int AS count
  FROM months m
  LEFT JOIN installations i
    ON i.installed_on >= m.month_start
   AND i.installed_on < (m.month_start + INTERVAL '1 month')::date
  GROUP BY m.month_start
  ORDER BY m.month_start
`;

export const getSummary = async () => {
  const [totals, statusBreakdown, monthlyInstallations, recentInstallations] = await Promise.all([
    pool.query(TOTALS_QUERY),
    pool.query(STATUS_BREAKDOWN_QUERY),
    pool.query(MONTHLY_INSTALLATIONS_QUERY),
    findRecent(RECENT_INSTALLATIONS_LIMIT),
  ]);

  return {
    totals: totals.rows[0],
    statusBreakdown: statusBreakdown.rows,
    monthlyInstallations: monthlyInstallations.rows,
    recentInstallations,
  };
};
