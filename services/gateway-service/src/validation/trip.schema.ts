import { z } from '@bus-booking/common';

// ======================================================
// ENUMS
// ======================================================

export const tripStatusEnum = z.enum(['ACTIVE', 'CANCELLED', 'COMPLETED']);

// ======================================================
// CREATE TRIP
// ======================================================

export const createTripSchema = z.object({
  busId: z.string().uuid().openapi({
    example: '550e8400-e29b-41d4-a716-446655440000',
  }),

  routeId: z.string().uuid().openapi({
    example: '660e8400-e29b-41d4-a716-446655440000',
  }),

  travelDate: z.string().date().openapi({
    example: '2026-05-20',
  }),

  departureTime: z.string().datetime().openapi({
    example: '2026-05-20T08:00:00Z',
  }),

  arrivalTime: z.string().datetime().openapi({
    example: '2026-05-20T16:00:00Z',
  }),

  fare: z.coerce.number().positive().openapi({
    example: 1200,
  }),
});

// ======================================================
// UPDATE TRIP
// ======================================================

export const updateTripSchema = z
  .object({
    busId: z.string().uuid().optional().openapi({
      example: '550e8400-e29b-41d4-a716-446655440000',
    }),

    routeId: z.string().uuid().optional().openapi({
      example: '660e8400-e29b-41d4-a716-446655440000',
    }),

    travelDate: z.string().date().optional().openapi({
      example: '2026-05-20',
    }),

    departureTime: z.string().datetime().optional().openapi({
      example: '2026-05-20T08:00:00Z',
    }),

    arrivalTime: z.string().datetime().optional().openapi({
      example: '2026-05-20T16:00:00Z',
    }),

    fare: z.coerce.number().positive().optional().openapi({
      example: 1500,
    }),

    status: tripStatusEnum.optional().openapi({
      example: 'ACTIVE',
    }),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field is required',
  });

// ======================================================
// PARAMS
// ======================================================

export const tripIdParamsSchema = z.object({
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

export const searchTripsQuerySchema = z.object({
  routeId: z.string().uuid().optional().openapi({
    example: '660e8400-e29b-41d4-a716-446655440000',
  }),

  busId: z.string().uuid().optional().openapi({
    example: '550e8400-e29b-41d4-a716-446655440000',
  }),

  travelDate: z.string().date().optional().openapi({
    example: '2026-05-20',
  }),

  status: tripStatusEnum.optional().openapi({
    example: 'ACTIVE',
  }),

  page: z.string().optional().openapi({
    example: '1',
  }), 

  limit: z.string().optional().openapi({
    example: '10',
  }),
});

export const listTripsQuerySchema = z.object({
  page: z.string().optional().openapi({
    example: '1',
  }),

  limit: z.string().optional().openapi({
    example: '10',
  }),
});

// ======================================================
// TYPES
// ======================================================

export type CreateTripBody = z.infer<typeof createTripSchema>;

export type UpdateTripBody = z.infer<typeof updateTripSchema>;

export type TripIdParams = z.infer<typeof tripIdParamsSchema>;

export type SearchTripsQuery = z.infer<typeof searchTripsQuerySchema>;

export type ListTripsQuery = z.infer<typeof listTripsQuerySchema>;
