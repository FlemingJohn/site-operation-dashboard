import { MESSAGES } from '../constants.js';
import { HttpError } from './HttpError.js';

const UNIQUE_VIOLATION = '23505';
const FOREIGN_KEY_VIOLATION = '23503';
const CHECK_VIOLATION = '23514';
const QUERY_CANCELED = '57014';
const RETRY_CODES = new Set(['40001', '40P01']);
const UNAVAILABLE_CODES = new Set([
  'ECONNREFUSED',
  'ECONNRESET',
  'ENOTFOUND',
  'ETIMEDOUT',
  '57P01',
  '57P03',
  '53300',
]);
const POOL_TIMEOUT_TEXT = 'timeout exceeded when trying to connect';

const UNIQUE_FIELDS = {
  sites_name_key: { field: 'name', message: MESSAGES.duplicateSite },
  users_email_key: { field: 'email', message: MESSAGES.duplicateEmail },
  equipment_serial_key: { field: 'serial', message: MESSAGES.duplicateSerial },
  spare_parts_name_key: { field: 'name', message: MESSAGES.duplicatePart },
};

const MISSING_REFERENCES = {
  part_requests_part_id_fkey: MESSAGES.partNotFound,
  part_requests_equipment_id_fkey: MESSAGES.equipmentNotFound,
  part_requests_requested_by_fkey: MESSAGES.missingPerson,
  service_records_equipment_id_fkey: MESSAGES.equipmentNotFound,
  service_records_technician_id_fkey: MESSAGES.missingPerson,
};

const RESTRICTED_DELETES = {
  service_records_equipment_id_fkey: MESSAGES.machineHasHistory,
  part_requests_part_id_fkey: MESSAGES.partHasRequests,
};

const CHECK_MESSAGES = {
  spare_parts_stock_check: MESSAGES.stockBelowZero,
};

const isRestrictedDelete = (error) => error.detail?.includes('is still referenced');

const isUnavailable = (error) =>
  UNAVAILABLE_CODES.has(error.code) || error.message?.includes(POOL_TIMEOUT_TEXT);

const toForeignKeyError = (error) => {
  if (isRestrictedDelete(error)) {
    return new HttpError(409, RESTRICTED_DELETES[error.constraint] ?? MESSAGES.unexpected);
  }
  return new HttpError(400, MISSING_REFERENCES[error.constraint] ?? MESSAGES.missingReference);
};

export const toDatabaseError = (error) => {
  const duplicate = error.code === UNIQUE_VIOLATION && UNIQUE_FIELDS[error.constraint];
  if (duplicate) {
    return new HttpError(409, duplicate.message, { [duplicate.field]: duplicate.message });
  }
  if (error.code === FOREIGN_KEY_VIOLATION) return toForeignKeyError(error);
  if (error.code === CHECK_VIOLATION) {
    return new HttpError(400, CHECK_MESSAGES[error.constraint] ?? MESSAGES.valueOutOfRange);
  }
  if (error.code === QUERY_CANCELED) return new HttpError(503, MESSAGES.tookTooLong);
  if (RETRY_CODES.has(error.code)) return new HttpError(503, MESSAGES.busy);
  if (isUnavailable(error)) return new HttpError(503, MESSAGES.unavailable);
  return null;
};
