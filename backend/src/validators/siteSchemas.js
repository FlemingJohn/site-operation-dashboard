import { z } from 'zod';
import { REGIONS, SITE_STATUSES } from '../constants.js';
import { listQueryShape, optionalChoice, requiredText } from './commonSchemas.js';

export const siteBody = z.object({
  name: requiredText('Enter a site name.', 150),
  city: requiredText('Enter a city.', 100),
  region: z.enum(REGIONS, { error: 'Choose a region.' }),
  status: z.enum(SITE_STATUSES, { error: 'Choose a status.' }).default('active'),
});

export const siteListQuery = z.object({
  ...listQueryShape,
  status: optionalChoice(SITE_STATUSES, 'Choose a valid status.'),
  region: optionalChoice(REGIONS, 'Choose a valid region.'),
});
