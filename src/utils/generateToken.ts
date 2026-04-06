import jwt from 'jsonwebtoken';
import config from '../config/index.js';

export const generateToken = (payload: object) => {
  return jwt.sign(payload, config.jwt_secret as string, {
    expiresIn: '7d',
  });
};
