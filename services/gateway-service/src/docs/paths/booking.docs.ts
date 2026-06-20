import { z } from 'zod';

import { registry } from '../registry';

import {
  bookingIdParamsSchema,
  bookingStatusEnum,
  createBookingSchema,
  getAllBookingsQuerySchema,
  searchBookingsQuerySchema,
  updateBookingSchema,
} from '../../validation/booking.schema';

// ======================================================
// SHARED SCHEMA
// ======================================================

const bookingSchema = z.object({
  id: z.string().uuid(),

  userId: z.string().uuid(),

  tripId: z.string().uuid(),

  seats: z.array(z.string().uuid()),

  totalAmount: z.number(),

  paymentOrderId: z.string(),
  
  status: bookingStatusEnum,

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
// GET /bookings
// ======================================================

registry.registerPath({
  method: 'get',

  path: '/bookings',

  tags: ['Bookings'],

  summary: 'Get all bookings',

  security: [
    {
      bearerAuth: [],
    },
  ],

  request: {
    query: getAllBookingsQuerySchema,
  },

  responses: {
    200: {
      description: 'Bookings fetched successfully',

      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean(),

            data: z.array(bookingSchema),
           
            pagination: paginationMetaSchema,
          }),
        },
      },
    },
  },
});

// ======================================================
// GET /bookings/search
// ======================================================

registry.registerPath({
  method: 'get',

  path: '/bookings/search',

  tags: ['Bookings'],

  summary: 'Search bookings',

  security: [
    {
      bearerAuth: [],
    },
  ],

  request: {
    query: searchBookingsQuerySchema,
  },

  responses: {
    200: {
      description: 'Booking search results',

      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean(),

            data: z.array(bookingSchema),
            pagination: paginationMetaSchema,
          }),
        },
      },
    },
  },
});

// ======================================================
// GET /bookings/user
// ======================================================

registry.registerPath({
  method: 'get',

  path: '/bookings/user',

  tags: ['Bookings'],

  summary: 'Get bookings by user',

  security: [
    {
      bearerAuth: [],
    },
  ],

  request: {
    query: searchBookingsQuerySchema,
  },

  responses: {
    200: {
      description: 'User bookings fetched successfully',

      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean(),

            data: z.array(bookingSchema),
            pagination: paginationMetaSchema,
          }),
        },
      },
    },
  },
});

// ======================================================
// GET /bookings/{id}
// ======================================================

registry.registerPath({
  method: 'get',

  path: '/bookings/{id}',

  tags: ['Bookings'],

  summary: 'Get booking by id',

  security: [
    {
      bearerAuth: [],
    },
  ],

  request: {
    params: bookingIdParamsSchema,
  },

  responses: {
    200: {
      description: 'Booking fetched successfully',

      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean(),

            data: bookingSchema,
          }),
        },
      },
    },

    404: {
      description: 'Booking not found',
    },
  },
});

// ======================================================
// POST /bookings
// ======================================================

registry.registerPath({
  method: 'post',

  path: '/bookings',

  tags: ['Bookings'],

  summary: 'Create booking',

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
          schema: createBookingSchema,

          example: {
            tripId: '660e8400-e29b-41d4-a716-446655440000',

            seats: ['s1', 's2'],

            totalAmount: 2400,
          },
        },
      },
    },
  },

  responses: {
    201: {
      description: 'Booking created successfully',

      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean(),

            data: bookingSchema,
          }),
        },
      },
    },
  },
});

// ======================================================
// PATCH /bookings/{id}
// ======================================================

// registry.registerPath({
//   method: 'patch',

//   path: '/bookings/{id}',

//   tags: ['Bookings'],

//   summary: 'Update booking',

//   security: [
//     {
//       bearerAuth: [],
//     },
//   ],

//   request: {
//     params: bookingIdParamsSchema,

//     body: {
//       required: true,

//       content: {
//         'application/json': {
//           schema: updateBookingSchema,

//           example: {
//             status: 'CONFIRMED',
//           },
//         },
//       },
//     },
//   },

//   responses: {
//     200: {
//       description: 'Booking updated successfully',

//       content: {
//         'application/json': {
//           schema: z.object({
//             success: z.boolean(),

//             data: bookingSchema,
//           }),
//         },
//       },
//     },
//   },
// });

// ======================================================
// PATCH /bookings/{id}/cancel
// ======================================================

registry.registerPath({
  method: 'patch',

  path: '/bookings/{id}/cancel',

  tags: ['Bookings'],

  summary: 'Cancel booking',

  security: [
    {
      bearerAuth: [],
    },
  ],

  request: {
    params: bookingIdParamsSchema,
  },

  responses: {
    200: {
      description: 'Booking cancelled successfully',

      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean(),

            message: z.string(),
          }),

          example: {
            success: true,

            message: 'Booking cancelled successfully',
          },
        },
      },
    },
  },
});

// ======================================================
// DELETE /bookings/{id}
// ======================================================

// registry.registerPath({
//   method: 'delete',

//   path: '/bookings/{id}',

//   tags: ['Bookings'],

//   summary: 'Delete booking',

//   security: [
//     {
//       bearerAuth: [],
//     },
//   ],

//   request: {
//     params: bookingIdParamsSchema,
//   },

//   responses: {
//     200: {
//       description: 'Booking deleted successfully',

//       content: {
//         'application/json': {
//           schema: z.object({
//             success: z.boolean(),

//             message: z.string(),
//           }),

//           example: {
//             success: true,

//             message: 'Booking deleted successfully',
//           },
//         },
//       },
//     },
//   },
// });
