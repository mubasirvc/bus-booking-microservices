import { DataTypes, Model, Optional } from "sequelize";
import { Bus } from "../types/bus.types.js";
import { sequelize } from "../../../db/sequelize.js";


type BusCreationAttributes = Optional<
  Bus,
  "id" | "createdAt" | "updatedAt"
>;

export class BusModel
  extends Model<Bus, BusCreationAttributes>
  implements Bus
{
  declare id: string;
  declare name: string;
  declare busNumber: string;
  declare type: string;
  declare totalSeats: number;
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
    tableName: "buses",
  }
);