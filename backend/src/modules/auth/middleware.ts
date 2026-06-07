import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'servicepratic-secret';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
    nome: string;
  };
}

export function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token não informado' });
  }

  const token = authHeader.slice(7);

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
    req.user = {
      id: Number(decoded.sub),
      email: String(decoded.email ?? ''),
      nome: String(decoded.nome ?? ''),
    };
    return next();
  } catch {
    return res.status(401).json({ message: 'Token inválido ou expirado' });
  }
}
