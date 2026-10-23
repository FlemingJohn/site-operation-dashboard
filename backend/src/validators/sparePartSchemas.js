import { z } from 'zod';
import { STOCK_LEVELS } from '../constants.js';
import { listQueryShape, optionalChoice, requiredText } from './commonSchemas.js';

const MAX_NAME_LENGTH = 120;
const MAX_REASON_LENGTH = 200;
const OVER_SHELF_MESSAGE = "Stock can't be more than the shelf holds.";
const REORDER_TOO_HIGH_MESSAGE = 'The reorder level must be below what the shelf holds.';

const wholeNumber = (message) => z.number({ error: message }).int(message).min(0, message);

export const sparePartListQuery = z.object({
  ...listQueryShape,
  stockLevel: optionalChoice(STOCK_LEVELS, 'Choose a valid stock level.'),
});

export const sparePartBody = z
  .object({
    name: requiredText('Enter a part name.', MAX_NAME_LENGTH),
    stock: wholeNumber('Enter how many are in stock, 0 or more.'),
    reorderAt: wholeNumber('Enter the reorder level, 0 or more.'),
    capacity: wholeNumber('Enter how many the shelf holds, 1 or more.').min(
      1,
      'Enter how many the shelf holds, 1 or more.'
    ),
  })
  .superRefine(checkFitsShelf);

export const stockBody = z.object({
  stock: wholeNumber('Enter how many are in stock, 0 or more.'),
  reason: z
    .string()
    .trim()
    .max(MAX_REASON_LENGTH, `Keep the reason under ${MAX_REASON_LENGTH} characters.`)
    .transform((reason) => reason || null)
    .nullable()
    .default(null),
});

function checkFitsShelf({ stock, reorderAt, capacity }, context) {
  if (stock > capacity) {
    context.addIssue({ code: 'custom', path: ['stock'], message: OVER_SHELF_MESSAGE });
  }
  if (reorderAt >= capacity) {
    context.addIssue({ code: 'custom', path: ['reorderAt'], message: REORDER_TOO_HIGH_MESSAGE });
  }
}
