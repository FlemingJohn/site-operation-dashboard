import { MESSAGES } from '../constants.js';

const RATE_LIMITED = 429;
const OVERLOADED_STATUSES = new Set([500, 503, 504]);

export const toAssistantMessage = (error) => {
  if (error.status === RATE_LIMITED) return MESSAGES.assistantBusy;
  if (OVERLOADED_STATUSES.has(error.status)) return MESSAGES.assistantOverloaded;
  if (error.name === 'TimeoutError' || error.name === 'AbortError') return MESSAGES.assistantSlow;
  return MESSAGES.assistantFailed;
};
