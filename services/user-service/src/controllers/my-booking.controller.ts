import { Request, Response } from 'express';
import { AsyncHandler } from '@bus-booking/common';
import { myBookingService } from '../services/my-booking.service.js';

export const getMyBookings: AsyncHandler = async (req: Request, res: Response) => {
  const userId = req.headers['x-user-id'] as string

  const status = req.query.status as string;

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const result = await myBookingService.getMyBookings(userId, status, page, limit);

  res.status(200).json({
    success: true,
    data: result.bookings,
    pagination: result.pagination,
  });
};

export const getBookingDetails: AsyncHandler = async (req: Request, res: Response) => {
  const userId = req.headers['x-user-id'] as string

  const bookingId = req.params.bookingId as string;

  const booking = await myBookingService.getBookingDetails(userId, bookingId);

  res.status(200).json({
    success: true,
    data: booking,
  });
};
