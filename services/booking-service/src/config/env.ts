import 'dotenv/config';

import { createEnv, z } from '@bus-booking/common';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  BOOKING_SERVICE_PORT: z.coerce.number().int().min(0).max(65_535).default(4006),
  BOOKING_DB_URL: z.string(),
  INTERNAL_API_TOKEN: z.string().min(16),
});

type EnvType = z.infer<typeof envSchema>;

export const env: EnvType = createEnv(envSchema, {
  serviceName: 'booking-service',
});

export type Env = typeof env;
