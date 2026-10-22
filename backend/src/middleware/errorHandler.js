import { MESSAGES } from '../constants.js';
import { HttpError } from '../utils/HttpError.js';
import { toDatabaseError } from '../utils/toDatabaseError.js';

const CLIENT_ERROR_MESSAGES = {
  413: MESSAGES.requestTooLarge,
  415: MESSAGES.notJson,
};

const isClientError = (error) => error.status >= 400 && error.status < 500;

const toHttpError = (error) => {
  if (error instanceof HttpError) return error;
  if (error.type === 'entity.parse.failed') return new HttpError(400, MESSAGES.invalidJson);
  if (isClientError(error)) {
    return new HttpError(error.status, CLIENT_ERROR_MESSAGES[error.status] ?? MESSAGES.badRequest);
  }
  return toDatabaseError(error) ?? new HttpError(500, MESSAGES.unexpected);
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
