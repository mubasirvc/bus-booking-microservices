import { MyBookingModel } from '../db/index.js';

export class MyBookingRepository {
  async create(payload: any) {
    const booking = new MyBookingModel(payload);
    return await booking.save();
  }

  async findByUserId(userId: string, status?: string, page = 1, limit = 10) {
    const filter: any = {
      userId,
    };

    if (status) {
      filter.status = status;
    }

    const skip = (page - 1) * limit;

    const [bookings, total] = await Promise.all([
      MyBookingModel.find(filter)
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(limit)
        .lean(),

      MyBookingModel.countDocuments(filter),
    ]);

    return {
      bookings,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    };
  }

  async findByBookingId(userId: string, bookingId: string) {
    return await MyBookingModel.findOne({
      userId,
      bookingId,
    }).lean();
  }

  async updateBookingByStatus(bookingId: string, status: string) {
    return await MyBookingModel.findOneAndUpdate(
      {
        bookingId,
      },
      {
        status,
      },
      {
        new: true,
      },
    ).lean();
  }
}

export const myBookingRepository = new MyBookingRepository();
