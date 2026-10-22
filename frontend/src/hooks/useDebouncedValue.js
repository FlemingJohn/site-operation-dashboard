import { useEffect, useState } from 'react';
import { SEARCH_DELAY_MS } from '../constants';

export const useDebouncedValue = (value) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), SEARCH_DELAY_MS);
    return () => clearTimeout(timer);
  }, [value]);

  return debouncedValue;
};
