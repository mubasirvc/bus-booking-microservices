import { z } from 'zod';
import { HttpError } from '../errors/http-error';

import type { NextFunction, Request, Response } from 'express';
import { ZodObject, ZodError, ZodTypeAny } from 'zod';

type Schema = ZodObject | ZodTypeAny;
type ParamsRecord = Record<string, string>;
type QueryRecord = Record<string, unknown>;

export interface RequestValidationSchemas {
  body?: Schema;
  params?: Schema;
  query?: Schema;
}

const formattedError = (error: ZodError) =>
  error.issues.map((issue) => ({
    path: issue.path.join('.'),
    message: issue.message,
  }));

export const validateRequest = (schemas: RequestValidationSchemas) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log('Validating request with schemas:', schemas);

      res.locals.validated = {};

      if (schemas.body) {
        res.locals.validated.body = schemas.body.parse(req.body);
      }

      if (schemas.params) {
        res.locals.validated.params = schemas.params.parse(req.params);
      }

      if (schemas.query) {
        res.locals.validated.query = schemas.query.parse(req.query);
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        next(
          new HttpError(422, 'Validation Error', {
            issues: formattedError(error),
          }),
        );
        return;
      }

      next(error);
    }
  };
};
