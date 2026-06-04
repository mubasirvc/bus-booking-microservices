import { z } from '@bus-booking/common';

export const createBookingSchema = z.object({
  userId: z.string().uuid(),

  tripId: z.string().uuid(),

  seats: z.array(z.string()).min(1, {
    message: 'At least one seat must be booked',
  }),

  totalAmount: z
    .union([z.string(), z.number()])
    .transform((value) => Number(value))
    .refine((value) => value > 0, {
      message: 'Total amount must be greater than zero',
    }),
});

export const updateBookingSchema = z
  .object({
    status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED']).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field is required',
  });

export const bookingIdParamsSchema = z.object({
  id: z.string().uuid(),
});

export const searchBookingsQuerySchema = z.object({
  userId: z.string().uuid().optional(),

  tripId: z.string().uuid().optional(),

  status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED']).optional(),
});

export type CreateBookingBody = z.infer<typeof createBookingSchema>;

export type UpdateBookingBody = z.infer<typeof updateBookingSchema>;

export type BookingIdParams = z.infer<typeof bookingIdParamsSchema>;

export type SearchBookingsQuery = z.infer<typeof searchBookingsQuerySchema>;
