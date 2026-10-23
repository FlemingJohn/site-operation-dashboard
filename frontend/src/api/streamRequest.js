import { readJsonLines } from '../lib/readJsonLines';
import { API_BASE_URL, ApiError, buildHeaders, getErrorMessage, sendRequest } from './client';

const SILENCE_LIMIT_MS = 60000;
const SILENCE_MESSAGE = 'Ask SiteOps stopped answering. Please try again.';

export const streamRequest = async (path, body, onEvent, { visitorId, signal } = {}) => {
  const silence = new AbortController();
  let timer = null;
  const resetSilence = () => {
    clearTimeout(timer);
    timer = setTimeout(() => silence.abort(), SILENCE_LIMIT_MS);
  };

  resetSilence();
  try {
    const response = await sendRequest(
      `${API_BASE_URL}/api${path}`,
      {
        method: 'POST',
        headers: buildHeaders({ body, visitorId }),
        body: JSON.stringify(body),
        signal: signal ? AbortSignal.any([signal, silence.signal]) : silence.signal,
      },
      null
    );
    if (!response.ok) {
      const data = await response.json().catch(() => null);
      throw new ApiError(getErrorMessage(response, data), response.status, data?.errors);
    }
    await readJsonLines(response.body, (event) => {
      resetSilence();
      onEvent(event);
    });
  } catch (error) {
    if (silence.signal.aborted && !signal?.aborted) throw new ApiError(SILENCE_MESSAGE, 0);
    throw error;
  } finally {
    clearTimeout(timer);
  }
};
