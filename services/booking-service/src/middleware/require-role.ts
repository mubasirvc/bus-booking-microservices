import { HttpError, Role } from '@bus-booking/common';
import type { RequestHandler } from 'express';

export const requireRole =
  (...roles: Role[]): RequestHandler =>
  (req, _res, next) => {

    
    const userId = req.header('X-User-Id');
    const role = req.header('X-User-Role') as Role | undefined;

    console.log(userId, role, 'userid and roleeeeeeeeeeeeeee')

    if (!userId || !role) {
      return next(new HttpError(401, 'Unauthorized'));
    }

    req.user = {
      id: userId,
      role,
      email: ''
    };

    if (!roles.includes(role)) {
      return next(new HttpError(403, 'Forbidden'));
    }

    next();
  };