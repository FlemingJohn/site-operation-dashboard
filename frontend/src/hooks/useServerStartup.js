import { useCallback, useEffect, useState } from 'react';
import { getHealth } from '../api/healthApi';

const SHOW_AFTER_MS = 2000;
const RETRY_MS = 2000;
const GIVE_UP_MS = 90000;

const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const waitForServer = async (startedAt, isCancelled) => {
  for (;;) {
    try {
      await getHealth();
      return { phase: 'ready', database: 'ready' };
    } catch (error) {
      if (Date.now() - startedAt > GIVE_UP_MS) {
        return { phase: 'failed', database: error.status === 503 ? 'failed' : 'waiting' };
      }
    }
    if (isCancelled()) return null;
    await pause(RETRY_MS);
  }
};

export const useServerStartup = () => {
  const [attempt, setAttempt] = useState(0);
  const [startedAt, setStartedAt] = useState(() => Date.now());
  const [state, setState] = useState({ phase: 'checking', database: 'waiting' });

  useEffect(() => {
    let isCancelled = false;
    const startTime = Date.now();
    const showTimer = setTimeout(
      () =>
        setState((current) =>
          current.phase === 'checking' ? { ...current, phase: 'waking' } : current
        ),
      SHOW_AFTER_MS
    );
    waitForServer(startTime, () => isCancelled).then((result) => {
      if (!isCancelled && result) setState(result);
    });
    return () => {
      isCancelled = true;
      clearTimeout(showTimer);
    };
  }, [attempt]);

  const retry = useCallback(() => {
    setStartedAt(Date.now());
    setState({ phase: 'waking', database: 'waiting' });
    setAttempt((count) => count + 1);
  }, []);

  return { ...state, startedAt, retry };
};
