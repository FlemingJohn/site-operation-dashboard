import { z } from 'zod';
import { REGIONS, SITE_STATUSES } from '../constants';
import { optionValues, requiredText } from './commonSchemas';

export const siteSchema = z.object({
  name: requiredText('Enter a site name.', 150),
  city: requiredText('Enter a city.', 100),
  region: z.enum(optionValues(REGIONS), { error: 'Choose a region.' }),
  status: z.enum(optionValues(SITE_STATUSES), { error: 'Choose a status.' }),
});
