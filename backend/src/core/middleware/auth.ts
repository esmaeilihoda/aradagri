import { Request, Response, NextFunction } from 'express';
import { jwtUtils } from '../utils/jwt.js';
import { UnauthorizedError, ForbiddenError } from '../utils/errors.js';

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      userEmail?: string;
      userRole?: string;
    }
  }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return next(new UnauthorizedError('No token provided'));
  }

  try {
    const decoded = jwtUtils.verifyToken(token);
    req.userId = decoded.userId;
    req.userEmail = decoded.email;
    req.userRole = decoded.role;
    next();
  } catch (error) {
    next(new UnauthorizedError('Invalid or expired token'));
  }
}

export function roleMiddleware(allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.userRole || !allowedRoles.includes(req.userRole)) {
      return next(new ForbiddenError('Insufficient permissions'));
    }
    next();
  };
}

export const adminOnly = roleMiddleware(['ADMIN']);
export const staffOrAdmin = roleMiddleware(['ADMIN', 'STAFF']);
export const customerOrHigher = roleMiddleware(['ADMIN', 'STAFF', 'CUSTOMER']);
