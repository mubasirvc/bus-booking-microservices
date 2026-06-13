import 'dotenv/config';

import { createEnv, z } from '@bus-booking/common';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  NOTiFiCATION_SERVICE_PORT: z.coerce.number().int().min(0).max(65_535).default(4008),
  RABBITMQ_URL: z.string().optional(),
  INTERNAL_API_TOKEN: z.string().min(16),
  FRONTEND_URL: z.string().url(),
  API_URL: z.string().url(),
  RESEND_API_KEY: z.string(),
  EMAIL_FROM: z.string()
});

type EnvType = z.infer<typeof envSchema>;

export const env: EnvType = createEnv(envSchema, {
  serviceName: 'notification-service',
});

export type Env = typeof env;
