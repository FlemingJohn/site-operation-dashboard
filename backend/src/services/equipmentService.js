import { pool } from '../config/database.js';
import { EQUIPMENT_SORT_COLUMNS, MESSAGES, SERVICE_SOON_DAYS } from '../constants.js';
import { HttpError } from '../utils/HttpError.js';
import { buildPagination, getOffset } from '../utils/pagination.js';
import { buildOrderBy, buildWhereClause, toLikePattern } from '../utils/sql.js';
import * as partRequestService from './partRequestService.js';

const SERVICE_STATE = `
  CASE
    WHEN e.next_service_on < CURRENT_DATE THEN 'late'
    WHEN e.next_service_on <= CURRENT_DATE + ${SERVICE_SOON_DAYS} THEN 'this_week'
    ELSE 'later'
  END
`;

const EQUIPMENT_FROM = `
  FROM equipment e
  LEFT JOIN sites s ON s.id = e.site_id
`;

const EQUIPMENT_SELECT = `
  SELECT
    e.id,
    e.serial,
    e.type,
    e.status,
    e.site_id AS "siteId",
    s.name AS "siteName",
    e.next_service_on AS "nextServiceOn",
    latest.done_on AS "lastServiceOn",
    latest.technician_name AS "lastServiceBy",
    ${SERVICE_STATE} AS "serviceState"
  ${EQUIPMENT_FROM}
  LEFT JOIN LATERAL (
    SELECT r.done_on, u.full_name AS technician_name
    FROM service_records r
    LEFT JOIN users u ON u.id = r.technician_id
    WHERE r.equipment_id = e.id
    ORDER BY r.done_on DESC, r.id DESC
    LIMIT 1
  ) latest ON TRUE
`;

const SERVICE_RECORDS_SELECT = `
  SELECT r.id, r.done_on AS "doneOn", u.full_name AS "doneBy", r.notes
  FROM service_records r
  LEFT JOIN users u ON u.id = r.technician_id
  WHERE r.equipment_id = $1
  ORDER BY r.done_on DESC, r.id DESC
`;

const buildFilters = ({ search, type, status, siteId, state }) =>
  buildWhereClause([
    {
      value: search && toLikePattern(search),
      clause: (param) => `(e.serial ILIKE ${param} OR s.name ILIKE ${param})`,
    },
    { value: type, clause: (param) => `e.type = ${param}` },
    { value: status, clause: (param) => `e.status = ${param}` },
    { value: siteId, clause: (param) => `e.site_id = ${param}` },
    { value: state, clause: (param) => `${SERVICE_STATE} = ${param}` },
  ]);

export const findAll = async (query) => {
  const { where, values } = buildFilters(query);
  const limitParam = `$${values.length + 1}`;
  const offsetParam = `$${values.length + 2}`;
  const orderBy = buildOrderBy(EQUIPMENT_SORT_COLUMNS, query, 'e.id');

  const [rowsResult, countResult] = await Promise.all([
    pool.query(
      `${EQUIPMENT_SELECT} ${where} ${orderBy} LIMIT ${limitParam} OFFSET ${offsetParam}`,
      [...values, query.limit, getOffset(query)]
    ),
    pool.query(`SELECT COUNT(*)::int AS total ${EQUIPMENT_FROM} ${where}`, values),
  ]);

  return {
    data: rowsResult.rows,
    pagination: buildPagination(query, countResult.rows[0].total),
  };
};

export const findSummary = async (id, executor = pool) => {
  const { rows } = await executor.query(`${EQUIPMENT_SELECT} WHERE e.id = $1`, [id]);
  if (!rows[0]) throw new HttpError(404, MESSAGES.equipmentNotFound);
  return rows[0];
};

export const findById = async (id) => {
  const [unit, serviceRecords, partRequests] = await Promise.all([
    findSummary(id),
    pool.query(SERVICE_RECORDS_SELECT, [id]).then((result) => result.rows),
    partRequestService.findForEquipment(id),
  ]);
  return { ...unit, serviceRecords, partRequests };
};
