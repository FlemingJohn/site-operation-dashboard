import { streamRequest } from './streamRequest';

export const askAssistant = (question, history, onEvent) =>
  streamRequest('/assistant', { question, history }, onEvent);
