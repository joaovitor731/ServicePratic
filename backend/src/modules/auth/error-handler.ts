import type { NextFunction, Request, Response } from 'express';
import { AuthError } from './errors.js';

export function isAuthError(error: unknown): error is AuthError {
  return error instanceof AuthError;
}

export function handleAuthError(error: unknown, _req: Request, res: Response, next: NextFunction) {
  if (isAuthError(error)) {
    return res.status(401).json({ message: error.message });
  }

  return next(error);
}
