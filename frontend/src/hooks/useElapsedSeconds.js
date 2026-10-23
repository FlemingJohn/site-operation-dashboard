import { useEffect, useState } from 'react';

const TICK_MS = 1000;

export const useElapsedSeconds = (startedAt, isRunning) => {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!isRunning) return undefined;
    const timer = setInterval(() => setNow(Date.now()), TICK_MS);
    return () => clearInterval(timer);
  }, [isRunning]);

  return Math.max(0, Math.floor((now - startedAt) / TICK_MS));
};
