import { z } from 'zod';

import { registry } from '../registry';

import {
  createTripSchema,
  listTripsQuerySchema,
  searchTripsQuerySchema,
  tripIdParamsSchema,
  tripStatusEnum,
  updateTripSchema,
} from '../../validation/trip.schema';

// ======================================================
// SHARED SCHEMA
// ======================================================

const tripSchema = z.object({
  id: z.string().uuid(),

  busId: z.string().uuid(),

  routeId: z.string().uuid(),

  travelDate: z.string(),

  departureTime: z.string(),

  arrivalTime: z.string(),

  fare: z.number(),

  status: tripStatusEnum,

  createdAt: z.string(),

  updatedAt: z.string(),
});

const paginationMetaSchema = z.object({
  page: z.number(),
  limit: z.number(),
  total: z.number(),
  totalPages: z.number(),
});

// ======================================================
// GET /trips
// ======================================================

registry.registerPath({
  method: 'get',

  path: '/trips',

  tags: ['Trips'],

  summary: 'Get all trips',


 request: {
    query: listTripsQuerySchema,
  },

  responses: {
    200: {
      description: 'Trips fetched successfully',

      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean(),

            data: z.array(tripSchema),
            pagination: paginationMetaSchema,
          }),
        },
      },
    },
  },
});

// ======================================================
// GET /trips/search
// ======================================================

registry.registerPath({
  method: 'get',

  path: '/trips/search',

  tags: ['Trips'],

  summary: 'Search trips',

  request: {
    query: searchTripsQuerySchema,
  },

  responses: {
    200: {
      description: 'Trips search result',

      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean(),

            data: z.array(tripSchema),

            pagination: paginationMetaSchema,
          }),
        },
      },
    },
  },
});

// ======================================================
// GET /trips/{id}
// ======================================================

registry.registerPath({
  method: 'get',

  path: '/trips/{id}',

  tags: ['Trips'],

  summary: 'Get trip by id',

  request: {
    params: tripIdParamsSchema,
  },

  responses: {
    200: {
      description: 'Trip fetched successfully',

      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean(),

            data: tripSchema,
          }),
        },
      },
    },

    404: {
      description: 'Trip not found',
    },
  },
});

// ======================================================
// POST /trips
// ======================================================

registry.registerPath({
  method: 'post',

  path: '/trips',

  tags: ['Trips'],

  summary: 'Create new trip',

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
          schema: createTripSchema,

          example: {
            busId: '550e8400-e29b-41d4-a716-446655440000',

            routeId: '660e8400-e29b-41d4-a716-446655440000',

            travelDate: '2026-05-20',

            departureTime: '2026-05-20T08:00:00Z',

            arrivalTime: '2026-05-20T16:00:00Z',

            fare: 1200,
          },
        },
      },
    },
  },

  responses: {
    201: {
      description: 'Trip created successfully',

      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean(),

            data: tripSchema,
          }),
        },
      },
    },
  },
});

// ======================================================
// PATCH /trips/{id}
// ======================================================

registry.registerPath({
  method: 'patch',

  path: '/trips/{id}',

  tags: ['Trips'],

  summary: 'Update trip',

  security: [
    {
      bearerAuth: [],
    },
  ],

  request: {
    params: tripIdParamsSchema,

    body: {
      required: true,

      content: {
        'application/json': {
          schema: updateTripSchema,
        },
      },
    },
  },

  responses: {
    200: {
      description: 'Trip updated successfully',

      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean(),

            data: tripSchema,
          }),
        },
      },
    },
  },
});

// ======================================================
// PATCH /trips/{id}/cancel
// ======================================================

registry.registerPath({
  method: 'patch',

  path: '/trips/{id}/cancel',

  tags: ['Trips'],

  summary: 'Cancel trip',

  security: [
    {
      bearerAuth: [],
    },
  ],

  request: {
    params: tripIdParamsSchema,
  },

  responses: {
    200: {
      description: 'Trip cancelled successfully',

      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean(),

            message: z.string(),
          }),

          example: {
            success: true,

            message: 'Trip cancelled successfully',
          },
        },
      },
    },
  },
});

// ======================================================
// DELETE /trips/{id}
// ======================================================

registry.registerPath({
  method: 'delete',

  path: '/trips/{id}',

  tags: ['Trips'],

  summary: 'Delete trip',

  security: [
    {
      bearerAuth: [],
    },
  ],

  request: {
    params: tripIdParamsSchema,
  },

  responses: {
    200: {
      description: 'Trip deleted successfully',

      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean(),

            message: z.string(),
          }),

          example: {
            success: true,

            message: 'Trip deleted successfully',
          },
        },
      },
    },
  },
});
