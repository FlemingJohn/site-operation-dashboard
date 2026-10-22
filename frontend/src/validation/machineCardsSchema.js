import { z } from 'zod';
import { ASSISTANT_MAX_CARDS, SERVICE_STATES } from '../constants';
import { optionValues } from './commonSchemas';

export const machineCardsSchema = z.object({
  machines: z
    .array(
      z.object({
        id: z.number().int().positive(),
        serial: z.string().min(1),
        type: z.string().min(1),
        siteName: z.string().nullable(),
        nextServiceOn: z.iso.date(),
        serviceState: z.enum(optionValues(SERVICE_STATES)),
      })
    )
    .min(1)
    .max(ASSISTANT_MAX_CARDS),
});
