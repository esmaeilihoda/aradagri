import { Request, Response, NextFunction } from 'express';
import { authService } from './auth.service.js';
import { asyncHandler } from '../../core/middleware/error.js';

export class AuthController {
  register = asyncHandler(async (req: Request, res: Response) => {
    const { email, name, password } = req.body;
    const result = await authService.register(email, name, password);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: result,
    });
  });

  login = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const result = await authService.login(email, password);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: result,
    });
  });

  refreshToken = asyncHandler(async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    const result = await authService.refreshAccessToken(refreshToken);

    res.status(200).json({
      success: true,
      message: 'Token refreshed successfully',
      data: result,
    });
  });

  updateProfile = asyncHandler(async (req: Request, res: Response) => {
    const { name, email } = req.body;
    const result = await authService.updateProfile(req.userId!, name, email);

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: result,
    });
  });

  changePassword = asyncHandler(async (req: Request, res: Response) => {
    const { oldPassword, newPassword } = req.body;
    const result = await authService.changePassword(req.userId!, oldPassword, newPassword);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  });

  logout = asyncHandler(async (req: Request, res: Response) => {
    res.status(200).json({
      success: true,
      message: 'Logout successful',
    });
  });
}

export const authController = new AuthController();
