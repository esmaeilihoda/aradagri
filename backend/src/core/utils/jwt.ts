import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { config } from '../config/index.js';

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

export interface DecodedToken extends JwtPayload {
  iat?: number;
  exp?: number;
}

export const jwtUtils = {
  generateToken(payload: JwtPayload, expiresIn?: SignOptions['expiresIn']): string {
    const secret: Secret = config.jwtSecret;
    const expiration: SignOptions['expiresIn'] = expiresIn ?? (config.jwtExpiration as SignOptions['expiresIn']);
    return jwt.sign(payload, secret, { expiresIn: expiration });
  },

  generateRefreshToken(payload: JwtPayload, expiresIn?: SignOptions['expiresIn']): string {
    const secret: Secret = config.jwtRefreshSecret;
    const expiration: SignOptions['expiresIn'] = expiresIn ?? (config.jwtRefreshExpiration as SignOptions['expiresIn']);
    return jwt.sign(payload, secret, { expiresIn: expiration });
  },

  verifyToken(token: string): DecodedToken {
    try {
      return jwt.verify(token, config.jwtSecret as Secret) as DecodedToken;
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  },

  verifyRefreshToken(token: string): DecodedToken {
    try {
      return jwt.verify(token, config.jwtRefreshSecret as Secret) as DecodedToken;
    } catch (error) {
      throw new Error('Invalid or expired refresh token');
    }
  },

  decodeToken(token: string): DecodedToken | null {
    try {
      return jwt.decode(token) as DecodedToken;
    } catch {
      return null;
    }
  },
};
