const TIMEOUT_NAMES = new Set(['TimeoutError', 'AbortError']);
const RETRYABLE_STATUSES = new Set([429, 500, 503, 504]);

export const isRetryableError = (error) =>
  RETRYABLE_STATUSES.has(error.status) || TIMEOUT_NAMES.has(error.name);
