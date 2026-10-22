import { useRef, useState } from 'react';
import { askAssistant } from '../api/assistantApi';

const HISTORY_LIMIT = 12;
const ANSWERING_STATUSES = ['thinking', 'working', 'writing'];

export const useAssistantChat = ({ isOpen }) => {
  const [messages, setMessages] = useState([]);
  const [hasUnread, setHasUnread] = useState(false);
  const nextId = useRef(1);
  const isAnswering = messages.some((message) => ANSWERING_STATUSES.includes(message.status));

  const updateMessage = (id, change) =>
    setMessages((current) =>
      current.map((message) => (message.id === id ? change(message) : message))
    );

  const ask = async (question) => {
    const userId = nextId.current++;
    const answerId = nextId.current++;
    const history = toHistory(messages);
    setMessages((current) => [
      ...current,
      { id: userId, role: 'user', text: question },
      { id: answerId, role: 'assistant', status: 'thinking', ...EMPTY_ANSWER },
    ]);

    try {
      await askAssistant(question, history, (event) =>
        updateMessage(answerId, (message) => applyEvent(message, event))
      );
    } catch (err) {
      updateMessage(answerId, (message) => ({ ...message, status: 'error', text: err.message }));
    }
    if (!isOpen.current) setHasUnread(true);
  };

  return {
    messages,
    isAnswering,
    hasUnread,
    ask,
    markRead: () => setHasUnread(false),
    clear: () => setMessages([]),
  };
};

const EMPTY_ANSWER = { steps: [], text: '', records: [], sources: [] };

const finishSteps = (steps) => steps.map((step) => ({ ...step, isDone: true }));

const applyEvent = (message, event) => {
  if (event.type === 'thinking') return { ...message, status: 'thinking' };
  if (event.type === 'step') {
    const steps = [...finishSteps(message.steps), { label: event.label, isDone: false }];
    return { ...message, status: 'working', steps };
  }
  if (event.type === 'text') {
    const text = message.text + event.text;
    return { ...message, status: 'writing', steps: finishSteps(message.steps), text };
  }
  if (event.type === 'error') {
    return { ...message, status: 'error', steps: finishSteps(message.steps), text: event.message };
  }
  return { ...message, status: 'done', records: event.records, sources: event.sources };
};

const toHistory = (messages) =>
  messages
    .filter((message) => message.role === 'user' || message.status === 'done')
    .map(({ role, text }) => ({ role, text }))
    .slice(-HISTORY_LIMIT);
