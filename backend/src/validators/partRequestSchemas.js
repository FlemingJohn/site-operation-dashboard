import { z } from 'zod';
import { NEXT_REQUEST_STATUSES, PART_REQUEST_STATUSES } from '../constants.js';
import { listQueryShape, optionalChoice, positiveId } from './commonSchemas.js';

const MAX_QUANTITY = 1000;
const QUANTITY_MESSAGE = `Enter a whole number from 1 to ${MAX_QUANTITY}.`;

export const partRequestListQuery = z.object({
  ...listQueryShape,
  status: optionalChoice(PART_REQUEST_STATUSES, 'Choose a valid status.'),
});

export const partRequestBody = z.object({
  partId: positiveId('Choose a part.'),
  equipmentId: positiveId('Choose a valid machine.').nullable().default(null),
  requestedBy: positiveId('Choose who is asking.'),
  quantity: z
    .number({ error: QUANTITY_MESSAGE })
    .int(QUANTITY_MESSAGE)
    .min(1, QUANTITY_MESSAGE)
    .max(MAX_QUANTITY, QUANTITY_MESSAGE),
});

export const partRequestStatusBody = z.object({
  status: z.enum(NEXT_REQUEST_STATUSES, { error: 'Choose ordered or delivered.' }),
});
