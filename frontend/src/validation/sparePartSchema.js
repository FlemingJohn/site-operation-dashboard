import { z } from 'zod';
import { requiredText } from './commonSchemas';

const wholeNumber = (message) =>
  z.preprocess(
    (value) => (value === '' ? undefined : Number(value)),
    z.number({ error: message }).int(message).min(0, message)
  );

export const sparePartSchema = z
  .object({
    name: requiredText('Enter a part name.', 120),
    stock: wholeNumber('Enter how many are in stock, 0 or more.'),
    reorderAt: wholeNumber('Enter the reorder level, 0 or more.'),
    capacity: wholeNumber('Enter how many the shelf holds, 1 or more.').refine(
      (capacity) => capacity >= 1,
      'Enter how many the shelf holds, 1 or more.'
    ),
  })
  .refine((part) => part.stock <= part.capacity, {
    path: ['stock'],
    message: "Stock can't be more than the shelf holds.",
  })
  .refine((part) => part.reorderAt < part.capacity, {
    path: ['reorderAt'],
    message: 'The reorder level must be below what the shelf holds.',
  });
