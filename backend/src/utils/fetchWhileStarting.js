const RETRY_DELAY_MS = 2000;
const STARTING_STATUSES = new Set([502, 503, 504]);

const pause = (ms, signal) =>
  new Promise((resolve, reject) => {
    const timer = setTimeout(resolve, ms);
    signal.addEventListener('abort', () => {
      clearTimeout(timer);
      reject(signal.reason);
    });
  });

export const fetchWhileStarting = async (url, options, signal) => {
  for (;;) {
    try {
      const response = await fetch(url, { ...options, signal });
      if (!STARTING_STATUSES.has(response.status)) return response;
    } catch (error) {
      if (signal.aborted) throw error;
    }
    await pause(RETRY_DELAY_MS, signal);
  }
};
