import { Readable } from 'node:stream';
import { env } from '../config/env.js';
import { MESSAGES } from '../constants.js';
import * as chatTurnService from '../services/chatTurnService.js';
import { collectAnswer } from '../utils/collectAnswer.js';
import { HttpError } from '../utils/HttpError.js';
import { SERVICE_KEY_HEADER } from '../utils/isServiceRequest.js';

const ANSWER_TIMEOUT_MS = 75000;

export const ask = async (req, res) => {
  if (!env.AI_SERVICE_URL) throw new HttpError(503, MESSAGES.assistantOff);

  const { question } = req.validated.body;
  const { session, history } = await chatTurnService.startTurn(req.visitorId, req.validated.body);
  const disconnected = new AbortController();
  res.on('close', () => disconnected.abort());

  const answer = await requestAnswer(req, { question, history }, disconnected.signal).catch(
    async (error) => {
      await chatTurnService.failTurn(session.id, error.message);
      throw error;
    }
  );

  startStream(res);
  res.write(`${JSON.stringify({ type: 'session', session })}\n`);
  const collected = await relayAnswer(req, res, answer, disconnected.signal);
  await chatTurnService.finishTurn(session.id, collected);
  res.end();
};

const startStream = (res) => {
  res.status(200).set({
    'Content-Type': 'application/x-ndjson; charset=utf-8',
    'Cache-Control': 'no-cache',
    'X-Accel-Buffering': 'no',
  });
  res.flushHeaders();
};

const relayAnswer = async (req, res, answer, disconnected) => {
  const collector = collectAnswer();
  try {
    for await (const chunk of Readable.fromWeb(answer.body)) {
      collector.push(chunk);
      if (!res.destroyed) res.write(chunk);
    }
  } catch (error) {
    if (!disconnected.aborted) req.log.error({ err: error }, 'Assistant stream broke');
  }
  return collector.finish();
};

const requestAnswer = async (req, question, disconnected) => {
  let response;
  try {
    response = await fetch(`${env.AI_SERVICE_URL}/ask`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', [SERVICE_KEY_HEADER]: env.AI_SERVICE_KEY },
      body: JSON.stringify(question),
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
