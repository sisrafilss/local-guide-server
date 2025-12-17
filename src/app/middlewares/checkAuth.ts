import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { Secret } from 'jsonwebtoken';
import config from '../../config';
import ApiError from '../errors/ApiError';
import { verifyToken } from '../utils/jwt';

const checkAuth = (...roles: string[]) => {
  return async (
    req: Request & { user?: any },
    res: Response,
    next: NextFunction
  ) => {
    try {
      const token = req.cookies.accessToken;
      if (!token) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Token not found!');
      }
      const verifyUser = verifyToken(token, config.jwt.jwt_secret as Secret);
      req.user = verifyUser;
      if (roles.length && !roles.includes(verifyUser.role)) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
      }
      next();
    } catch (err) {
      next(err);
    }
  };
};

export default checkAuth;
