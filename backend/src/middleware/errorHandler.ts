import { Request, Response, NextFunction } from 'express';
import { AppError } from '../types/errors';

interface ErrorResponse {
  status: 'error';
  message: string;
  timestamp: string;
  path: string;
  stack?: string;
  context?: Record<string, unknown>;
}

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void => {
  const timestamp = new Date().toISOString();
  const path = req.originalUrl;

  // Log error with context
  console.error('Error occurred:', {
    name: error.name,
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp,
    body: req.body,
    params: req.params,
    query: req.query
  });

  if (error instanceof AppError) {
    const response: ErrorResponse = {
      status: 'error',
      message: error.message,
      timestamp,
      path,
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
      ...(error.context && { context: error.context })
    };

    res.status(error.statusCode).json(response);
    return;
  }

  // Handle known error types
  if (error.name === 'CastError') {
    res.status(400).json({
      status: 'error',
      message: 'Invalid ID format',
      timestamp,
      path
    });
    return;
  }

  if (error.name === 'ValidationError') {
    res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      timestamp,
      path,
      ...(process.env.NODE_ENV === 'development' && { details: error.message })
    });
    return;
  }

  // Unhandled errors
  const response: ErrorResponse = {
    status: 'error',
    message: process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : error.message,
    timestamp,
    path,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  };

  res.status(500).json(response);
};

export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    status: 'error',
    message: `Route ${req.method} ${req.originalUrl} not found`,
    timestamp: new Date().toISOString(),
    path: req.originalUrl
  });
};

// Async error wrapper
export const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};