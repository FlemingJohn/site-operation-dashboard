import { pool } from '../config/database.js';
import { buildPagination, getOffset } from '../utils/pagination.js';
import { buildWhereClause, toLikePattern } from '../utils/sql.js';

const ACTIVITY_SELECT = `
  SELECT
    a.id::int AS id,
    a.kind,
    a.occurred_at AS "occurredAt",
    a.actor_name AS "actorName",
    a.verb,
    json_build_object('label', a.target_label, 'path', a.target_path) AS target,
    a.after_text AS "after",
    a.change,
    a.note
  FROM activity_log a
`;

const buildFilters = ({ search, kind, actor, days, path }) =>
  buildWhereClause([
    {
      value: search && toLikePattern(search),
      clause: (param) =>
        `(a.actor_name ILIKE ${param} OR a.target_label ILIKE ${param} OR a.after_text ILIKE ${param} OR a.note ILIKE ${param})`,
    },
    { value: kind, clause: (param) => `a.kind = ${param}` },
    { value: actor, clause: (param) => `a.actor_name = ${param}` },
    { value: days, clause: (param) => `a.occurred_at >= NOW() - ${param}::int * INTERVAL '1 day'` },
    { value: path, clause: (param) => `a.target_path = ${param}` },
  ]);

export const findAll = async (query) => {
  const { where, values } = buildFilters(query);
  const limitParam = `$${values.length + 1}`;
  const offsetParam = `$${values.length + 2}`;

  const [rowsResult, countResult] = await Promise.all([
    pool.query(
      `${ACTIVITY_SELECT} ${where} ORDER BY a.occurred_at DESC, a.id DESC LIMIT ${limitParam} OFFSET ${offsetParam}`,
      [...values, query.limit, getOffset(query)]
    ),
    pool.query(`SELECT COUNT(*)::int AS total FROM activity_log a ${where}`, values),
  ]);

  return {
    data: rowsResult.rows,
    pagination: buildPagination(query, countResult.rows[0].total),
  };
};

export const findPeople = async () => {
  const { rows } = await pool.query(
    `SELECT DISTINCT actor_name AS name
     FROM activity_log
     WHERE actor_name IS NOT NULL
     ORDER BY actor_name`
  );
  return rows.map((row) => row.name);
};

export const record = (client, { kind, actorName, verb, target, after, change, note }) =>
  client.query(
    `INSERT INTO activity_log (kind, actor_name, verb, target_label, target_path, after_text, change, note)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
    [
      kind,
      actorName ?? null,
      verb,
      target.label,
      target.path,
      after ?? null,
      change ? JSON.stringify(change) : null,
      note ?? null,
    ]
  );
