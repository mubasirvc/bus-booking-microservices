import { DataTypes, Model, type Optional } from "sequelize";
import { sequelize } from "../db/sequelize.js";
import { UserRole } from "../types/auth.js";

export interface UserCredentialsAttributes {
  id: string;
  email: string;
  userName: string;
  passwordHash: string;
  role: UserRole;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type UserCredentialsCreationAttributes = Optional<
  UserCredentialsAttributes,
  "id" | "createdAt" | "updatedAt"
>;

export class UserCredentials
  extends Model<UserCredentialsAttributes, UserCredentialsCreationAttributes>
  implements UserCredentialsAttributes
{
  declare id: string;
  declare email: string;
  declare userName: string;
  declare passwordHash: string;
  declare role: UserRole;
  declare isVerified: boolean;
  declare createdAt: Date;
  declare updatedAt: Date;
}

UserCredentials.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("ADMIN", "USER", "OPERATOR"),
      allowNull: false,
      defaultValue: "USER",
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
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
    tableName: "user_credentials",
  },
);
