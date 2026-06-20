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
      required: false,
    },
    busName: {
      type: String,
      required: false,
    },
    source: {
      type: String,
      required: false,
    },

    destination: {
      type: String,
      required: false,
    },

    reason: {
      type: String,
      required: false,
    },

    travelDate: {
      type: Date,
      required: false,
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
      enum: ['PENDING', 'CONFIRMED', 'CANCELLED', 'PAYMENT_AWAIT'],
      default: 'PENDING',
    },
  },
  {
    timestamps: true,
  },
);

export const MyBookingModel = mongoose.model('MyBooking', myBookingSchema);
