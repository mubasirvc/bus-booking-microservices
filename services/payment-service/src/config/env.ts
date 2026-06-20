import 'dotenv/config';

import { createEnv, z } from '@bus-booking/common';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PAYMENT_SERVICE_PORT: z.coerce.number().int().min(0).max(65_535).default(4005),
  PAYMENT_DB_URL: z.string(),
  INTERNAL_API_TOKEN: z.string().min(16),
  RAZORPAY_KEY_ID: z.string().min(16),
  RAZORPAY_KEY_SECRET: z.string().min(16),
  BOOKING_GRPC_HOST: z.string().default('localhost:50052'),
  PAYMENT_GRPC_PORT: z.coerce.number().int().min(0).max(65_535).default(50053),
  RABBITMQ_URL: z.string().default('amqp://localhost:5672'),
});

type EnvType = z.infer<typeof envSchema>;

export const env: EnvType = createEnv(envSchema, {
  serviceName: 'payment-service',
});

export type Env = typeof env;
