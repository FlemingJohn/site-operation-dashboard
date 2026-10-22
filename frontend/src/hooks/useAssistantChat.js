import { useRef, useState } from 'react';
import { askAssistant } from '../api/assistantApi';

const ERROR_TEXT = "Sorry, I couldn't get an answer just now. Please try again.";

const finishSteps = (steps) => steps.map((step) => ({ ...step, isDone: true }));

const applyEvent = (message, event) => {
  if (event.type === 'thinking') return { ...message, status: 'thinking' };
  if (event.type === 'step') {
    const steps = [...finishSteps(message.steps), { label: event.label, isDone: false }];
    return { ...message, status: 'working', steps };
  }
  if (event.type === 'text') {
    return {
      ...message,
      status: 'writing',
      steps: finishSteps(message.steps),
      text: message.text + event.text,
    };
  }
  return { ...message, status: 'done', records: event.records, sources: event.sources };
};

export const useAssistantChat = ({ isOpen }) => {
  const [messages, setMessages] = useState([]);
  const [hasUnread, setHasUnread] = useState(false);
  const nextId = useRef(1);
  const isAnswering = messages.some((message) =>
    ['thinking', 'working', 'writing'].includes(message.status)
  );

  const updateMessage = (id, change) =>
    setMessages((current) =>
      current.map((message) => (message.id === id ? change(message) : message))
    );

  const ask = async (question) => {
    const userId = nextId.current++;
    const answerId = nextId.current++;
    setMessages((current) => [
      ...current,
      { id: userId, role: 'user', text: question },
      {
        id: answerId,
        role: 'assistant',
        status: 'thinking',
        steps: [],
        text: '',
        records: [],
        sources: [],
      },
    ]);

    try {
      await askAssistant(question, (event) =>
        updateMessage(answerId, (message) => applyEvent(message, event))
      );
    } catch {
      updateMessage(answerId, (message) => ({ ...message, status: 'error', text: ERROR_TEXT }));
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
