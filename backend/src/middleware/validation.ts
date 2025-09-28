import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { ValidationError } from '../types/errors';

export const validateRequest = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = schema.parse({
        body: req.body,
        params: req.params,
        query: req.query
      });

      // Replace req with validated data
      Object.assign(req, result);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.issues.map((err: z.ZodIssue) => {
          const path = err.path.join('.');
          return `${path}: ${err.message}`;
        });

        const validationError = new ValidationError(
          `Validation failed: ${errorMessages.join(', ')}`,
          { validationErrors: error.issues }
        );
        next(validationError);
      } else {
        next(error);
      }
    }
  };
};