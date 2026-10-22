import { z } from 'zod';
import { CHAT_TITLE_LENGTH, MESSAGES } from '../constants.js';
import { requiredText } from './commonSchemas.js';

export const sessionParams = z.object({ id: z.uuid({ error: MESSAGES.chatNotFound }) });

export const renameBody = z.object({
  title: requiredText('Type a name for the chat.', CHAT_TITLE_LENGTH),
});
