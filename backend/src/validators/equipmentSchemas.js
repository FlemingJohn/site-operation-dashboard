import { z } from 'zod';
import {
  EQUIPMENT_SORT_COLUMNS,
  EQUIPMENT_STATUSES,
  EQUIPMENT_TYPES,
  SERVICE_STATES,
} from '../constants.js';
import { listQueryShape, optionalChoice, positiveId, sortShape } from './commonSchemas.js';

const MAX_NOTES_LENGTH = 500;
const DAY_MS = 86400000;

const getLatestAllowedDate = () => new Date(Date.now() + DAY_MS).toISOString().slice(0, 10);

export const equipmentListQuery = z.object({
  ...listQueryShape,
  ...sortShape(EQUIPMENT_SORT_COLUMNS, { sortBy: 'nextServiceOn', order: 'asc' }),
  type: optionalChoice(EQUIPMENT_TYPES, 'Choose a valid type.'),
  status: optionalChoice(EQUIPMENT_STATUSES, 'Choose a valid status.'),
  state: optionalChoice(SERVICE_STATES, 'Choose a valid check-up state.'),
  siteId: positiveId('Choose a valid site.').optional(),
});

export const serviceRecordBody = z.object({
  doneOn: z.iso
    .date({ error: 'Pick the date the check-up was done.' })
    .refine((date) => date <= getLatestAllowedDate(), 'The check-up date cannot be in the future.'),
  technicianId: positiveId('Choose who did the check-up.'),
  notes: z
    .string()
    .trim()
    .max(MAX_NOTES_LENGTH, `Keep the notes under ${MAX_NOTES_LENGTH} characters.`)
    .transform((notes) => notes || null)
    .nullable()
    .default(null),
});
