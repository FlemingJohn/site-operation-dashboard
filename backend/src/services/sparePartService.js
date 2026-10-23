import { pool } from '../config/database.js';
import { MESSAGES, STOCK_LEVELS } from '../constants.js';
import { countEach } from '../utils/countEach.js';
import { HttpError } from '../utils/HttpError.js';
import { withTransaction } from '../utils/withTransaction.js';
import * as sparePartActivity from './sparePartActivity.js';
import { buildPagination, getOffset } from '../utils/pagination.js';
import { buildWhereClause, toLikePattern } from '../utils/sql.js';

const STOCK_LEVEL = `
  CASE
    WHEN p.stock = 0 THEN 'out'
    WHEN p.stock <= p.reorder_at THEN 'low'
    ELSE 'stocked'
  END
`;

const PART_SELECT = `
  SELECT
    p.id,
    p.name,
    p.stock,
    p.reorder_at AS "reorderAt",
    p.capacity,
    ${STOCK_LEVEL} AS "stockLevel",
    (SELECT COUNT(*)::int FROM part_requests r WHERE r.part_id = p.id) AS "requestCount"
  FROM spare_parts p
`;

const LOWEST_STOCK_FIRST = 'ORDER BY p.stock::numeric / GREATEST(p.reorder_at, 1), p.id';

const buildFilters = ({ search, stockLevel }) =>
  buildWhereClause([
    { value: search && toLikePattern(search), clause: (param) => `p.name ILIKE ${param}` },
    { value: stockLevel, clause: (param) => `${STOCK_LEVEL} = ${param}` },
  ]);

export const findAll = async (query) => {
  const { where, values } = buildFilters(query);
  const limitParam = `$${values.length + 1}`;
  const offsetParam = `$${values.length + 2}`;

  const [rowsResult, countResult] = await Promise.all([
    pool.query(
      `${PART_SELECT} ${where} ${LOWEST_STOCK_FIRST} LIMIT ${limitParam} OFFSET ${offsetParam}`,
      [...values, query.limit, getOffset(query)]
    ),
    pool.query(`SELECT COUNT(*)::int AS total FROM spare_parts p ${where}`, values),
  ]);

  return {
    data: rowsResult.rows,
    pagination: buildPagination(query, countResult.rows[0].total),
  };
};

export const findById = async (id, executor = pool) => {
  const { rows } = await executor.query(`${PART_SELECT} WHERE p.id = $1`, [id]);
  if (!rows[0]) throw new HttpError(404, MESSAGES.partNotFound);
  return rows[0];
};

export const create = ({ name, stock, reorderAt, capacity }) =>
  withTransaction(async (client) => {
    const { rows } = await client.query(
      `INSERT INTO spare_parts (name, stock, reorder_at, capacity)
       VALUES ($1, $2, $3, $4)
       RETURNING id`,
      [name, stock, reorderAt, capacity]
    );
    const part = await findById(rows[0].id, client);
    await sparePartActivity.recordAdded(client, part);
    return part;
  });

export const update = (id, { name, stock, reorderAt, capacity }) =>
  withTransaction(async (client) => {
    await findById(id, client);
    await client.query(
      `UPDATE spare_parts
       SET name = $1, stock = $2, reorder_at = $3, capacity = $4
       WHERE id = $5`,
      [name, stock, reorderAt, capacity, id]
    );
    const part = await findById(id, client);
    await sparePartActivity.recordChanged(client, part);
    return part;
  });

export const setStock = (id, { stock, reason }) =>
  withTransaction(async (client) => {
    await client.query('SELECT id FROM spare_parts WHERE id = $1 FOR UPDATE', [id]);
    const before = await findById(id, client);
    if (stock > before.capacity) {
      throw new HttpError(400, MESSAGES.stockOverCapacity, { stock: MESSAGES.stockOverCapacity });
    }
    await client.query('UPDATE spare_parts SET stock = $1 WHERE id = $2', [stock, id]);
    const after = await findById(id, client);
    await sparePartActivity.recordStockSet(client, before, after, reason);
    return after;
  });

export const remove = (id) =>
  withTransaction(async (client) => {
    const part = await findById(id, client);
    if (part.requestCount > 0) throw new HttpError(409, MESSAGES.partHasRequests);
    await client.query('DELETE FROM spare_parts WHERE id = $1', [id]);
    await sparePartActivity.recordDeleted(client, part);
  });

export const countAll = async (query) => {
  const { where, values } = buildFilters({ ...query, stockLevel: undefined });
  const { rows } = await pool.query(
    `SELECT COUNT(*)::int AS "all", ${countEach(STOCK_LEVEL, STOCK_LEVELS)} FROM spare_parts p ${where}`,
    values
  );
  return rows[0];
};
