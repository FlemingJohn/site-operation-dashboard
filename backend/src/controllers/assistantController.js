import { isAssistantReady } from '../assistant/geminiClient.js';
import { runAssistant } from '../assistant/runAssistant.js';
import { toAssistantMessage } from '../assistant/toAssistantMessage.js';
import { MESSAGES } from '../constants.js';
import { HttpError } from '../utils/HttpError.js';

const ANSWER_TIMEOUT_MS = 60000;

export const ask = async (req, res) => {
  if (!isAssistantReady) throw new HttpError(503, MESSAGES.assistantOff);

  const disconnected = new AbortController();
  res.on('close', () => disconnected.abort());
  const signal = AbortSignal.any([disconnected.signal, AbortSignal.timeout(ANSWER_TIMEOUT_MS)]);
  const send = (event) => res.write(`${JSON.stringify(event)}\n`);

  res.status(200).set({
    'Content-Type': 'application/x-ndjson; charset=utf-8',
    'Cache-Control': 'no-cache',
    'X-Accel-Buffering': 'no',
  });
  res.flushHeaders();

  try {
    await runAssistant({ ...req.validated.body, signal, send });
  } catch (error) {
    req.log.error({ err: error }, 'Assistant failed');
    if (!disconnected.signal.aborted) send({ type: 'error', message: toAssistantMessage(error) });
  } finally {
    res.end();
  }
};
