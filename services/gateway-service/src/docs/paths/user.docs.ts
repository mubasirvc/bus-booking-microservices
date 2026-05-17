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
