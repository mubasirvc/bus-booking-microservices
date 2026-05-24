import { DataTypes, Model } from 'sequelize';
import type { Optional } from 'sequelize';

import { sequelize } from '../sequelize.js';
import { Payment, PaymentStatus } from '../../types/payment.js';

export type PaymentCreationAttributes = Optional<
  Payment,
  'id' | 'status' | 'razorpayOrderId' | 'razorpayPaymentId' | 'createdAt' | 'updatedAt'
>;

export class PaymentModel extends Model<Payment, PaymentCreationAttributes> implements Payment {
  declare id: string;
  declare bookingId: string;
  declare userId: string;
  declare amount: number;
  declare currency: string;
  declare razorpayOrderId?: string;
  declare razorpayPaymentId?: string;
  declare status: PaymentStatus;
  declare createdAt: Date;
  declare updatedAt: Date;
}

PaymentModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },

    bookingId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },

    currency: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'INR',
    },

    razorpayOrderId: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    razorpayPaymentId: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    status: {
      type: DataTypes.ENUM('PENDING', 'SUCCESS', 'FAILED'),
      defaultValue: 'PENDING',
      allowNull: false,
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
    tableName: 'payments',
  },
);
