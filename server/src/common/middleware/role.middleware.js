import { ForbiddenException, UnauthorizedException } from '../errors/HttpException.js';

/**
 * Middleware to enforce role-based access control (RBAC).
 * @param  {...string} allowedRoles List of UserRole strings allowed to access the route
 */
export const requireRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new UnauthorizedException('User not authenticated'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new ForbiddenException('You do not have permission to perform this action'));
    }

    next();
  };
};
