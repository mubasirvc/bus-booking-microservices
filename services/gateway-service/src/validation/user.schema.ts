import { z } from '@bus-booking/common';

export const createUserSchema = z.object({
  email: z.string().email().openapi({
    example: 'john@example.com',
  }),

  userName: z.string().min(3).max(255).openapi({
    example: 'john_doe',
  }),
});

// export const createUserSchema = z.object({
//   email: z.string().email(),
//   userName: z.string().min(3).max(255),
// });

export const userIdParamsSchema = z.object({
  id: z.string().uuid(),
});

const excludeSchema = z.union([
  z.array(z.string().uuid()),
  z
    .string()
    .uuid()
    .transform((value) => [value])
    .optional()
    .transform((value) => value ?? []),
]);

export const searchUsersQuerySchema = z.object({
  query: z.string().trim().min(3).max(255),
  limit: z
    .union([z.string(), z.number()])
    .transform((value) => Number())
    .refine((value) => Number.isInteger(value) && value > 0 && value <= 25, {
      message: 'Limit must be between 1 and 25',
    })
    .optional(),
  exclude: excludeSchema,
});

export type SearchUsersQuery = z.infer<typeof searchUsersQuerySchema>;
