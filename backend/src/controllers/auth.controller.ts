import { Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { sendSuccess, sendCreated } from '../utils/response';
import { asyncHandler } from '../utils/asyncHandler';
import { AuthenticatedRequest } from '../types';

export const authController = {
  register: asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.register(req.body);
    sendCreated(res, result, 'User profile registered successfully.');
  }),

  login: asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.login(req.body);
    sendSuccess(res, result, 'Login successful.');
  }),

  getProfile: asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user!.userId;
    const profile = await authService.getProfile(userId);
    sendSuccess(res, profile, 'Profile fetched successfully.');
  }),
};
