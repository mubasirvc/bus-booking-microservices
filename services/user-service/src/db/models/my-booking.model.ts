import mongoose from 'mongoose';

const myBookingSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },

    bookingId: {
      type: String,
      required: true,
      unique: true,
    },

    busId: {
      type: String,
      required: true,
    },
    busName: {
      type: String,
      required: true,
    },
    source: {
      type: String,
      required: true,
    },

    destination: {
      type: String,
      required: true,
    },

    travelDate: {
      type: Date,
      required: true,
    },

    seats: {
      type: [String],
      default: [],
    },

    totalPrice: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ['PENDING', 'CONFIRMED', 'CANCELLED'],
      default: 'PENDING',
    },
  },
  {
    timestamps: true,
  },
);

export const MyBookingModel = mongoose.model('MyBooking', myBookingSchema);
