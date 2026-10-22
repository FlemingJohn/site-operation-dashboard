import { z } from 'zod';
import { MESSAGES } from '../constants.js';

const MAX_QUESTION_LENGTH = 300;

export const assistantBody = z.object({
  sessionId: z.uuid({ error: MESSAGES.chatNotFound }).optional(),
  question: z
    .string({ error: 'Type a question.' })
    .trim()
    .min(1, 'Type a question.')
    .max(MAX_QUESTION_LENGTH, `Keep the question under ${MAX_QUESTION_LENGTH} characters.`),
});
