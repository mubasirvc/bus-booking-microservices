import { z } from '@bus-booking/common';

export const createBusSchema = z.object({
  name: z.string().trim().min(2).max(255),

  busNumber: z.string().trim().min(3).max(50),

  type: z.string().trim().min(2).max(100),

  totalSeats: z
    .union([z.string(), z.number()])
    .transform((value) => Number(value))
    .refine((value) => Number.isInteger(value) && value > 0, {
      message: 'Total seats must be greater than zero',
    }),
});

export const updateBusSchema = z
  .object({
    name: z.string().trim().min(2).max(255).optional(),

    busNumber: z.string().trim().min(3).max(50).optional(),

    type: z.string().trim().min(2).max(100).optional(),

    totalSeats: z
      .union([z.string(), z.number()])
      .transform((value) => Number(value))
      .refine((value) => Number.isInteger(value) && value > 0, {
        message: 'Total seats must be greater than zero',
      })
      .optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field is required',
  });

export const busIdParamsSchema = z.object({
  id: z.string().uuid(),
});

export const searchBusesQuerySchema = z.object({
  name: z.string().trim().min(1).optional(),

  type: z.string().trim().min(1).optional(),

  page: z.union([z.string(), z.number()]).optional(),

  limit: z.union([z.string(), z.number()]).optional(),
});

export const listBusQuerySchema = z.object({
  page: z.union([z.string(), z.number()]).optional(),
  limit: z.union([z.string(), z.number()]).optional(),
});

export const getAllBusesQuerySchema = z.object({
  page: z.union([z.string(), z.number()]).optional(),

  limit: z.union([z.string(), z.number()]).optional(),
});

export type CreateBusBody = z.infer<typeof createBusSchema>;

export type UpdateBusBody = z.infer<typeof updateBusSchema>;

export type BusIdParams = z.infer<typeof busIdParamsSchema>;

export type SearchBusesQuery = z.infer<typeof searchBusesQuerySchema>;

export type GetAllBusesQuery = z.infer<typeof getAllBusesQuerySchema>;

export type ListBusQuery = z.infer<typeof listBusQuerySchema>;
