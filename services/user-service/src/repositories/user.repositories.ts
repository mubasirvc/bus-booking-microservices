import { Op, type WhereOptions } from 'sequelize';

import { CreateUserInput, User } from '../types/user.js';
import { AuthUserRegisteredPayload } from '@bus-booking/common';
import { UserModel } from '../db/index.js';

const toDomainUser = (model: UserModel): User => ({
  id: model.id,
  email: model.email,
  userName: model.userName,
  createdAt: model.createdAt,
  updatedAt: model.updatedAt,
});

export class UserRepository {
  async findById(id: string): Promise<User | null> {
    const user = await UserModel.findByPk(id);
    return user ? toDomainUser(user) : null;
  }

  async findAll(): Promise<User[]> {
    const users = await UserModel.findAll({
      order: [['userName', 'ASC']],
    });
    return users.map(toDomainUser);
  }

  async create(data: CreateUserInput): Promise<User> {
    const user = await UserModel.create(data);
    return toDomainUser(user);
  }

  async searchByQuery(
    query: string,
    options: { limit?: number; excludeIds?: string[] } = {},
  ): Promise<User[]> {
    const where: WhereOptions = {
      [Op.or]: [
        { userName: { [Op.iLike]: `%${query}%` } },
        { email: { [Op.iLike]: `%${query}%` } },
      ],
    };

    if (options.excludeIds && options.excludeIds.length > 0) {
      Object.assign(where, {
        [Op.and]: [{ id: { [Op.notIn]: options.excludeIds } }],
      });
    }

    const users = await UserModel.findAll({
      where,
      order: [['userName', 'ASC']],
      limit: options.limit ?? 10,
    });

    return users.map(toDomainUser);
  }

  async upsertFromAuthEvent(payload: AuthUserRegisteredPayload): Promise<User> {
    const [user] = await UserModel.upsert(
      {
        id: payload.id,
        email: payload.email,
        userName: payload.userName,
        createdAt: new Date(payload.createdAt),
        updatedAt: new Date(payload.createdAt),
      },
      { returning: true },
    );

    return toDomainUser(user);
  }
}

export const userRepository = new UserRepository();
