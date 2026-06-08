import { z } from '@bus-booking/common';

// ======================================================
// CREATE BUS
// ======================================================

export const createBusSchema = z.object({
  name: z.string().trim().min(2).max(255).openapi({
    example: 'KSRTC Express',
  }),

  busNumber: z.string().trim().min(3).max(50).openapi({
    example: 'KA01AB1234',
  }),

  type: z.string().trim().min(2).max(100).openapi({
    example: 'AC Sleeper',
  }),

  totalSeats: z.coerce.number().int().positive().openapi({
    example: 40,
  }),
});

// ======================================================
// UPDATE BUS
// ======================================================

export const updateBusSchema = z
  .object({
    name: z.string().trim().min(2).max(255).optional().openapi({
      example: 'Updated KSRTC Express',
    }),

    busNumber: z.string().trim().min(3).max(50).optional().openapi({
      example: 'KA01AB1234',
    }),

    type: z.string().trim().min(2).max(100).optional().openapi({
      example: 'Non AC Sleeper',
    }),

    totalSeats: z.coerce.number().int().positive().optional().openapi({
      example: 45,
    }),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field is required',
  });

// ======================================================
// PARAMS
// ======================================================

export const busIdParamsSchema = z.object({
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

export const searchBusesQuerySchema = z.object({
  name: z.string().trim().min(1).optional().openapi({
    example: 'KSRTC',
  }),

  type: z.string().trim().min(1).optional().openapi({
    example: 'AC Sleeper',
  }),

  page: z.coerce.number().int().positive().optional().openapi({
    example: 1,
  }),

  limit: z.coerce.number().int().positive().optional().openapi({
    example: 10,
  }),
});

export const listBusQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().openapi({
    example: 1,
  }),

  limit: z.coerce.number().int().positive().optional().openapi({
    example: 10,
  }),
});

// ======================================================
// TYPES
// ======================================================

export type CreateBusBody = z.infer<typeof createBusSchema>;

export type UpdateBusBody = z.infer<typeof updateBusSchema>;

export type BusIdParams = z.infer<typeof busIdParamsSchema>;

export type SearchBusesQuery = z.infer<typeof searchBusesQuerySchema>;
