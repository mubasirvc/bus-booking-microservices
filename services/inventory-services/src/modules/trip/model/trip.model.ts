import { DataTypes, Model, type Optional } from 'sequelize';
import { sequelize } from '../../../db/sequelize.js';
import { BusModel } from '../../bus/index.js';
import { RouteModel } from '../../route/index.js';
import { Trip } from '../types/trip.types.js';


export type TripCreationAttributes = Optional<
  Trip,
  'id' | 'status' | 'createdAt' | 'updatedAt'
>;

export class TripModel
  extends Model<Trip, TripCreationAttributes>
  implements Trip
{
  declare id: string;
  declare busId: string;
  declare routeId: string;
  declare travelDate: string;
  declare departureTime: string;
  declare arrivalTime: string;
  declare fare: number;
  declare status: string;
  declare createdAt: Date;
  declare updatedAt: Date;
}

TripModel.init(
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    busId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'buses',
        key: 'id',
      },
    },
    routeId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'routes',
        key: 'id',
      },
    },
    travelDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    departureTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    arrivalTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    fare: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'ACTIVE',
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
    tableName: 'trips',
  },
);

// Relations
BusModel.hasMany(TripModel, {
  foreignKey: 'busId',
  as: 'trips',
});

TripModel.belongsTo(BusModel, {
  foreignKey: 'busId',
  as: 'bus',
});

RouteModel.hasMany(TripModel, {
  foreignKey: 'routeId',
  as: 'trips',
});

TripModel.belongsTo(RouteModel, {
  foreignKey: 'routeId',
  as: 'route',
});