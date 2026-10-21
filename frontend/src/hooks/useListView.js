import { CARD_VIEW_LIMIT, LIST_VIEWS } from '../constants';
import { useStoredChoice } from './useStoredChoice';

export const useListView = (storageKey, total) => {
  const [storedView, setView] = useStoredChoice(storageKey);
  const defaultView = total > CARD_VIEW_LIMIT ? LIST_VIEWS.table : LIST_VIEWS.cards;

  return [storedView ?? defaultView, setView];
};
