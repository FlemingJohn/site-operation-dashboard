import { answerInactiveSites } from './answerInactiveSites';
import { answerLowStock } from './answerLowStock';
import { answerServiceDue } from './answerServiceDue';
import { answerSummary } from './answerSummary';
import { answerTechnicianWorkload } from './answerTechnicianWorkload';

const TOPICS = [
  { words: ['check-up', 'checkup', 'service', 'due', 'overdue', 'late'], answer: answerServiceDue },
  { words: ['stock', 'part', 'reorder', 'shelf', 'low'], answer: answerLowStock },
  { words: ['inactive', 'closed', 'site'], answer: answerInactiveSites },
  { words: ['technician', 'busy', 'workload', 'work', 'who'], answer: answerTechnicianWorkload },
];

export const pickAnswer = (question) => {
  const text = question.toLowerCase();
  const topic = TOPICS.find(({ words }) => words.some((word) => text.includes(word)));
  return (topic?.answer ?? answerSummary)();
};
