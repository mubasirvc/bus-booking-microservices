import { z } from '@bus-booking/common';

// ======================================================
// ENUMS
// ======================================================

export const bookingStatusEnum = z.enum(['PENDING', 'CONFIRMED', 'CANCELLED']);

// ======================================================
// CREATE BOOKING
// ======================================================

export const createBookingSchema = z.object({
  userId: z.string().uuid().openapi({
    example: '550e8400-e29b-41d4-a716-446655440000',
  }),

  tripId: z.string().uuid().openapi({
    example: '660e8400-e29b-41d4-a716-446655440000',
  }),

  seats: z.array(z.string()).min(1).openapi({
    example: ['s1', 's2'],
  }),

  totalAmount: z.coerce.number().positive().openapi({
    example: 2400,
  }),
}); 

// ======================================================
// UPDATE BOOKING
// ======================================================

export const updateBookingSchema = z
  .object({
    status: bookingStatusEnum.optional().openapi({
      example: 'CONFIRMED',
    }),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field is required',
  });

// ======================================================
// PARAMS
// ======================================================

export const bookingIdParamsSchema = z.object({
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

export const searchBookingsQuerySchema = z.object({
  tripId: z.string().uuid().optional().openapi({
    example: '660e8400-e29b-41d4-a716-446655440000',
  }),

  status: bookingStatusEnum.optional().openapi({
    example: 'CONFIRMED',
  }),

  page: z.coerce.number().positive().optional().openapi({
    example: 1,
  }),

  limit: z.coerce.number().positive().optional().openapi({
    example: 10,
  }),
});

export const  getAllBookingsQuerySchema = z.object({
  page: z.coerce.number().positive().optional().openapi({
    example: 1,
  }),

  limit: z.coerce.number().positive().optional().openapi({
    example: 10,
  }),
});

// ======================================================
// TYPES
// ======================================================

export type CreateBookingBody = z.infer<typeof createBookingSchema>;

export type UpdateBookingBody = z.infer<typeof updateBookingSchema>;

export type BookingIdParams = z.infer<typeof bookingIdParamsSchema>;

export type SearchBookingsQuery = z.infer<typeof searchBookingsQuerySchema>;3

export type GetAllBookingsQuery = z.infer<typeof getAllBookingsQuerySchema>;
