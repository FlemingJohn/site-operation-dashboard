import { env } from '../config/env.js';
import { fetchWhileStarting } from '../utils/fetchWhileStarting.js';
import { logger } from '../utils/logger.js';

const WAKE_LIMIT_MS = 120000;
const STATUS_WAIT_MS = 4000;

let waking = null;

export const wakeAssistant = () => {
  if (!env.AI_SERVICE_URL) return Promise.resolve(false);
  waking ??= fetchWhileStarting(
    `${env.AI_SERVICE_URL}/health`,
    {},
    AbortSignal.timeout(WAKE_LIMIT_MS)
  )
    .then((response) => response.ok)
    .catch((error) => {
      logger.warn({ err: error }, 'AI service did not wake up');
      return false;
    })
    .finally(() => {
      waking = null;
    });
  return waking;
};

export const getAssistantStatus = async () => {
  if (!env.AI_SERVICE_URL) return { assistant: 'off' };
  const stillWaking = new Promise((resolve) => setTimeout(resolve, STATUS_WAIT_MS, null));
  const isReady = await Promise.race([wakeAssistant(), stillWaking]);
  if (isReady === null) return { assistant: 'waking' };
  return { assistant: isReady ? 'ready' : 'down' };
};
