import { CreateUserInput, User } from '../types/user.js';
import { AuthUserRegisteredPayload } from '@bus-booking/common';

import { UserModel } from '../db/models/user.model.js';

export class UserRepository {
  async findById(id: string): Promise<User | null> {
    return await UserModel.findOne({
      id,
    }).lean();
  }

  async findAll(): Promise<User[]> {
    return await UserModel.find()
      .sort({
        userName: 1,
      })
      .lean();
  }

  async create(data: CreateUserInput): Promise<User> {
    return await UserModel.create(data);
  }

  async searchByQuery(
    query: string,
    options: {
      limit?: number;
      excludeIds?: string[];
    } = {},
  ): Promise<User[]> {
    const filter: any = {
      $or: [
        {
          userName: {
            $regex: query,
            $options: 'i',
          },
        },
        {
          email: {
            $regex: query,
            $options: 'i',
          },
        },
      ],
    };

    if (options.excludeIds?.length) {
      filter.id = {
        $nin: options.excludeIds,
      };
    }

    return await UserModel.find(filter)
      .sort({
        userName: 1,
      })
      .limit(options.limit ?? 10)
      .lean();
  }

  async upsertFromAuthEvent(payload: AuthUserRegisteredPayload): Promise<User> {
    return await UserModel.findOneAndUpdate(
      {
        id: payload.id,
      },
      {
        email: payload.email,
        userName: payload.userName,
      },
      {
        upsert: true,
        new: true,
      },
    ).lean();
  }
}

export const userRepository = new UserRepository();
