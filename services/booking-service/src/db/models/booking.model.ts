import { DataTypes, Model, type Optional } from 'sequelize';

import { sequelize } from '../sequelize.js';

import { Booking, BookingStatus } from '../../types/booking.js';

export type BookingCreationAttributes = Optional<
  Booking,
  'id' | 'status' | 'createdAt' | 'updatedAt' | 'paymentOrderId'
>;

export class BookingModel extends Model<Booking, BookingCreationAttributes> implements Booking {
  declare id: string;
  declare userId: string;
  declare email: string;
  declare tripId: string;
  declare seats: string[];
  declare totalAmount: number;
  declare status: BookingStatus;
  declare paymentOrderId: string | null;
  declare createdAt: Date;
  declare updatedAt: Date;
}

BookingModel.init(
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },

    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    tripId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    seats: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },

    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },

    paymentOrderId: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    status: {
      type: DataTypes.ENUM('PENDING', 'CANCELLED', 'CONFIRMED', 'AWAITING_PAYMENT'),
      defaultValue: 'PENDING',
    },

    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },

    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'bookings',
  },
);
