import { z } from '@bus-booking/common';

export const registerSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(8),
    userName: z.string().min(3).max(30),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(8),
  }),
});

export const refreshSchema = z.object({
  body: z.object({
    refreshToken: z.string(),
  }),
});

export const revokeSchema = z.object({
  body: z.object({
    userId: z.string().uuid(),
  }),
});

export const verifyEmailSchema = z.object({
  query: z.object({
    token: z.string().min(1),
  }),
});
