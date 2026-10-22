import { z } from 'zod';

export const confirmMoveSchema = z.object({
  request: z.object({
    id: z.number().int().positive(),
    partName: z.string().min(1),
    quantity: z.number().int().positive(),
    serial: z.string().nullable(),
  }),
  fromStatus: z.enum(['requested', 'ordered']),
  toStatus: z.enum(['ordered', 'delivered']),
  stockBefore: z.number().int().min(0).optional(),
  stockAfter: z.number().int().min(0).optional(),
});
