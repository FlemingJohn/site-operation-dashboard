import { pool } from '../config/database.js';
import { USER_ROLES, USER_SORT_COLUMNS } from '../constants.js';
import { countEach } from '../utils/countEach.js';
import { buildPagination, getOffset } from '../utils/pagination.js';
import { buildOrderBy, buildWhereClause, toLikePattern } from '../utils/sql.js';
import { withTransaction } from '../utils/withTransaction.js';
import * as activityService from './activityService.js';

const USER_SELECT = `
  SELECT
    u.id,
    u.full_name AS "fullName",
    u.email,
    u.phone,
    u.role,
    u.created_at AS "createdAt"
  FROM users u
`;

const buildFilters = ({ search, role }) =>
  buildWhereClause([
    {
      value: search && toLikePattern(search),
      clause: (param) => `(u.full_name ILIKE ${param} OR u.email ILIKE ${param})`,
    },
    { value: role, clause: (param) => `u.role = ${param}` },
  ]);

export const findAll = async (query) => {
  const { where, values } = buildFilters(query);
  const limitParam = `$${values.length + 1}`;
  const offsetParam = `$${values.length + 2}`;
  const orderBy = buildOrderBy(USER_SORT_COLUMNS, query, 'u.id');

  const [rowsResult, countResult] = await Promise.all([
    pool.query(`${USER_SELECT} ${where} ${orderBy} LIMIT ${limitParam} OFFSET ${offsetParam}`, [
      ...values,
      query.limit,
      getOffset(query),
    ]),
    pool.query(`SELECT COUNT(*)::int AS total FROM users u ${where}`, values),
  ]);

  return {
    data: rowsResult.rows,
    pagination: buildPagination(query, countResult.rows[0].total),
  };
};

export const create = ({ fullName, email, phone, role }) =>
  withTransaction(async (client) => {
    const { rows } = await client.query(
      `INSERT INTO users (full_name, email, phone, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, full_name AS "fullName", email, phone, role, created_at AS "createdAt"`,
      [fullName, email, phone, role]
    );
    await activityService.record(client, {
      kind: 'user',
      verb: 'added',
      target: { label: rows[0].fullName, path: '/users' },
      after: role === 'admin' ? 'as an admin' : 'as a technician',
    });
    return rows[0];
  });

export const countAll = async (query) => {
  const { where, values } = buildFilters({ ...query, role: undefined });
  const { rows } = await pool.query(
    `SELECT COUNT(*)::int AS "all", ${countEach('u.role', USER_ROLES)} FROM users u ${where}`,
    values
  );
  return rows[0];
};
