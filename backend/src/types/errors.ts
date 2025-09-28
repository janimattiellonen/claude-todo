export abstract class AppError extends Error {
  abstract statusCode: number;
  abstract isOperational: boolean;

  constructor(message: string, public context?: Record<string, unknown>) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class TodoNotFoundError extends AppError {
  statusCode = 404;
  isOperational = true;

  constructor(id: number) {
    super(`Todo with id ${id} not found`);
  }
}

export class ValidationError extends AppError {
  statusCode = 400;
  isOperational = true;

  constructor(message: string, context?: Record<string, unknown>) {
    super(message, context);
  }
}

export class DatabaseError extends AppError {
  statusCode = 500;
  isOperational = false;

  constructor(message: string, public originalError?: Error) {
    super(message, { originalError: originalError?.message });
  }
}

export class NotFoundError extends AppError {
  statusCode = 404;
  isOperational = true;

  constructor(resource: string) {
    super(`${resource} not found`);
  }
}

export class ConflictError extends AppError {
  statusCode = 409;
  isOperational = true;

  constructor(message: string) {
    super(message);
  }
}

export class UnauthorizedError extends AppError {
  statusCode = 401;
  isOperational = true;

  constructor(message: string = 'Unauthorized') {
    super(message);
  }
}

export class ForbiddenError extends AppError {
  statusCode = 403;
  isOperational = true;

  constructor(message: string = 'Forbidden') {
    super(message);
  }
}