import { pool } from '../config/database.js';
import { MESSAGES } from '../constants.js';
import { HttpError } from '../utils/HttpError.js';
import { buildPagination, getOffset } from '../utils/pagination.js';
import { buildWhereClause, toLikePattern } from '../utils/sql.js';

const SITE_SELECT = `
  SELECT
    s.id,
    s.name,
    s.city,
    s.region,
    s.status,
    COUNT(i.id)::int AS "installationCount",
    s.created_at AS "createdAt",
    s.updated_at AS "updatedAt"
  FROM sites s
  LEFT JOIN installations i ON i.site_id = s.id
`;

const buildFilters = ({ search, status, region }) =>
  buildWhereClause([
    {
      value: search && toLikePattern(search),
      clause: (param) => `(s.name ILIKE ${param} OR s.city ILIKE ${param})`,
    },
    { value: status, clause: (param) => `s.status = ${param}` },
    { value: region, clause: (param) => `s.region = ${param}` },
  ]);

export const findAll = async (query) => {
  const { where, values } = buildFilters(query);
  const limitParam = `$${values.length + 1}`;
  const offsetParam = `$${values.length + 2}`;

  const [rowsResult, countResult] = await Promise.all([
    pool.query(
      `${SITE_SELECT} ${where} GROUP BY s.id ORDER BY s.name LIMIT ${limitParam} OFFSET ${offsetParam}`,
      [...values, query.limit, getOffset(query)]
    ),
    pool.query(`SELECT COUNT(*)::int AS total FROM sites s ${where}`, values),
  ]);

  return {
    data: rowsResult.rows,
    pagination: buildPagination(query, countResult.rows[0].total),
  };
};

export const findById = async (id) => {
  const { rows } = await pool.query(`${SITE_SELECT} WHERE s.id = $1 GROUP BY s.id`, [id]);
  if (!rows[0]) throw new HttpError(404, MESSAGES.siteNotFound);
  return rows[0];
};

export const create = async ({ name, city, region, status }) => {
  const { rows } = await pool.query(
    `INSERT INTO sites (name, city, region, status)
     VALUES ($1, $2, $3, $4)
     RETURNING id`,
    [name, city, region, status]
  );
  return findById(rows[0].id);
};

export const update = async (id, { name, city, region, status }) => {
  const { rowCount } = await pool.query(
    `UPDATE sites
     SET name = $1, city = $2, region = $3, status = $4
     WHERE id = $5`,
    [name, city, region, status, id]
  );
  if (rowCount === 0) throw new HttpError(404, MESSAGES.siteNotFound);
  return findById(id);
};

export const remove = async (id) => {
  const { rowCount } = await pool.query('DELETE FROM sites WHERE id = $1', [id]);
  if (rowCount === 0) throw new HttpError(404, MESSAGES.siteNotFound);
};
