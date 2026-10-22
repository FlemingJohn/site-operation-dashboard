import { z } from 'zod';
import { ACTIVITY_KINDS, ACTIVITY_PERIODS } from '../constants.js';
import { listQueryShape, optionalChoice } from './commonSchemas.js';

const MAX_TEXT_LENGTH = 200;

export const activityListQuery = z.object({
  ...listQueryShape,
  kind: optionalChoice(ACTIVITY_KINDS, 'Choose a valid kind.'),
  actor: z.string().trim().max(MAX_TEXT_LENGTH).optional(),
  days: optionalChoice(ACTIVITY_PERIODS, 'Choose 7 or 30 days.'),
  path: z.string().trim().max(MAX_TEXT_LENGTH).optional(),
});
