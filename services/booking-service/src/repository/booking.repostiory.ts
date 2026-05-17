import { type WhereOptions } from 'sequelize';

import { BookingModel } from '../db/models/booking.model.js';

import { Booking, CreateBookingInput, UpdateBookingInput } from '../types/booking.js';

const toDomainBooking = (model: BookingModel): Booking => ({
  id: model.id,
  userId: model.userId,
  tripId: model.tripId,
  seatCount: model.seatCount,
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

  async findAll(): Promise<Booking[]> {
    const bookings = await BookingModel.findAll({
      order: [['createdAt', 'DESC']],
    });

    return bookings.map(toDomainBooking);
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

  async search(params: { userId?: string; tripId?: string; status?: string }): Promise<Booking[]> {
    const where: WhereOptions = {};

    if (params.userId) {
      Object.assign(where, {
        userId: params.userId,
      });
    }

    if (params.tripId) {
      Object.assign(where, {
        tripId: params.tripId,
      });
    }

    if (params.status) {
      Object.assign(where, {
        status: params.status,
      });
    }

    const bookings = await BookingModel.findAll({
      where,
      order: [['createdAt', 'DESC']],
    });

    return bookings.map(toDomainBooking);
  }

  async cancelBooking(id: string): Promise<Booking | null> {
    const booking = await BookingModel.findByPk(id);

    if (!booking) {
      return null;
    }

    await booking.update({
      status: 'CANCELLED',
    });

    return toDomainBooking(booking);
  }
}

export const bookingRepository = new BookingRepository();
