import { z } from '@bus-booking/common';


export const createTripSchema = z.object({
  busId: z.string().uuid(),

  routeId: z.string().uuid(),

  travelDate: z.string().date(),

  departureTime: z.string().datetime(),

  arrivalTime: z.string().datetime(),

  fare: z
    .union([z.string(), z.number()])
    .transform((value) => Number(value))
    .refine((value) => value > 0, {
      message: 'Fare must be greater than zero',
    }),
});


export const updateTripSchema = z
  .object({
    busId: z.string().uuid().optional(),

    routeId: z.string().uuid().optional(),

    travelDate: z.string().date().optional(),

    departureTime: z.string().datetime().optional(),

    arrivalTime: z.string().datetime().optional(),

    fare: z
      .union([z.string(), z.number()])
      .transform((value) => Number(value))
      .refine((value) => value > 0, {
        message: 'Fare must be greater than zero',
      })
      .optional(),

    status: z.enum(['ACTIVE', 'CANCELLED', 'COMPLETED']).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field is required',
  });


export const tripIdParamsSchema = z.object({
  id: z.string().uuid(),
});


export const searchTripsQuerySchema = z.object({
  routeId: z.string().uuid().optional(),

  busId: z.string().uuid().optional(),

  travelDate: z.string().date().optional(),

  status: z.enum(['ACTIVE', 'CANCELLED', 'COMPLETED']).optional(),
});

export type CreateTripBody = z.infer<typeof createTripSchema>;

export type UpdateTripBody = z.infer<typeof updateTripSchema>;

export type TripIdParams = z.infer<typeof tripIdParamsSchema>;

export type SearchTripsQuery = z.infer<typeof searchTripsQuerySchema>;
