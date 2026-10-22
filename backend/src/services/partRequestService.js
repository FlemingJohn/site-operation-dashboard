import { pool } from '../config/database.js';
import { MESSAGES, PREVIOUS_REQUEST_STATUS, STATUS_LABELS } from '../constants.js';
import { HttpError } from '../utils/HttpError.js';
import { buildPagination, getOffset } from '../utils/pagination.js';
import { buildWhereClause, toLikePattern } from '../utils/sql.js';
import { withTransaction } from '../utils/withTransaction.js';
import * as activityService from './activityService.js';

const REQUEST_FROM = `
  FROM part_requests pr
  INNER JOIN spare_parts p ON p.id = pr.part_id
  LEFT JOIN equipment e ON e.id = pr.equipment_id
  LEFT JOIN sites s ON s.id = e.site_id
  LEFT JOIN users u ON u.id = pr.requested_by
`;

const REQUEST_SELECT = `
  SELECT
    pr.id,
    pr.part_id AS "partId",
    p.name AS "partName",
    pr.equipment_id AS "equipmentId",
    e.serial,
    s.name AS "siteName",
    pr.quantity,
    pr.status,
    pr.requested_on AS "requestedOn",
    u.full_name AS "requestedBy"
  ${REQUEST_FROM}
`;

const NEWEST_FIRST = 'ORDER BY pr.requested_on DESC, pr.id DESC';

const buildFilters = ({ search, status }) =>
  buildWhereClause([
    {
      value: search && toLikePattern(search),
      clause: (param) =>
        `(p.name ILIKE ${param} OR e.serial ILIKE ${param} OR s.name ILIKE ${param})`,
    },
    { value: status, clause: (param) => `pr.status = ${param}` },
  ]);

export const findAll = async (query) => {
  const { where, values } = buildFilters(query);
  const limitParam = `$${values.length + 1}`;
  const offsetParam = `$${values.length + 2}`;

  const [rowsResult, countResult] = await Promise.all([
    pool.query(
      `${REQUEST_SELECT} ${where} ${NEWEST_FIRST} LIMIT ${limitParam} OFFSET ${offsetParam}`,
      [...values, query.limit, getOffset(query)]
    ),
    pool.query(`SELECT COUNT(*)::int AS total ${REQUEST_FROM} ${where}`, values),
  ]);

  return {
    data: rowsResult.rows,
    pagination: buildPagination(query, countResult.rows[0].total),
  };
};

export const findForEquipment = async (equipmentId) => {
  const { rows } = await pool.query(
    `${REQUEST_SELECT} WHERE pr.equipment_id = $1 ${NEWEST_FIRST}`,
    [equipmentId]
  );
  return rows;
};

export const findById = async (id, executor = pool) => {
  const { rows } = await executor.query(`${REQUEST_SELECT} WHERE pr.id = $1`, [id]);
  if (!rows[0]) throw new HttpError(404, MESSAGES.partRequestNotFound);
  return rows[0];
};

const describeRequestFor = (request) =>
  request.serial ? `for ${request.serial}` : 'for the store';

const recordRequestEvent = (client, request, verb, after) =>
  activityService.record(client, {
    kind: 'part',
    actorName: request.requestedBy,
    verb,
    target: { label: `${request.quantity} × ${request.partName}`, path: '/spare-parts' },
    after: after ?? describeRequestFor(request),
    change: [request.status],
  });

export const create = ({ partId, equipmentId, requestedBy, quantity }) =>
  withTransaction(async (client) => {
    const { rows } = await client.query(
      `INSERT INTO part_requests (part_id, equipment_id, requested_by, quantity)
       VALUES ($1, $2, $3, $4)
       RETURNING id`,
      [partId, equipmentId, requestedBy, quantity]
    );
    const request = await findById(rows[0].id, client);
    await recordRequestEvent(client, request, 'asked for');
    return request;
  });

const addDeliveredStock = (client, request) =>
  client.query('UPDATE spare_parts SET stock = LEAST(stock + $1, capacity) WHERE id = $2', [
    request.quantity,
    request.partId,
  ]);

export const updateStatus = (id, { status }) =>
  withTransaction(async (client) => {
    const current = await findById(id, client);
    if (current.status === status) return current;

    const { rowCount } = await client.query(
      'UPDATE part_requests SET status = $1 WHERE id = $2 AND status = $3',
      [status, id, PREVIOUS_REQUEST_STATUS[status]]
    );
    if (rowCount === 0) throw new HttpError(409, MESSAGES.requestAlreadyMoved);

    const moved = await findById(id, client);
    if (status === 'delivered') await addDeliveredStock(client, moved);
    await recordRequestEvent(client, moved, 'marked', `as ${STATUS_LABELS[status].toLowerCase()}`);
    return moved;
  });
