import { getVisitorId } from '../lib/getVisitorId';
import { request } from './client';

const asVisitor = (options = {}) => ({ ...options, visitorId: getVisitorId() });

export const getChatSessions = () => request('/chat-sessions', asVisitor());

export const getChatMessages = (id) => request(`/chat-sessions/${id}/messages`, asVisitor());

export const renameChatSession = (id, title) =>
  request(`/chat-sessions/${id}`, asVisitor({ method: 'PATCH', body: { title } }));

export const deleteChatSession = (id) =>
  request(`/chat-sessions/${id}`, asVisitor({ method: 'DELETE' }));

export const deleteAllChatSessions = () =>
  request('/chat-sessions', asVisitor({ method: 'DELETE' }));
