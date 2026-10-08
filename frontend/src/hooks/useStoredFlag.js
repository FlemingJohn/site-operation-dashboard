import { useEffect, useState } from 'react';

const readFlag = (key) => {
  try {
    return localStorage.getItem(key) === 'true';
  } catch {
    return false;
  }
};

const writeFlag = (key, value) => {
  try {
    localStorage.setItem(key, String(value));
  } catch {
    return;
  }
};

export const useStoredFlag = (key) => {
  const [value, setValue] = useState(() => readFlag(key));

  useEffect(() => writeFlag(key, value), [key, value]);

  const toggle = () => setValue((current) => !current);

  return [value, toggle];
};
