import { PrismaClient } from '@prisma/client';
import { jwtUtils } from '../../core/utils/jwt.js';
import { passwordUtils } from '../../core/utils/password.js';
import { validateEmail, validatePassword } from '../../core/utils/helpers.js';
import { ValidationError, UnauthorizedError, ConflictError, NotFoundError } from '../../core/utils/errors.js';

const prisma = new PrismaClient();

export class AuthService {
  async register(email: string, name: string, password: string) {
    // Validate inputs
    if (!validateEmail(email)) {
      throw new ValidationError('Invalid email format');
    }

    if (!validatePassword(password)) {
      throw new ValidationError(
        'Password must be at least 8 characters with uppercase, lowercase, and number'
      );
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new ConflictError('Email already registered');
    }

    // Hash password
    const passwordHash = await passwordUtils.hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        name,
        passwordHash,
        role: 'CUSTOMER',
      },
    });

    // Generate tokens
    const token = jwtUtils.generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const refreshToken = jwtUtils.generateRefreshToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      token,
      refreshToken,
    };
  }

  async login(email: string, password: string) {
    // Find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // Verify password
    const isPasswordValid = await passwordUtils.comparePassword(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // Generate tokens
    const token = jwtUtils.generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const refreshToken = jwtUtils.generateRefreshToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      token,
      refreshToken,
    };
  }

  async refreshAccessToken(refreshToken: string) {
    const decoded = jwtUtils.verifyRefreshToken(refreshToken);

    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const newToken = jwtUtils.generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      token: newToken,
      refreshToken,
    };
  }

  async updateProfile(userId: string, name: string, email?: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundError('User not found');
    }

    if (email && email !== user.email) {
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        throw new ConflictError('Email already in use');
      }
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        ...(email && { email }),
      },
    });

    return {
      id: updated.id,
      email: updated.email,
      name: updated.name,
      role: updated.role,
    };
  }

  async changePassword(userId: string, oldPassword: string, newPassword: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const isPasswordValid = await passwordUtils.comparePassword(oldPassword, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid current password');
    }

    if (!validatePassword(newPassword)) {
      throw new ValidationError(
        'New password must be at least 8 characters with uppercase, lowercase, and number'
      );
    }

    const passwordHash = await passwordUtils.hashPassword(newPassword);

    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });

    return { message: 'Password changed successfully' };
  }
}

export const authService = new AuthService();
