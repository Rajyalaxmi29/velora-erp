import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/database';
import { env } from '../config/env';
import { BadRequestError, UnauthorizedError, ConflictError } from '../utils/AppError';
import { z } from 'zod';
import { registerSchema, loginSchema } from '../validators/auth.validator';

type RegisterInput = z.infer<typeof registerSchema>;
type LoginInput = z.infer<typeof loginSchema>;

export const authService = {
  /**
   * Register a new user profile.
   */
  register: async (input: RegisterInput) => {
    const existing = await prisma.user.findUnique({ where: { email: input.email } });
    if (existing) {
      throw new ConflictError('Email address is already registered.');
    }

    const passwordHash = await bcrypt.hash(input.password, 10);

    const user = await prisma.user.create({
      data: {
        email: input.email,
        passwordHash,
        name: input.name,
        role: input.role as any,
      },
    });

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  },

  /**
   * Log in user and generate JWT session tokens.
   */
  login: async (input: LoginInput) => {
    const user = await prisma.user.findUnique({ where: { email: input.email } });
    if (!user) {
      throw new UnauthorizedError('Invalid email or password.');
    }

    const isValid = await bcrypt.compare(input.password, user.passwordHash);
    if (!isValid) {
      throw new UnauthorizedError('Invalid email or password.');
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, name: user.name, role: user.role },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN } as any
    );

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  },

  /**
   * Fetch authenticated user details.
   */
  getProfile: async (userId: string) => {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });
    if (!user) {
      throw new UnauthorizedError('User profile not found.');
    }
    return user;
  },
};
