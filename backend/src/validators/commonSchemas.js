import { z } from 'zod';
import { DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, MESSAGES } from '../constants.js';

const MAX_SEARCH_LENGTH = 100;
const PAGE_MESSAGE = 'Page must be a whole number of 1 or more.';
const LIMIT_MESSAGE = `Page size must be between 1 and ${MAX_PAGE_SIZE}.`;

export const requiredText = (message, maxLength) =>
  z
    .string({ error: message })
    .trim()
    .min(1, message)
    .max(maxLength, `Keep this under ${maxLength} characters.`);

export const positiveId = (message) =>
  z.coerce.number({ error: message }).int(message).positive(message);

export const optionalChoice = (values, message) => z.enum(values, { error: message }).optional();

export const idParams = z.object({ id: positiveId(MESSAGES.invalidId) });

export const listQueryShape = {
  page: z.coerce.number({ error: PAGE_MESSAGE }).int(PAGE_MESSAGE).min(1, PAGE_MESSAGE).default(1),
  limit: z.coerce
    .number({ error: LIMIT_MESSAGE })
    .int(LIMIT_MESSAGE)
    .min(1, LIMIT_MESSAGE)
    .max(MAX_PAGE_SIZE, LIMIT_MESSAGE)
    .default(DEFAULT_PAGE_SIZE),
  search: z
    .string()
    .trim()
    .max(MAX_SEARCH_LENGTH, `Keep the search under ${MAX_SEARCH_LENGTH} characters.`)
    .optional(),
};
