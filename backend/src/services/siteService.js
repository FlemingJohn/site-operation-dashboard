import { pool } from '../config/database.js';
import { MESSAGES, SITE_SORT_COLUMNS, SITE_STATUSES } from '../constants.js';
import { HttpError } from '../utils/HttpError.js';
import { countEach } from '../utils/countEach.js';
import { buildPagination, getOffset } from '../utils/pagination.js';
import { buildOrderBy, buildWhereClause, toLikePattern } from '../utils/sql.js';
import { withTransaction } from '../utils/withTransaction.js';
import * as siteActivity from './siteActivity.js';
import * as siteEquipment from './siteEquipment.js';

const SITE_SELECT = `
  SELECT
    s.id,
    s.name,
    s.city,
    s.region,
    s.status,
    COUNT(i.id)::int AS "installationCount",
    (SELECT COUNT(*)::int FROM equipment e WHERE e.site_id = s.id) AS "machineCount",
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
  const orderBy = buildOrderBy(SITE_SORT_COLUMNS, query, 's.id');

  const [rowsResult, countResult] = await Promise.all([
    pool.query(
      `${SITE_SELECT} ${where} GROUP BY s.id ${orderBy} LIMIT ${limitParam} OFFSET ${offsetParam}`,
      [...values, query.limit, getOffset(query)]
    ),
    pool.query(`SELECT COUNT(*)::int AS total FROM sites s ${where}`, values),
  ]);

  return {
    data: rowsResult.rows,
    pagination: buildPagination(query, countResult.rows[0].total),
  };
};

export const findById = async (id, executor = pool) => {
  const { rows } = await executor.query(`${SITE_SELECT} WHERE s.id = $1 GROUP BY s.id`, [id]);
  if (!rows[0]) throw new HttpError(404, MESSAGES.siteNotFound);
  return rows[0];
};

export const create = ({ name, city, region, status }) =>
  withTransaction(async (client) => {
    const { rows } = await client.query(
      `INSERT INTO sites (name, city, region, status)
       VALUES ($1, $2, $3, $4)
       RETURNING id`,
      [name, city, region, status]
    );
    const site = await findById(rows[0].id, client);
    await siteActivity.recordAdded(client, site);
    return site;
  });

export const update = (id, { name, city, region, status }) =>
  withTransaction(async (client) => {
    const before = await findById(id, client);
    await client.query(
      `UPDATE sites
       SET name = $1, city = $2, region = $3, status = $4
       WHERE id = $5`,
      [name, city, region, status, id]
    );
    const after = await findById(id, client);
    await siteActivity.recordChanged(client, before, after);
    return after;
  });

export const remove = (id) =>
  withTransaction(async (client) => {
    const site = await findById(id, client);
    await siteEquipment.moveToStock(client, id);
    await siteActivity.unlinkSitePage(client, site);
    await client.query('DELETE FROM sites WHERE id = $1', [id]);
    await siteActivity.recordDeleted(client, site);
  });

export const countAll = async (query) => {
  const { where, values } = buildFilters({ ...query, status: undefined });
  const { rows } = await pool.query(
    `SELECT COUNT(*)::int AS "all", ${countEach('s.status', SITE_STATUSES)} FROM sites s ${where}`,
    values
  );
  return rows[0];
};
