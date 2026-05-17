import { z } from '@bus-booking/common';

// ======================================================
// REGISTER
// ======================================================

export const registerSchema = z.object({
  email: z.string().email().openapi({
    example: 'john@example.com',
  }),

  password: z.string().min(8).openapi({
    example: 'Password@123',
  }),

  userName: z.string().min(3).max(30).openapi({
    example: 'john_doe',
  }),
});

// ======================================================
// LOGIN
// ======================================================

export const loginSchema = z.object({
  email: z.string().email().openapi({
    example: 'john@example.com',
  }),

  password: z.string().min(8).openapi({
    example: 'Password@123',
  }),
});

// ======================================================
// REFRESH
// ======================================================

export const refreshSchema = z.object({
  refreshToken: z.string().openapi({
    example: 'refresh-token-example',
  }),
});

// ======================================================
// REVOKE
// ======================================================

export const revokeSchema = z.object({
  userId: z.string().uuid().openapi({
    example: '550e8400-e29b-41d4-a716-446655440000',
  }),
});
