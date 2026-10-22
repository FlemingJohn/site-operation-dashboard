import { z } from 'zod';

const MAX_QUESTION_LENGTH = 300;
const MAX_HISTORY_MESSAGES = 12;
const MAX_MESSAGE_LENGTH = 4000;

export const assistantBody = z.object({
  question: z
    .string({ error: 'Type a question.' })
    .trim()
    .min(1, 'Type a question.')
    .max(MAX_QUESTION_LENGTH, `Keep the question under ${MAX_QUESTION_LENGTH} characters.`),
  history: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant']),
        text: z.string().max(MAX_MESSAGE_LENGTH),
      })
    )
    .max(MAX_HISTORY_MESSAGES, 'The chat is too long. Start a new chat.')
    .default([]),
});
