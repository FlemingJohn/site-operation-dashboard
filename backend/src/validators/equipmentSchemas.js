import { z } from 'zod';
import {
  EQUIPMENT_SORT_COLUMNS,
  EQUIPMENT_STATUSES,
  EQUIPMENT_TYPES,
  SERVICE_STATES,
} from '../constants.js';
import {
  listQueryShape,
  optionalChoice,
  positiveId,
  requiredText,
  sortShape,
} from './commonSchemas.js';

const MAX_NOTES_LENGTH = 500;
const MAX_SERIAL_LENGTH = 40;
const SITE_NEEDED_MESSAGE = 'Choose the site this machine is at.';
const NO_SITE_IN_STOCK_MESSAGE = 'A machine in stock is in the warehouse. Clear the site.';
const DAY_MS = 86400000;

const getLatestAllowedDate = () => new Date(Date.now() + DAY_MS).toISOString().slice(0, 10);

export const equipmentListQuery = z.object({
  ...listQueryShape,
  ...sortShape(EQUIPMENT_SORT_COLUMNS, { sortBy: 'nextServiceOn', order: 'asc' }),
  type: optionalChoice(EQUIPMENT_TYPES, 'Choose a valid type.'),
  status: optionalChoice(EQUIPMENT_STATUSES, 'Choose a valid status.'),
  state: optionalChoice(SERVICE_STATES, 'Choose a valid check-up state.'),
  siteId: positiveId('Choose a valid site.').optional(),
  dueFrom: z.iso.date({ error: 'Pick a valid start date.' }).optional(),
  dueTo: z.iso.date({ error: 'Pick a valid end date.' }).optional(),
});

export const equipmentBody = z
  .object({
    serial: requiredText('Enter a serial number.', MAX_SERIAL_LENGTH),
    type: z.enum(EQUIPMENT_TYPES, { error: 'Choose a machine type.' }),
    status: z.enum(EQUIPMENT_STATUSES, { error: 'Choose a status.' }).default('in_stock'),
    siteId: positiveId('Choose a valid site.').nullable().default(null),
    nextServiceOn: z.iso.date({ error: 'Pick the next check-up date.' }),
  })
  .superRefine(checkSiteMatchesStatus);

function checkSiteMatchesStatus({ status, siteId }, context) {
  const isInStock = status === 'in_stock';
  if (isInStock && siteId) {
    context.addIssue({ code: 'custom', path: ['siteId'], message: NO_SITE_IN_STOCK_MESSAGE });
  }
  if (!isInStock && !siteId) {
    context.addIssue({ code: 'custom', path: ['siteId'], message: SITE_NEEDED_MESSAGE });
  }
}

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
