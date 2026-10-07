import { pool } from '../config/database.js';
import { RECENT_INSTALLATIONS_LIMIT } from '../constants.js';
import { findRecent } from './installationService.js';

const TOTALS_QUERY = `
  SELECT
    (SELECT COUNT(*)::int FROM sites) AS "sites",
    (SELECT COUNT(*)::int FROM sites WHERE status = 'active') AS "activeSites",
    COUNT(*)::int AS "installations",
    COUNT(*) FILTER (WHERE status = 'completed')::int AS "completedInstallations",
    COUNT(*) FILTER (WHERE status = 'in_progress')::int AS "inProgressInstallations",
    COUNT(*) FILTER (WHERE status = 'pending')::int AS "pendingInstallations"
  FROM installations
`;

const STATUS_BREAKDOWN_QUERY = `
  SELECT status, COUNT(*)::int AS count
  FROM installations
  GROUP BY status
  ORDER BY count DESC
`;

const MONTHLY_INSTALLATIONS_QUERY = `
  SELECT
    TO_CHAR(m.month, 'YYYY-MM') AS month,
    TO_CHAR(m.month, 'Mon') AS label,
    COUNT(i.id)::int AS count
  FROM generate_series(
    DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '5 months',
    DATE_TRUNC('month', CURRENT_DATE),
    INTERVAL '1 month'
  ) AS m(month)
  LEFT JOIN installations i ON DATE_TRUNC('month', i.installed_on) = m.month
  GROUP BY m.month
  ORDER BY m.month
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
