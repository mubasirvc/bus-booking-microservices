import { AsyncHandler } from '@bus-booking/common';
import { userProxyService } from '../services/user-proxy.service';
import { getAuthenticatedUser } from '../utils/auth';
import {
  createUserSchema,
  SearchUsersQuery,
  searchUsersQuerySchema,
  userIdParamsSchema,
} from '../validation/user.schema';

export const getUser: AsyncHandler = async (req, res, next) => {
  try {
    const { id } = userIdParamsSchema.parse(req.params);
    const user = getAuthenticatedUser(req);
    const response = await userProxyService.getUserById(id, user);
    res.json(response);
  } catch (error) {
    next(error);
  }
};

export const getAllUsers: AsyncHandler = async (req, res, next) => {
  try {
    const user = getAuthenticatedUser(req);
    const response = await userProxyService.getAllUsers(user);
    res.json(response);
  } catch (error) {
    next(error);
  }
};

export const createUser: AsyncHandler = async (req, res, next) => {
  try {
    const payload = createUserSchema.parse(req.body);
    const user = getAuthenticatedUser(req);
    const response = await userProxyService.createUser(payload, user);
    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

export const searchUsers: AsyncHandler = async (req, res, next) => {
  try {
    const user = getAuthenticatedUser(req);
    const parsedQuery: SearchUsersQuery = searchUsersQuerySchema.parse(req.query);
    const { query, limit, exclude } = parsedQuery;
    const sanitizedExclude = Array.from(new Set([...exclude, user.id]));

    const users = await userProxyService.searchUsers(
      {
        query,
        limit,
        exclude: sanitizedExclude,
      },
      user,
    );
    res.json({ data: users });
  } catch (error) {
    next(error);
  }
};
export const getMyBookings: AsyncHandler = async (req, res, next) => {
  try {
    const user = getAuthenticatedUser(req);

    const response = await userProxyService.getMyBookings(
      {
        status: req.query.status as string,
        page: Number(req.query.page) || 1,
        limit: Number(req.query.limit) || 10,
      },
      user,
    );

    res.json(response);
  } catch (error) {
    next(error);
  }
};

export const getMyBookingDetails: AsyncHandler = async (req, res, next) => {
  try {
    const user = getAuthenticatedUser(req);
    const response = await userProxyService.getBookingDetails(req.params.bookingId as string, user);

    res.json(response);
  } catch (error) {
    next(error);
  }
};
