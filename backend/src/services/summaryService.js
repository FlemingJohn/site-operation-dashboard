import { pool } from '../config/database.js';
import { BREAKDOWN_LIMIT, RECENT_INSTALLATIONS_LIMIT } from '../constants.js';
import { findRecent } from './installationService.js';

const STATUS_COUNTS = `
    COUNT(i.id)::int AS count,
    COUNT(i.id) FILTER (WHERE i.status = 'completed')::int AS completed,
    COUNT(i.id) FILTER (WHERE i.status = 'in_progress')::int AS "inProgress",
    COUNT(i.id) FILTER (WHERE i.status = 'pending')::int AS pending
`;

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
    ${STATUS_COUNTS}
  FROM months m
  LEFT JOIN installations i
    ON i.installed_on >= m.month_start
   AND i.installed_on < (m.month_start + INTERVAL '1 month')::date
  GROUP BY m.month_start
  ORDER BY m.month_start
`;

const INSTALLATIONS_BY_SITE_QUERY = `
  SELECT
    s.name AS label,
    ${STATUS_COUNTS}
  FROM sites s
  LEFT JOIN installations i ON i.site_id = s.id
  GROUP BY s.id
  ORDER BY count DESC, label
  LIMIT $1
`;

const INSTALLATIONS_BY_TECHNICIAN_QUERY = `
  WITH technician_counts AS (
    SELECT
      u.full_name AS label,
      FALSE AS is_unassigned,
      ${STATUS_COUNTS}
    FROM users u
    LEFT JOIN installations i ON i.technician_id = u.id
    WHERE u.role = 'technician'
    GROUP BY u.id
  ),
  unassigned_counts AS (
    SELECT
      'Unassigned' AS label,
      TRUE AS is_unassigned,
      ${STATUS_COUNTS}
    FROM installations i
    WHERE i.technician_id IS NULL
  )
  SELECT label, count, completed, "inProgress", pending
  FROM (
    SELECT * FROM technician_counts
    UNION ALL
    SELECT * FROM unassigned_counts WHERE count > 0
  ) workload
  ORDER BY is_unassigned, count DESC, label
  LIMIT $1
`;

export const getSummary = async () => {
  const [
    totals,
    statusBreakdown,
    monthlyInstallations,
    installationsBySite,
    installationsByTechnician,
    recentInstallations,
  ] = await Promise.all([
    pool.query(TOTALS_QUERY),
    pool.query(STATUS_BREAKDOWN_QUERY),
    pool.query(MONTHLY_INSTALLATIONS_QUERY),
    pool.query(INSTALLATIONS_BY_SITE_QUERY, [BREAKDOWN_LIMIT]),
    pool.query(INSTALLATIONS_BY_TECHNICIAN_QUERY, [BREAKDOWN_LIMIT]),
    findRecent(RECENT_INSTALLATIONS_LIMIT),
  ]);

  return {
    totals: totals.rows[0],
    statusBreakdown: statusBreakdown.rows,
    monthlyInstallations: monthlyInstallations.rows,
    installationsBySite: installationsBySite.rows,
    installationsByTechnician: installationsByTechnician.rows,
    recentInstallations,
  };
};
