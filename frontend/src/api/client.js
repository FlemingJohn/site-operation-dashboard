export const API_BASE_URL = import.meta.env.VITE_API_URL ?? '';
const REQUEST_TIMEOUT_MS = 15000;
const REFERENCE_LENGTH = 8;

const MESSAGES = {
  network: 'Cannot reach the server. Check your connection and try again.',
  timeout: 'The server is taking too long to respond. Please try again.',
  fieldErrors: 'Please fix the highlighted fields.',
  unavailable: 'The service is temporarily unavailable. Please try again shortly.',
  unexpected: 'Something went wrong. Please try again.',
};

export class ApiError extends Error {
  constructor(message, status, errors = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
  }
}

const buildQueryString = (params = {}) => {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      query.set(key, value);
    }
  });

  const queryString = query.toString();
  return queryString ? `?${queryString}` : '';
};

const withReference = (message, requestId) =>
  requestId ? `${message} (Reference: ${requestId.slice(0, REFERENCE_LENGTH)})` : message;

export const getErrorMessage = (response, data) => {
  if (data?.errors && Object.keys(data.errors).length > 0) return MESSAGES.fieldErrors;

  if (response.status >= 500) {
    const message = response.status === 503 ? MESSAGES.unavailable : MESSAGES.unexpected;
    return withReference(message, response.headers.get('X-Request-Id'));
  }

  return data?.message ?? MESSAGES.unexpected;
};

export const sendRequest = async (url, options, timeoutMs = REQUEST_TIMEOUT_MS) => {
  const signals = [options.signal, timeoutMs && AbortSignal.timeout(timeoutMs)].filter(Boolean);
  const signal = signals.length > 0 ? AbortSignal.any(signals) : undefined;
  try {
    return await fetch(url, { ...options, signal });
  } catch (error) {
    if (options.signal?.aborted) throw error;
    const message = error.name === 'TimeoutError' ? MESSAGES.timeout : MESSAGES.network;
    throw new ApiError(message, 0);
  }
};

export const buildHeaders = ({ body, idempotencyKey, visitorId }) => ({
  ...(body && { 'Content-Type': 'application/json' }),
  ...(idempotencyKey && { 'Idempotency-Key': idempotencyKey }),
  ...(visitorId && { 'X-Visitor-Id': visitorId }),
});

export const request = async (
  path,
  { method = 'GET', body, params, idempotencyKey, visitorId, timeoutMs } = {}
) => {
  const response = await sendRequest(
    `${API_BASE_URL}/api${path}${buildQueryString(params)}`,
    {
      method,
      headers: buildHeaders({ body, idempotencyKey, visitorId }),
      body: body ? JSON.stringify(body) : undefined,
    },
    timeoutMs
  );

  if (response.status === 204) return null;

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(getErrorMessage(response, data), response.status, data?.errors);
  }

  return data;
};
