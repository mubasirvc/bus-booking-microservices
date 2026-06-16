import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../../db/sequelize.js';
import { BusWithSeats } from '../types/bus.types.js';

type BusCreationAttributes = Optional<
  BusWithSeats,
  'id' | 'createdAt' | 'updatedAt'
>;

export class BusModel
  extends Model<BusWithSeats, BusCreationAttributes>
  implements BusWithSeats
{
  declare id: string;
  declare name: string;
  declare operatorId: string;
  declare busNumber: string;
  declare type: string;
  declare totalSeats: number;
  declare seats: { seatNumber: string }[];
  declare createdAt: Date;
  declare updatedAt: Date;
}

BusModel.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    operatorId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    busNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    totalSeats: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    seats: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
    },

    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },

    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'buses',
  },
);