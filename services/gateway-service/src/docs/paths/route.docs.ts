import { z } from 'zod';

import { registry } from '../registry';

import {
  createRouteSchema,
  listRoutesQuerySchema,
  routeIdParamsSchema,
  searchRoutesQuerySchema,
  updateRouteSchema,
} from '../../validation/routes.schema';

// ======================================================
// SHARED SCHEMA
// ======================================================

const routeSchema = z.object({
  id: z.string().uuid(),

  source: z.string(),

  destination: z.string(),

  distanceKm: z.number(),

  durationMinutes: z.number(),

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
// GET /routes
// ======================================================

registry.registerPath({
  method: 'get',

  path: '/routes',

  tags: ['Routes'],

  summary: 'Get all routes',

   request: {
      query: listRoutesQuerySchema,
    },

  responses: {
    200: {
      description: 'Routes fetched successfully',

      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean(),

            data: z.array(routeSchema),
            pagination: paginationMetaSchema,
          }),
        },
      },
    },
  },
});

// ======================================================
// GET /routes/search
// ======================================================

registry.registerPath({
  method: 'get',

  path: '/routes/search',

  tags: ['Routes'],

  summary: 'Search routes',

  request: {
    query: searchRoutesQuerySchema,
  },

  responses: {
    200: {
      description: 'Routes search result',

      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean(),

            data: z.array(routeSchema),
            pagination: paginationMetaSchema,
          }),
        },
      },
    },
  },
});

// ======================================================
// GET /routes/sources
// ======================================================

registry.registerPath({
  method: 'get',

  path: '/routes/sources',

  tags: ['Routes'],

  summary: 'Get available route sources',

  responses: {
    200: {
      description: 'Sources fetched successfully',

      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean(),

            data: z.array(z.string()),
          }),

          example: {
            success: true,

            data: ['Bangalore', 'Mysore', 'Chennai'],
          },
        },
      },
    },
  },
});

// ======================================================
// GET /routes/destinations
// ======================================================

registry.registerPath({
  method: 'get',

  path: '/routes/destinations',

  tags: ['Routes'],

  summary: 'Get available route destinations',


  responses: {
    200: {
      description: 'Destinations fetched successfully',

      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean(),

            data: z.array(z.string()),
          }),

          example: {
            success: true,

            data: ['Bangalore', 'Mysore', 'Chennai'],
          },
        },
      },
    },
  },
});

// ======================================================
// GET /routes/{id}
// ======================================================

registry.registerPath({
  method: 'get',

  path: '/routes/{id}',

  tags: ['Routes'],

  summary: 'Get route by id',

  request: {
    params: routeIdParamsSchema,
  },

  responses: {
    200: {
      description: 'Route fetched successfully',

      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean(),

            data: routeSchema,
          }),
        },
      },
    },

    404: {
      description: 'Route not found',
    },
  },
});

// ======================================================
// POST /routes
// ======================================================

registry.registerPath({
  method: 'post',

  path: '/routes',

  tags: ['Routes'],

  summary: 'Create new route',

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
          schema: createRouteSchema,

          example: {
            source: 'Bangalore',

            destination: 'Mysore',

            distanceKm: 145,

            durationMinutes: 180,
          },
        },
      },
    },
  },

  responses: {
    201: {
      description: 'Route created successfully',

      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean(),

            data: routeSchema,
          }),
        },
      },
    },
  },
});

// ======================================================
// PATCH /routes/{id}
// ======================================================

registry.registerPath({
  method: 'patch',

  path: '/routes/{id}',

  tags: ['Routes'],

  summary: 'Update route',

  security: [
    {
      bearerAuth: [],
    },
  ],

  request: {
    params: routeIdParamsSchema,

    body: {
      required: true,

      content: {
        'application/json': {
          schema: updateRouteSchema,

          example: {
            distanceKm: 160,
            source: 'Bangalore',
            destination: 'Mysore',
            durationMinutes: 200,
          },
        },
      },
    },
  },

  responses: {
    200: {
      description: 'Route updated successfully',

      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean(),

            data: routeSchema,
          }),
        },
      },
    },
  },
});

// ======================================================
// DELETE /routes/{id}
// ======================================================

registry.registerPath({
  method: 'delete',

  path: '/routes/{id}',

  tags: ['Routes'],

  summary: 'Delete route',

  security: [
    {
      bearerAuth: [],
    },
  ],

  request: {
    params: routeIdParamsSchema,
  },

  responses: {
    200: {
      description: 'Route deleted successfully',

      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean(),

            message: z.string(),
          }),

          example: {
            success: true,

            message: 'Route deleted successfully',
          },
        },
      },
    },
  },
});
