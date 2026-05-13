import { asyncHandler, validateRequest } from '@bus-booking/common';
import { Router } from 'express';
import { requireAuth } from '../middleware/require-auth';
import { createUser, getAllUsers, getUser, searchUsers } from '../controllers/user.controller';
import { createUserSchema, searchUsersQuerySchema, userIdParamsSchema } from '../validation/user.schema';

export const userRouter: Router = Router();

userRouter.get('/', requireAuth, asyncHandler(getAllUsers));
userRouter.get('/search', requireAuth, validateRequest({ query: searchUsersQuerySchema }), asyncHandler(searchUsers));
userRouter.get('/:id', requireAuth, validateRequest({ params: userIdParamsSchema }), asyncHandler(getUser));
userRouter.post('/', validateRequest({ body: createUserSchema }), asyncHandler(createUser));
