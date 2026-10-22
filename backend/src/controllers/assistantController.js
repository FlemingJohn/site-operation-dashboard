import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { env } from '../config/env.js';
import { MESSAGES } from '../constants.js';
import { HttpError } from '../utils/HttpError.js';
import { SERVICE_KEY_HEADER } from '../utils/isServiceRequest.js';

const ANSWER_TIMEOUT_MS = 75000;

export const ask = async (req, res) => {
  if (!env.AI_SERVICE_URL) throw new HttpError(503, MESSAGES.assistantOff);

  const disconnected = new AbortController();
  res.on('close', () => disconnected.abort());
  const answer = await requestAnswer(req, disconnected.signal);

  res.status(200).set({
    'Content-Type': 'application/x-ndjson; charset=utf-8',
    'Cache-Control': 'no-cache',
    'X-Accel-Buffering': 'no',
  });
  res.flushHeaders();

  try {
    await pipeline(Readable.fromWeb(answer.body), res);
  } catch (error) {
    if (!disconnected.signal.aborted) req.log.error({ err: error }, 'Assistant stream broke');
  }
};

const requestAnswer = async (req, disconnected) => {
  let response;
  try {
    response = await fetch(`${env.AI_SERVICE_URL}/ask`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', [SERVICE_KEY_HEADER]: env.AI_SERVICE_KEY },
      body: JSON.stringify(req.validated.body),
      signal: AbortSignal.any([disconnected, AbortSignal.timeout(ANSWER_TIMEOUT_MS)]),
    });
  } catch (error) {
    req.log.error({ err: error }, 'AI service unreachable');
    throw new HttpError(503, MESSAGES.assistantUnreachable);
  }
  if (!response.ok) {
    req.log.error({ status: response.status }, 'AI service refused the question');
    throw new HttpError(502, MESSAGES.assistantFailed);
  }
  return response;
};
