import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config({ quiet: true });

const envSchema = z
  .object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('production'),
    PORT: z.coerce.number().int().positive().default(5000),
    DATABASE_URL: z.string().min(1),
    DATABASE_SSL: z
      .enum(['true', 'false'])
      .default('true')
      .transform((value) => value === 'true'),
    DATABASE_SSL_CA: z.string().optional(),
    CORS_ORIGIN: z.string().min(1),
    LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),
  })
  .refine((env) => !env.DATABASE_SSL || env.DATABASE_SSL_CA, {
    path: ['DATABASE_SSL_CA'],
    message: 'Required when DATABASE_SSL is true',
  });

const result = envSchema.safeParse(process.env);

if (!result.success) {
  const problems = result.error.issues
    .map((issue) => `  ${issue.path.join('.')}: ${issue.message}`)
    .join('\n');
  process.stderr.write(`Invalid environment configuration:\n${problems}\n`);
  process.exit(1);
}

export const env = result.data;
