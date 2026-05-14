import { z } from '@bus-booking/common';

export const createRouteSchema = z.object({
  source: z.string().trim().min(2).max(255),
  destination: z.string().trim().min(2).max(255),
  distanceKm: z
    .union([z.string(), z.number()])
    .transform((value) => Number(value))
    .refine((value) => Number.isFinite(value) && value > 0, {
      message: 'Distance must be greater than 0',
    }),
  durationMinutes: z
    .union([z.string(), z.number()])
    .transform((value) => Number(value))
    .refine((value) => Number.isInteger(value) && value > 0, {
      message: 'Duration must be greater than 0',
    }),
});

export const updateRouteSchema = createRouteSchema.partial();

export const routeIdParamsSchema = z.object({
  id: z.string().uuid(),
});

export const searchRoutesQuerySchema = z.object({
  query: z.string().trim().min(2).max(255),
});

export type CreateRouteBody = z.infer<typeof createRouteSchema>;

export type UpdateRouteBody = z.infer<typeof updateRouteSchema>;

export type RouteIdParams = z.infer<typeof routeIdParamsSchema>;

export type SearchRoutesQuery = z.infer<typeof searchRoutesQuerySchema>;
