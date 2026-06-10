import { registry } from '../registry';

import { z } from 'zod';

import {
  createUserSchema,
  searchUsersQuerySchema,
  userIdParamsSchema,
} from '../../validation/user.schema';

// -----------------------------------
// GET /users
// -----------------------------------

registry.registerPath({
  method: 'get',

  path: '/users',

  tags: ['Users'],

  security: [
    {
      bearerAuth: [],
    },
  ],

  responses: {
    200: {
      description: 'Get all users',

      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean(),

            data: z.array(
              z.object({
                id: z.string().uuid(),

                email: z.string().email(),

                userName: z.string(),
              }),
            ),
          }),

          example: {
            success: true,

            data: [
              {
                id: '550e8400-e29b-41d4-a716-446655440000',

                email: 'john@example.com',

                userName: 'john',
              },
            ],
          },
        },
      },
    },
  },
});

// -----------------------------------
// GET /users/search
// -----------------------------------

registry.registerPath({
  method: 'get',

  path: '/users/search',

  tags: ['Users'],

  security: [
    {
      bearerAuth: [],
    },
  ],

  request: {
    query: searchUsersQuerySchema,
  },

  responses: {
    200: {
      description: 'Search users',

      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean(),

            data: z.array(
              z.object({
                id: z.string(),

                email: z.string(),

                userName: z.string(),
              }),
            ),
          }),
        },
      },
    },
  },
});

// -----------------------------------
// GET /users/:id
// -----------------------------------

registry.registerPath({
  method: 'get',

  path: '/users/{id}',

  tags: ['Users'],

  security: [
    {
      bearerAuth: [],
    },
  ],

  request: {
    params: userIdParamsSchema,
  },

  responses: {
    200: {
      description: 'Get user by id',

      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean(),

            data: z.object({
              id: z.string(),

              email: z.string(),

              userName: z.string(),
            }),
          }),
        },
      },
    },

    404: {
      description: 'User not found',
    },
  },
});

// -----------------------------------
// POST /users
// -----------------------------------

// registry.registerPath({
//   method: 'post',

//   path: '/users',

//   tags: ['Users'],

//   request: {
//     body: {
//       content: {
//         'application/json': {
//           schema: createUserSchema,
//         },
//       },
//     },
//   },

//   responses: {
//     201: {
//       description: 'User created',

//       content: {
//         'application/json': {
//           schema: z.object({
//             success: z.boolean(),

//             data: z.object({
//               id: z.string(),

//               email: z.string(),

//               userName: z.string(),
//             }),
//           }),

//           example: {
//             success: true,

//             data: {
//               id: '550e8400-e29b-41d4-a716-446655440000',

//               email: 'john@example.com',

//               userName: 'john',
//             },
//           },
//         },
//       },
//     },

//     400: {
//       description: 'Validation error',
//     },
//   },
// });


// ======================================================
// Shared Schemas
// ======================================================

const myBookingSchema = z.object({
  bookingId: z.string().uuid().openapi({
    example: '550e8400-e29b-41d4-a716-446655440000',
  }),

  tripId: z.string().uuid().openapi({
    example: '550e8400-e29b-41d4-a716-446655440001',
  }),

  userId: z.string().uuid().openapi({
    example: '550e8400-e29b-41d4-a716-446655440002',
  }),

  seats: z.array(z.string()).openapi({
    example: ['A1', 'A2'],
  }),

  totalFare: z.number().openapi({
    example: 1200,
  }),

  status: z.enum([
    'PENDING',
    'CONFIRMED',
    'CANCELLED',
  ]),

  createdAt: z.string().datetime().openapi({
    example: '2026-06-10T10:00:00Z',
  }),

  updatedAt: z.string().datetime().openapi({
    example: '2026-06-10T10:05:00Z',
  }),
});

const paginationMetaSchema = z.object({
  page: z.number(),
  limit: z.number(),
  total: z.number(),
  totalPages: z.number(),
});

// ======================================================
// GET /my-bookings
// ======================================================

registry.registerPath({
  method: 'get',

  path: '/users/my-bookings',

  tags: ['Users'],

  summary: 'Get user bookings',

  security: [
    {
      bearerAuth: [],
    },
  ],

  request: {
    query: z.object({
      status: z
        .enum(['PENDING', 'CONFIRMED', 'CANCELLED'])
        .optional(),

      page: z.coerce.number().optional(),

      limit: z.coerce.number().optional(),
    }),
  },

  responses: {
    200: {
      description: 'Bookings fetched successfully',

      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean(),

            data: z.array(myBookingSchema),

            pagination: paginationMetaSchema,
          }),

          example: {
            success: true,

            data: [
              {
                bookingId:
                  '550e8400-e29b-41d4-a716-446655440000',

                tripId:
                  '550e8400-e29b-41d4-a716-446655440001',

                userId:
                  '550e8400-e29b-41d4-a716-446655440002',

                seats: ['A1', 'A2'],

                totalFare: 1200,

                status: 'CONFIRMED',

                createdAt: '2026-06-10T10:00:00Z',

                updatedAt: '2026-06-10T10:05:00Z',
              },
            ],

            pagination: {
              page: 1,
              limit: 10,
              total: 1,
              totalPages: 1,
            },
          },
        },
      },
    },
  },
});

// ======================================================
// GET /my-bookings/{bookingId}
// ======================================================

registry.registerPath({
  method: 'get',

  path: '/users/my-bookings/{bookingId}',

  tags: ['Users'],

  summary: 'Get booking details',

  security: [
    {
      bearerAuth: [],
    },
  ],

  request: {
    params: z.object({
      bookingId: z.string().uuid(),
    }),
  },

  responses: {
    200: {
      description: 'Booking fetched successfully',

      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean(),

            data: myBookingSchema,
          }),

          example: {
            success: true,

            data: {
              bookingId:
                '550e8400-e29b-41d4-a716-446655440000',

              tripId:
                '550e8400-e29b-41d4-a716-446655440001',

              userId:
                '550e8400-e29b-41d4-a716-446655440002',

              seats: ['A1', 'A2'],

              totalFare: 1200,

              status: 'CONFIRMED',

              createdAt: '2026-06-10T10:00:00Z',

              updatedAt: '2026-06-10T10:05:00Z',
            },
          },
        },
      },
    },

    404: {
      description: 'Booking not found',
    },
  },
});
