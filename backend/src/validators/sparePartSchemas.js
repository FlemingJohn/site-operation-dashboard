import { z } from 'zod';
import { STOCK_LEVELS } from '../constants.js';
import { listQueryShape, optionalChoice } from './commonSchemas.js';

export const sparePartListQuery = z.object({
  ...listQueryShape,
  stockLevel: optionalChoice(STOCK_LEVELS, 'Choose a valid stock level.'),
});
