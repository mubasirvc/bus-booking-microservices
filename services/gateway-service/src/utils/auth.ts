import { HttpError, type AuthenticatedUser } from '@bus-booking/common';

import type { Request } from 'express';

export const getAuthenticatedUser = (req: Request): AuthenticatedUser => {
  if (!req.user) {
    throw new HttpError(401, 'Unauthorized');
  }

  return req.user;
};
