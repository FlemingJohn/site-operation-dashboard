import { useState } from 'react';

const readChoice = (key) => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

const writeChoice = (key, value) => {
  try {
    localStorage.setItem(key, value);
  } catch {
    return;
  }
};

export const useStoredChoice = (key) => {
  const [choice, setChoice] = useState(() => readChoice(key));

  const updateChoice = (value) => {
    writeChoice(key, value);
    setChoice(value);
  };

  return [choice, updateChoice];
};
