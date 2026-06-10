import { HttpError } from '@bus-booking/common';
import { RequestHandler } from 'express';


export const requireRole =
  (...roles: string[]): RequestHandler =>
  (req, _res, next) => {
    const user = req.user;

    if (!user) {
      return next(new HttpError(401, 'Unauthorized'));
    }

    if (!roles.includes(user.role!)) {
      return next(new HttpError(403, 'Forbidden'));
    }

    next();
  };