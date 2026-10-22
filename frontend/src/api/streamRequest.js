import { readJsonLines } from '../lib/readJsonLines';
import { API_BASE_URL, ApiError, getErrorMessage, sendRequest } from './client';

const STREAM_TIMEOUT_MS = 75000;

export const streamRequest = async (path, body, onEvent) => {
  const response = await sendRequest(
    `${API_BASE_URL}/api${path}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    },
    STREAM_TIMEOUT_MS
  );

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new ApiError(getErrorMessage(response, data), response.status, data?.errors);
  }

  await readJsonLines(response.body, onEvent);
};
