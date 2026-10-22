import { pool } from '../config/database.js';
import { STOCK_LEVELS } from '../constants.js';
import { countEach } from '../utils/countEach.js';
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
    ${STOCK_LEVEL} AS "stockLevel"
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

export const countAll = async (query) => {
  const { where, values } = buildFilters({ ...query, stockLevel: undefined });
  const { rows } = await pool.query(
    `SELECT COUNT(*)::int AS "all", ${countEach(STOCK_LEVEL, STOCK_LEVELS)} FROM spare_parts p ${where}`,
    values
  );
  return rows[0];
};
