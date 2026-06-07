import type { NextFunction, Request, Response } from 'express';
import { AuthService } from './auth.service.js';
import type { LoginDto } from './dtos/login.dto.js';

const authService = new AuthService();

export class AuthController {
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = req.body as LoginDto;
      const result = await authService.login(payload);
      return res.json(result);
    } catch (error) {
      return next(error);
    }
  }
}
