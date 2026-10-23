import { Readable } from 'node:stream';
import { env } from '../config/env.js';
import { MESSAGES } from '../constants.js';
import { getAssistantStatus } from '../services/assistantWakeService.js';
import * as chatTurnService from '../services/chatTurnService.js';
import { collectAnswer } from '../utils/collectAnswer.js';
import { createDeadline } from '../utils/createDeadline.js';
import { fetchWhileStarting } from '../utils/fetchWhileStarting.js';
import { HttpError } from '../utils/HttpError.js';
import { SERVICE_KEY_HEADER } from '../utils/isServiceRequest.js';

const WAKE_LIMIT_MS = 120000;
const SILENCE_LIMIT_MS = 60000;
const WAKING_NOTICE_MS = 1500;
const WAKING_STEP = { type: 'step', label: 'Waking up the assistant' };

export const status = async (req, res) => {
  res.json(await getAssistantStatus());
};

export const ask = async (req, res) => {
  if (!env.AI_SERVICE_URL) throw new HttpError(503, MESSAGES.assistantOff);

  const { question } = req.validated.body;
  const { session, history } = await chatTurnService.startTurn(req.visitorId, req.validated.body);
  const control = new AbortController();
  const deadline = createDeadline(control, MESSAGES.assistantUnreachable);
  res.on('close', () => control.abort());

  startStream(res);
  writeEvent(res, { type: 'session', session });
  const answer = await requestAnswer(req, res, { question, history }, control, deadline);
  const collected = answer.ok
    ? await relayAnswer(req, res, answer, control, deadline)
    : failedAnswer(res, answer.message);
  deadline.clear();
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

const writeEvent = (res, event) => {
  if (!res.destroyed) res.write(`${JSON.stringify(event)}\n`);
};

const requestAnswer = async (req, res, question, control, deadline) => {
  const notice = setTimeout(() => writeEvent(res, WAKING_STEP), WAKING_NOTICE_MS);
  deadline.reset(WAKE_LIMIT_MS);
  try {
    const response = await fetchWhileStarting(
      `${env.AI_SERVICE_URL}/ask`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', [SERVICE_KEY_HEADER]: env.AI_SERVICE_KEY },
        body: JSON.stringify(question),
      },
      control.signal
    );
    if (response.ok) return { ok: true, body: response.body };
    req.log.error({ status: response.status }, 'AI service refused the question');
    return { ok: false, message: MESSAGES.assistantFailed };
  } catch (error) {
    req.log.error({ err: error }, 'AI service unreachable');
    return { ok: false, message: MESSAGES.assistantUnreachable };
  } finally {
    clearTimeout(notice);
  }
};

const relayAnswer = async (req, res, answer, control, deadline) => {
  const collector = collectAnswer();
  deadline.reset(SILENCE_LIMIT_MS);
  try {
    for await (const chunk of Readable.fromWeb(answer.body)) {
      deadline.reset(SILENCE_LIMIT_MS);
      collector.push(chunk);
      if (!res.destroyed) res.write(chunk);
    }
  } catch (error) {
    if (!res.destroyed) req.log.error({ err: error }, 'Assistant stream broke');
  }
  return collector.finish();
};

const failedAnswer = (res, message) => {
  writeEvent(res, { type: 'error', message });
  return { role: 'assistant', text: message, status: 'error' };
};
