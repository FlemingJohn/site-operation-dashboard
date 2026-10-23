import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { getAssistantStatus } from '../api/healthApi';
import { AssistantStatusContext } from '../assistant/AssistantStatusContext';

const RECHECK_MS = { waking: 1000, down: 15000 };

const readStatus = async () => {
  try {
    return (await getAssistantStatus()).assistant;
  } catch {
    return 'waking';
  }
};

const AssistantStatusProvider = ({ children }) => {
  const [status, setStatus] = useState('checking');
  const [since, setSince] = useState(() => Date.now());
  const timer = useRef(null);

  const check = useCallback(async () => {
    clearTimeout(timer.current);
    const next = await readStatus();
    setStatus((current) => {
      if (current !== next && next === 'waking') setSince(Date.now());
      return next;
    });
    if (RECHECK_MS[next]) timer.current = setTimeout(check, RECHECK_MS[next]);
  }, []);

  useEffect(() => {
    check();
    return () => clearTimeout(timer.current);
  }, [check]);

  const value = useMemo(() => ({ status, since, recheck: check }), [status, since, check]);

  return (
    <AssistantStatusContext.Provider value={value}>{children}</AssistantStatusContext.Provider>
  );
};

export default AssistantStatusProvider;
