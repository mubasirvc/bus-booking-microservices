import { type WhereOptions } from 'sequelize';

import { BookingModel } from '../db/models/booking.model.js';
import {
  Booking,
  BookingStatus,
  CreateBookingInput,
  UpdateBookingInput,
} from '../types/booking.js';

const toDomainBooking = (model: BookingModel): Booking => ({
  id: model.id,
  userId: model.userId,
  tripId: model.tripId,
  seats: model.seats,
  totalAmount: Number(model.totalAmount),
  status: model.status,
  createdAt: model.createdAt,
  updatedAt: model.updatedAt,
});

export class BookingRepository {
  async findById(id: string): Promise<Booking | null> {
    const booking = await BookingModel.findByPk(id);

    return booking ? toDomainBooking(booking) : null;
  }

  async findAll(page: number, limit: number) {
    const offset = (page - 1) * limit;

    const result = await BookingModel.findAndCountAll({
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    return {
      data: result.rows.map(toDomainBooking),

      pagination: {
        page,
        limit,
        total: result.count,
        totalPages: Math.ceil(result.count / limit),
      },
    };
  }

  async create(data: CreateBookingInput): Promise<Booking> {
    const booking = await BookingModel.create(data);

    return toDomainBooking(booking);
  }

  async update(id: string, data: UpdateBookingInput): Promise<Booking | null> {
    const booking = await BookingModel.findByPk(id);

    if (!booking) {
      return null;
    }

    await booking.update(data);

    return toDomainBooking(booking);
  }

  async delete(id: string): Promise<boolean> {
    const deleted = await BookingModel.destroy({
      where: { id },
    });

    return deleted > 0;
  }

  async findByUserId(userId: string): Promise<Booking[]> {
    const bookings = await BookingModel.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
    });

    return bookings.map(toDomainBooking);
  }

  async search(params: {
    userId?: string;
    tripId?: string;
    status?: string;
    page?: number;
    limit?: number;
  }) {
    const where: WhereOptions = {};

    if (params.userId) {
      where.userId = params.userId;
    }

    if (params.tripId) {
      where.tripId = params.tripId;
    }

    if (params.status) {
      where.status = params.status;
    }

    const page = params.page || 1;
    const limit = params.limit || 10;

    const offset = (page - 1) * limit;

    const result = await BookingModel.findAndCountAll({
      where,
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    return {
      data: result.rows.map(toDomainBooking),

      pagination: {
        page,
        limit,
        total: result.count,
        totalPages: Math.ceil(result.count / limit),
      },
    };
  }

  async cancelBooking(id: string): Promise<Booking | null> {
    const booking = await BookingModel.findByPk(id);

    if (!booking) {
      return null;
    }

    await booking.update({
      status: BookingStatus.CANCELLED,
    });

    return toDomainBooking(booking);
  }

  async updateBookingStatus(id: string, status: BookingStatus): Promise<Booking | null> {
    const [affectedRows] = await BookingModel.update(
      { status },
      {
        where: {
          id,
          status: BookingStatus.PENDING,
        },
      },
    );

    if (affectedRows === 0) {
      return null;
    }

    const updated = await BookingModel.findByPk(id);

    return updated ? toDomainBooking(updated) : null;
  }
}

export const bookingRepository = new BookingRepository();
