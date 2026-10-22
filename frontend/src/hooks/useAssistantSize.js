import { ASSISTANT_DEFAULT_SIZE, ASSISTANT_MAX_SHARE, ASSISTANT_MIN_SIZE } from '../constants';
import { useStoredChoice } from './useStoredChoice';

const SIZE_KEY = 'siteops.assistantSize';

export const useAssistantSize = () => {
  const [stored, setStored] = useStoredChoice(SIZE_KEY);
  const size = clampSize(readSize(stored));

  const saveSize = (next) => setStored(JSON.stringify(clampSize(next)));
  const resetSize = () => saveSize(ASSISTANT_DEFAULT_SIZE);

  return { size, saveSize, resetSize };
};

const readSize = (stored) => {
  try {
    const parsed = JSON.parse(stored);
    return parsed?.width && parsed?.height ? parsed : ASSISTANT_DEFAULT_SIZE;
  } catch {
    return ASSISTANT_DEFAULT_SIZE;
  }
};

const clampSize = ({ width, height }) => ({
  width: Math.round(
    Math.min(Math.max(width, ASSISTANT_MIN_SIZE.width), window.innerWidth * ASSISTANT_MAX_SHARE)
  ),
  height: Math.round(
    Math.min(Math.max(height, ASSISTANT_MIN_SIZE.height), window.innerHeight * ASSISTANT_MAX_SHARE)
  ),
});
