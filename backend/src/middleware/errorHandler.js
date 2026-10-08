import { MESSAGES } from '../constants.js';
import { HttpError } from '../utils/HttpError.js';

const UNIQUE_VIOLATION = '23505';
const FOREIGN_KEY_VIOLATION = '23503';
const UNAVAILABLE_CODES = new Set(['ECONNREFUSED', 'ENOTFOUND', 'ETIMEDOUT', '57P01', '57P03', '53300']);

const UNIQUE_FIELDS = {
  sites_name_key: { field: 'name', message: MESSAGES.duplicateSite },
  users_email_key: { field: 'email', message: MESSAGES.duplicateEmail },
};

const toHttpError = (error) => {
  if (error instanceof HttpError) return error;

  const duplicate = error.code === UNIQUE_VIOLATION && UNIQUE_FIELDS[error.constraint];
  if (duplicate) {
    return new HttpError(409, duplicate.message, { [duplicate.field]: duplicate.message });
  }
  if (error.code === FOREIGN_KEY_VIOLATION) return new HttpError(400, MESSAGES.missingReference);
  if (error.type === 'entity.parse.failed') return new HttpError(400, MESSAGES.invalidJson);
  if (UNAVAILABLE_CODES.has(error.code)) return new HttpError(503, MESSAGES.unavailable);

  return new HttpError(500, MESSAGES.unexpected);
};

export const errorHandler = (error, req, res, next) => {
  const httpError = toHttpError(error);

  if (httpError.status >= 500) res.err = error;
  if (httpError.errors) res.locals.fieldErrors = httpError.errors;
  if (res.headersSent) return next(error);

  return res.status(httpError.status).json({
    message: httpError.message,
    ...(httpError.errors && { errors: httpError.errors }),
  });
};
