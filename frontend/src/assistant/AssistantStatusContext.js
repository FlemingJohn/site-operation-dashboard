import { createContext } from 'react';

export const AssistantStatusContext = createContext({
  status: 'checking',
  since: Date.now(),
  recheck: () => {},
});
