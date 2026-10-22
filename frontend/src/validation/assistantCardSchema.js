import { z } from 'zod';

export const assistantCardSchema = z.object({
  component: z.string(),
  props: z.record(z.string(), z.unknown()),
  total: z.number().int().min(0).optional(),
  seeAll: z.object({ label: z.string().min(1), path: z.string().startsWith('/') }).optional(),
});
