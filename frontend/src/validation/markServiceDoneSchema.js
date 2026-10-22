import { z } from 'zod';

export const markServiceDoneSchema = z.object({
  machine: z.object({
    id: z.number().int().positive(),
    serial: z.string().min(1),
    type: z.string().min(1),
    siteName: z.string().nullable(),
  }),
  doneOn: z.iso.date(),
  technicianId: z.number().int().positive().nullable(),
  notes: z.string().max(500),
});
