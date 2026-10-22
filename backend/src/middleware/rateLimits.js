import { rateLimit } from 'express-rate-limit';
import { MESSAGES } from '../constants.js';
import { HttpError } from '../utils/HttpError.js';
import { isServiceRequest } from '../utils/isServiceRequest.js';

const ONE_MINUTE_MS = 60000;
const REQUESTS_PER_MINUTE = 300;
const WRITES_PER_MINUTE = 30;
const QUESTIONS_PER_MINUTE = 8;
const WRITE_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

const rejectTooMany = (req, res, next) => next(new HttpError(429, MESSAGES.tooManyRequests));

export const requestLimit = rateLimit({
  windowMs: ONE_MINUTE_MS,
  limit: REQUESTS_PER_MINUTE,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  skip: isServiceRequest,
  handler: rejectTooMany,
});

export const writeLimit = rateLimit({
  windowMs: ONE_MINUTE_MS,
  limit: WRITES_PER_MINUTE,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  skip: (req) => !WRITE_METHODS.has(req.method),
  handler: rejectTooMany,
});

export const assistantLimit = rateLimit({
  windowMs: ONE_MINUTE_MS,
  limit: QUESTIONS_PER_MINUTE,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  handler: rejectTooMany,
});
