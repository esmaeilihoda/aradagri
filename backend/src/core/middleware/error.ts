import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/errors.js';

export function errorHandler(err: Error | ApiError, req: Request, res: Response, next: NextFunction): void {
  console.error('Error:', err);

  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      success: false,
      error: err.message,
      statusCode: err.statusCode,
    });
    return;
  }

  res.status(500).json({
    success: false,
    error: 'Internal server error',
    statusCode: 500,
  });
}

export function asyncHandler<T extends (...args: any[]) => any>(fn: T) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
