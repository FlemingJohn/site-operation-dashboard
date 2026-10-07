import { z } from 'zod';
import { INSTALLATION_SORT_COLUMNS, INSTALLATION_STATUSES } from '../constants.js';
import {
  listQueryShape,
  optionalChoice,
  positiveId,
  requiredText,
  sortShape,
} from './commonSchemas.js';

export const installationBody = z.object({
  equipment: requiredText('Enter the equipment name.', 150),
  siteId: z.number({ error: 'Choose a site.' }).int('Choose a site.').positive('Choose a site.'),
  technicianId: z
    .number({ error: 'Choose a valid technician.' })
    .int('Choose a valid technician.')
    .positive('Choose a valid technician.')
    .nullable()
    .default(null),
  installedOn: z.iso.date({ error: 'Pick an installation date.' }),
  status: z.enum(INSTALLATION_STATUSES, { error: 'Choose a status.' }).default('pending'),
});

export const installationListQuery = z.object({
  ...listQueryShape,
  ...sortShape(INSTALLATION_SORT_COLUMNS, { sortBy: 'installedOn', order: 'desc' }),
  siteId: positiveId('Choose a valid site.').optional(),
  status: optionalChoice(INSTALLATION_STATUSES, 'Choose a valid status.'),
});
