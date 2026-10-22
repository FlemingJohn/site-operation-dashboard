import { getVisitorId } from '../lib/getVisitorId';
import { streamRequest } from './streamRequest';

export const askAssistant = ({ sessionId, question }, onEvent, signal) =>
  streamRequest('/assistant', { sessionId, question }, onEvent, {
    visitorId: getVisitorId(),
    signal,
  });
