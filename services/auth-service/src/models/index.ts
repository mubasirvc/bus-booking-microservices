import { sequelize } from "../db/sequelize.js";
import { UserCredentials } from "./user-credentials.model.js";
import { RefreshToken } from "./refresh-token.model.js";

export const initModels = async () => {
  await sequelize.sync();
};

export { UserCredentials, RefreshToken };
