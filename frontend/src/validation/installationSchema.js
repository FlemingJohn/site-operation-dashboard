import { z } from 'zod';
import { INSTALLATION_STATUSES } from '../constants';
import { optionalId, optionValues, positiveId, requiredText } from './commonSchemas';

export const installationSchema = z.object({
  equipment: requiredText('Enter the equipment name.', 150),
  siteId: positiveId('Choose a site.'),
  technicianId: optionalId('Choose a valid technician.'),
  installedOn: z.iso.date({ error: 'Pick an installation date.' }),
  status: z.enum(optionValues(INSTALLATION_STATUSES), { error: 'Choose a status.' }),
});
