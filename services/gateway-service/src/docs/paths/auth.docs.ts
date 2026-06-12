import { z } from 'zod';

import { registry } from '../registry';

import {
  loginSchema,
  refreshSchema,
  registerSchema,
  revokeSchema,
  verifyEmailSchema,
} from '../../validation/auth.schema.js';

// ======================================================
// Shared Schemas
// ======================================================

const userSchema = z.object({
  id: z.string().uuid().openapi({
    example: '550e8400-e29b-41d4-a716-446655440000',
  }),

  email: z.string().email().openapi({
    example: 'john@example.com',
  }),

  userName: z.string().openapi({
    example: 'john_doe',
  }),

  createdAt: z.string().datetime().openapi({
    example: '2026-05-17T10:00:00Z',
  }),
});

const authTokensSchema = z.object({
  accessToken: z.string().openapi({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
  }),

  refreshToken: z.string().openapi({
    example: 'refresh-token-example',
  }),
});

const authResponseSchema = authTokensSchema.extend({
  user: userSchema,
});

const successMessageSchema = z.object({
  success: z.boolean().openapi({
    example: true,
  }),

  message: z.string(),
});

// ======================================================
// POST /auth/register
// ======================================================

registry.registerPath({
  method: 'post',

  path: '/auth/register',

  tags: ['Auth'],

  summary: 'Register a new user',

  request: {
    body: {
      required: true,

      content: {
        'application/json': {
          schema: registerSchema,

          example: {
            email: 'john@example.com',
            password: 'Password@123',
            userName: 'john_doe',
          },
        },
      },
    },
  },

  responses: {
    201: {
      description: 'User registered successfully',

      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean(),
            user: userSchema,
          }),

          example: {
            success: true,

            user: {
              id: '550e8400-e29b-41d4-a716-446655440000',
              email: 'john@example.com',
              userName: 'john_doe',
              createdAt: '2026-05-17T10:00:00Z',
            },
          },
        },
      },
    },

    400: {
      description: 'Validation error',
    },

    409: {
      description: 'User already exists',
    },
  },
});

// ======================================================
// POST /auth/login
// ======================================================

registry.registerPath({
  method: 'post',

  path: '/auth/login',

  tags: ['Auth'],

  summary: 'Login user',

  request: {
    body: {
      required: true,

      content: {
        'application/json': {
          schema: loginSchema,

          example: {
            email: 'john@example.com',
            password: 'Password@123',
          },
        },
      },
    },
  },

  responses: {
    200: {
      description: 'Login successful',

      content: {
        'application/json': {
          schema: authResponseSchema,

          example: {
            accessToken: 'jwt-access-token',
            refreshToken: 'jwt-refresh-token',

            user: {
              id: '550e8400-e29b-41d4-a716-446655440000',
              email: 'john@example.com',
              userName: 'john_doe',
              createdAt: '2026-05-17T10:00:00Z',
            },
          },
        },
      },
    },

    401: {
      description: 'Invalid credentials',
    },
  },
});

// ======================================================
// GET /auth/verify-email
// ======================================================

registry.registerPath({
  method: 'get',

  path: '/auth/verify-email',

  tags: ['Auth'],

  summary: 'Verify user email',

  request: {
    query: verifyEmailSchema,
  },

  responses: {
    200: {
      description: 'Email verified successfully',

      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean(),

            message: z.string(),
          }),

          example: {
            success: true,

            message: 'Email verified successfully',
          },
        },
      },
    },

    400: {
      description: 'Invalid or expired verification token',
    },

    404: {
      description: 'User not found',
    },
  },
});

// ======================================================
// POST /auth/refresh
// ======================================================

registry.registerPath({
  method: 'post',

  path: '/auth/refresh',

  tags: ['Auth'],

  summary: 'Refresh access token',

  request: {
    body: {
      required: true,

      content: {
        'application/json': {
          schema: refreshSchema,

          example: {
            refreshToken: 'refresh-token-example',
          },
        },
      },
    },
  },

  responses: {
    200: {
      description: 'Token refreshed successfully',

      content: {
        'application/json': {
          schema: authTokensSchema,

          example: {
            accessToken: 'new-access-token',
            refreshToken: 'new-refresh-token',
          },
        },
      },
    },

    401: {
      description: 'Invalid refresh token',
    },
  },
});

// ======================================================
// POST /auth/revoke
// ======================================================

registry.registerPath({
  method: 'post',

  path: '/auth/revoke',

  tags: ['Auth'],

  summary: 'Revoke refresh token',

  request: {
    body: {
      required: true,

      content: {
        'application/json': {
          schema: revokeSchema,

          example: {
            refreshToken: 'refresh-token-example',
          },
        },
      },
    },
  },

  responses: {
    200: {
      description: 'Refresh token revoked successfully',

      content: {
        'application/json': {
          schema: successMessageSchema,

          example: {
            success: true,
            message: 'Refresh token revoked successfully',
          },
        },
      },
    },

    401: {
      description: 'Invalid token',
    },
  },
});
