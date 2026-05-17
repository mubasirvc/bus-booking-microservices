import { z } from 'zod';

import { registry } from '../registry';

import {
  busIdParamsSchema,
  createBusSchema,
  searchBusesQuerySchema,
  updateBusSchema,
} from '../../validation/bus.schema';

// ======================================================
// Shared Bus Schema
// ======================================================

const busSchema = z.object({
  id: z.string().uuid().openapi({
    example: '550e8400-e29b-41d4-a716-446655440000',
  }),

  name: z.string().openapi({
    example: 'KSRTC Express',
  }),

  busNumber: z.string().openapi({
    example: 'KA01AB1234',
  }),

  type: z.string().openapi({
    example: 'AC Sleeper',
  }),

  totalSeats: z.number().openapi({
    example: 40,
  }),

  createdAt: z.string().datetime().openapi({
    example: '2026-05-17T10:00:00Z',
  }),

  updatedAt: z.string().datetime().openapi({
    example: '2026-05-17T10:00:00Z',
  }),
});

// ======================================================
// GET /buses
// ======================================================

registry.registerPath({
  method: 'get',

  path: '/buses',

  tags: ['Buses'],

  summary: 'Get all buses',

  security: [
    {
      bearerAuth: [],
    },
  ],

  responses: {
    200: {
      description: 'Buses fetched successfully',

      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean(),

            data: z.array(busSchema),
          }),

          example: {
            success: true,

            data: [
              {
                id: '550e8400-e29b-41d4-a716-446655440000',

                name: 'KSRTC Express',

                busNumber: 'KA01AB1234',

                type: 'AC Sleeper',

                totalSeats: 40,

                createdAt: '2026-05-17T10:00:00Z',

                updatedAt: '2026-05-17T10:00:00Z',
              },
            ],
          },
        },
      },
    },
  },
});

// ======================================================
// GET /buses/search
// ======================================================

registry.registerPath({
  method: 'get',

  path: '/buses/search',

  tags: ['Buses'],

  summary: 'Search buses',

  security: [
    {
      bearerAuth: [],
    },
  ],

  request: {
    query: searchBusesQuerySchema,
  },

  responses: {
    200: {
      description: 'Search results fetched successfully',

      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean(),

            data: z.array(busSchema),
          }),
        },
      },
    },
  },
});

// ======================================================
// GET /buses/{id}
// ======================================================

registry.registerPath({
  method: 'get',

  path: '/buses/{id}',

  tags: ['Buses'],

  summary: 'Get bus by id',

  security: [
    {
      bearerAuth: [],
    },
  ],

  request: {
    params: busIdParamsSchema,
  },

  responses: {
    200: {
      description: 'Bus fetched successfully',

      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean(),

            data: busSchema,
          }),
        },
      },
    },

    404: {
      description: 'Bus not found',
    },
  },
});

// ======================================================
// POST /buses
// ======================================================

registry.registerPath({
  method: 'post',

  path: '/buses',

  tags: ['Buses'],

  summary: 'Create new bus',

  security: [
    {
      bearerAuth: [],
    },
  ],

  request: {
    body: {
      required: true,

      content: {
        'application/json': {
          schema: createBusSchema,

          example: {
            name: 'KSRTC Express',

            busNumber: 'KA01AB1234',

            type: 'AC Sleeper',

            totalSeats: 40,
          },
        },
      },
    },
  },

  responses: {
    201: {
      description: 'Bus created successfully',

      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean(),

            data: busSchema,
          }),
        },
      },
    },

    400: {
      description: 'Validation error',
    },
  },
});

// ======================================================
// PATCH /buses/{id}
// ======================================================

registry.registerPath({
  method: 'patch',

  path: '/buses/{id}',

  tags: ['Buses'],

  summary: 'Update bus',

  security: [
    {
      bearerAuth: [],
    },
  ],

  request: {
    params: busIdParamsSchema,

    body: {
      required: true,

      content: {
        'application/json': {
          schema: updateBusSchema,

          example: {
            name: 'Updated KSRTC Express',

            totalSeats: 45,
          },
        },
      },
    },
  },

  responses: {
    200: {
      description: 'Bus updated successfully',

      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean(),

            data: busSchema,
          }),
        },
      },
    },

    400: {
      description: 'Validation error',
    },

    404: {
      description: 'Bus not found',
    },
  },
});

// ======================================================
// DELETE /buses/{id}
// ======================================================

registry.registerPath({
  method: 'delete',

  path: '/buses/{id}',

  tags: ['Buses'],

  summary: 'Delete bus',

  security: [
    {
      bearerAuth: [],
    },
  ],

  request: {
    params: busIdParamsSchema,
  },

  responses: {
    200: {
      description: 'Bus deleted successfully',

      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean(),

            message: z.string(),
          }),

          example: {
            success: true,

            message: 'Bus deleted successfully',
          },
        },
      },
    },

    404: {
      description: 'Bus not found',
    },
  },
});
