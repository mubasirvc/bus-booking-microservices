import { z } from '@bus-booking/common';

// ======================================================
// CREATE ROUTE
// ======================================================

export const createRouteSchema = z.object({
  source: z.string().trim().min(2).max(255).openapi({
    example: 'Bangalore',
  }),

  destination: z.string().trim().min(2).max(255).openapi({
    example: 'Mysore',
  }),

  distanceKm: z.coerce.number().positive().openapi({
    example: 145,
  }),

  durationMinutes: z.coerce.number().int().positive().openapi({
    example: 180,
  }),
});

// ======================================================
// UPDATE ROUTE
// ======================================================

export const updateRouteSchema = createRouteSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field is required',
  });

// ======================================================
// PARAMS
// ======================================================

export const routeIdParamsSchema = z.object({
  id: z
    .string()
    .uuid()
    .openapi({
      param: {
        name: 'id',
        in: 'path',
      },

      example: '550e8400-e29b-41d4-a716-446655440000',
    }),
});

// ======================================================
// SEARCH QUERY
// ======================================================

export const searchRoutesQuerySchema = z.object({
  query: z.string().trim().min(2).max(255).openapi({
    example: 'Bangalore',
  }),

  page: z.coerce.number().int().positive().default(1).openapi({
    example: 1,
  }), 

  limit: z.coerce.number().int().positive().max(100).default(10).openapi({
    example: 10,
  }),
});

export const listRoutesQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1).openapi({
    example: 1,
  }),

  limit: z.coerce.number().int().positive().max(100).default(10).openapi({
    example: 10,
  }),
});

// ======================================================
// TYPES
// ======================================================

export type CreateRouteBody = z.infer<typeof createRouteSchema>;

export type UpdateRouteBody = z.infer<typeof updateRouteSchema>;

export type RouteIdParams = z.infer<typeof routeIdParamsSchema>;

export type SearchRoutesQuery = z.infer<typeof searchRoutesQuerySchema>;

export type ListRoutesQuery = z.infer<typeof listRoutesQuerySchema>;