import { DataTypes, Model, type Optional } from 'sequelize';
import { sequelize } from '../../../db/sequelize.js';
import { Route } from '../types/route.types.js';


export type RouteCreationAttributes = Optional<
  Route,
  'id' | 'createdAt' | 'updatedAt'
>;

export class RouteModel
  extends Model<Route, RouteCreationAttributes>
  implements Route
{
  declare id: string;
  declare source: string;
  declare destination: string;
  declare distanceKm: number;
  declare durationMinutes: number;
  declare createdAt: Date;
  declare updatedAt: Date;
}

RouteModel.init(
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    source: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    destination: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    distanceKm: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    durationMinutes: {
      type: DataTypes.INTEGER,
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
    tableName: 'routes',
  },
);