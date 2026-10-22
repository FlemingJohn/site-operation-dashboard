import { z } from 'zod';

export const reorderPartSchema = z.object({
  part: z.object({
    id: z.number().int().positive(),
    name: z.string().min(1),
    stock: z.number().int().min(0),
    capacity: z.number().int().positive(),
  }),
  quantity: z.number().int().min(1).max(1000),
  requestedBy: z.number().int().positive().nullable(),
});
