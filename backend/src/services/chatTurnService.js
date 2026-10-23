import * as chatMessageService from './chatMessageService.js';
import * as chatSessionService from './chatSessionService.js';

export const startTurn = async (visitorId, { sessionId, question }) => {
  const session = sessionId
    ? await chatSessionService.findOwned(visitorId, sessionId)
    : await chatSessionService.create(visitorId, question);
  const history = await chatMessageService.findMemory(session.id);
  await chatMessageService.add(session.id, { role: 'user', text: question });
  return { session, history };
};

export const finishTurn = async (sessionId, answer) => {
  await chatMessageService.add(sessionId, answer);
  await chatSessionService.touch(sessionId);
};
