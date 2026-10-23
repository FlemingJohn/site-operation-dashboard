import { z } from 'zod';
import { EQUIPMENT_STATUSES, EQUIPMENT_TYPES } from '../constants';
import { optionalId, optionValues, requiredText } from './commonSchemas';

const SITE_NEEDED_MESSAGE = 'Choose the site this machine is at.';

export const equipmentSchema = z
  .object({
    serial: requiredText('Enter a serial number.', 40),
    type: z.enum(optionValues(EQUIPMENT_TYPES), { error: 'Choose a machine type.' }),
    status: z.enum(optionValues(EQUIPMENT_STATUSES), { error: 'Choose a status.' }),
    siteId: optionalId('Choose a valid site.'),
    nextServiceOn: z.iso.date({ error: 'Pick the next check-up date.' }),
  })
  .transform((machine) =>
    machine.status === 'in_stock' ? { ...machine, siteId: null } : machine
  )
  .refine((machine) => machine.status === 'in_stock' || machine.siteId, {
    path: ['siteId'],
    message: SITE_NEEDED_MESSAGE,
  });
