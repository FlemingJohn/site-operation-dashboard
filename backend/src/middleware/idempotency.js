import { z } from 'zod';
import { MESSAGES } from '../constants.js';
import * as idempotencyService from '../services/idempotencyService.js';
import { HttpError } from '../utils/HttpError.js';

const keySchema = z.uuid();

const replayStoredResponse = (res, record) => {
  res.set('Idempotent-Replayed', 'true');
  res.status(record.statusCode).json(record.body);
};

const persistOnClose = (req, res, key) => {
  let responseBody;
  const sendJson = res.json.bind(res);

  res.json = (body) => {
    responseBody = body;
    return sendJson(body);
  };

  res.once('close', () => {
    const succeeded = responseBody !== undefined && res.statusCode < 400;
    const task = succeeded
      ? idempotencyService.complete(key, res.statusCode, responseBody)
      : idempotencyService.release(key);

    task.catch((error) => req.log.error({ err: error }, 'Failed to update idempotency key'));
  });
};

export const idempotency = async (req, res, next) => {
  const key = req.get('Idempotency-Key');
  if (!key) return next();

  if (!keySchema.safeParse(key).success) {
    throw new HttpError(400, MESSAGES.invalidIdempotencyKey);
  }

  const requestHash = idempotencyService.hashRequest({
    method: req.method,
    path: req.originalUrl,
    body: req.validated.body,
  });
  const record = await idempotencyService.reserve(key, requestHash);

  if (record.state === 'mismatch') throw new HttpError(422, MESSAGES.requestMismatch);
  if (record.state === 'in_progress') throw new HttpError(409, MESSAGES.requestInProgress);
  if (record.state === 'completed') return replayStoredResponse(res, record);

  persistOnClose(req, res, key);
  return next();
};
