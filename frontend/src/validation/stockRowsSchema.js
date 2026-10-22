import { z } from 'zod';
import { ASSISTANT_MAX_CARDS, STOCK_LEVELS } from '../constants';
import { optionValues } from './commonSchemas';

export const stockRowsSchema = z.object({
  parts: z
    .array(
      z.object({
        id: z.number().int().positive(),
        name: z.string().min(1),
        stock: z.number().int().min(0),
        reorderAt: z.number().int().min(0),
        capacity: z.number().int().positive(),
        stockLevel: z.enum(optionValues(STOCK_LEVELS)),
      })
    )
    .min(1)
    .max(ASSISTANT_MAX_CARDS),
});
