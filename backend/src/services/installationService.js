import { pool } from '../config/database.js';
import { INSTALLATION_SORT_COLUMNS, MESSAGES } from '../constants.js';
import { HttpError } from '../utils/HttpError.js';
import { buildPagination, getOffset } from '../utils/pagination.js';
import { buildOrderBy, buildWhereClause, toLikePattern } from '../utils/sql.js';

const INSTALLATION_FROM = `
  FROM installations i
  INNER JOIN sites s ON s.id = i.site_id
  LEFT JOIN users u ON u.id = i.technician_id
`;

const INSTALLATION_SELECT = `
  SELECT
    i.id,
    i.equipment,
    i.status,
    i.installed_on AS "installedOn",
    i.site_id AS "siteId",
    s.name AS "siteName",
    i.technician_id AS "technicianId",
    u.full_name AS "technicianName",
    i.created_at AS "createdAt",
    i.updated_at AS "updatedAt"
  ${INSTALLATION_FROM}
`;

const NEWEST_FIRST = 'ORDER BY i.installed_on DESC, i.id DESC';

const buildFilters = ({ search, siteId, status }) =>
  buildWhereClause([
    {
      value: search && toLikePattern(search),
      clause: (param) => `(i.equipment ILIKE ${param} OR u.full_name ILIKE ${param})`,
    },
    { value: siteId, clause: (param) => `i.site_id = ${param}` },
    { value: status, clause: (param) => `i.status = ${param}` },
  ]);

export const findAll = async (query) => {
  const { where, values } = buildFilters(query);
  const limitParam = `$${values.length + 1}`;
  const offsetParam = `$${values.length + 2}`;
  const orderBy = buildOrderBy(INSTALLATION_SORT_COLUMNS, query, 'i.id');

  const [rowsResult, countResult] = await Promise.all([
    pool.query(
      `${INSTALLATION_SELECT} ${where} ${orderBy} LIMIT ${limitParam} OFFSET ${offsetParam}`,
      [...values, query.limit, getOffset(query)]
    ),
    pool.query(`SELECT COUNT(*)::int AS total ${INSTALLATION_FROM} ${where}`, values),
  ]);

  return {
    data: rowsResult.rows,
    pagination: buildPagination(query, countResult.rows[0].total),
  };
};

export const findRecent = async (limit) => {
  const { rows } = await pool.query(`${INSTALLATION_SELECT} ${NEWEST_FIRST} LIMIT $1`, [limit]);
  return rows;
};

export const findById = async (id) => {
  const { rows } = await pool.query(`${INSTALLATION_SELECT} WHERE i.id = $1`, [id]);
  if (!rows[0]) throw new HttpError(404, MESSAGES.installationNotFound);
  return rows[0];
};

export const create = async ({ equipment, siteId, technicianId, installedOn, status }) => {
  const { rows } = await pool.query(
    `INSERT INTO installations (equipment, site_id, technician_id, installed_on, status)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id`,
    [equipment, siteId, technicianId, installedOn, status]
  );
  return findById(rows[0].id);
};

export const update = async (id, { equipment, siteId, technicianId, installedOn, status }) => {
  const { rowCount } = await pool.query(
    `UPDATE installations
     SET equipment = $1, site_id = $2, technician_id = $3, installed_on = $4, status = $5
     WHERE id = $6`,
    [equipment, siteId, technicianId, installedOn, status, id]
  );
  if (rowCount === 0) throw new HttpError(404, MESSAGES.installationNotFound);
  return findById(id);
};

export const remove = async (id) => {
  const { rowCount } = await pool.query('DELETE FROM installations WHERE id = $1', [id]);
  if (rowCount === 0) throw new HttpError(404, MESSAGES.installationNotFound);
};
