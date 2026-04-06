import type { NextFunction, Request, Response } from 'express';
// import { type NextFunction, type Request, type Response } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config/index.js';
import User from '../models/User.js';

interface ITokenPayload {
  id: string;
  role: string;
}

export const auth = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

      if (!token) {
        return res.status(401).json({ message: 'Unauthorized access' });
      }

      const decoded = jwt.verify(token, config.jwt_secret as string) as ITokenPayload;
      const user = await User.findById(decoded.id);

      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }

      if (roles.length && !roles.includes(user.role)) {
        return res.status(403).json({ message: 'Forbidden access' });
      }

      (req as any).user = user;
      next();
    } catch (error) {
      res.status(401).json({ message: 'Invalid token' });
    }
  };
};
