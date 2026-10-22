import { MESSAGES } from '../constants.js';
import { HttpError } from '../utils/HttpError.js';

const METHODS_WITH_BODY = new Set(['POST', 'PUT', 'PATCH']);

export const requireJson = (req, res, next) => {
  if (METHODS_WITH_BODY.has(req.method) && !req.is('application/json')) {
    throw new HttpError(415, MESSAGES.notJson);
  }
  next();
};
