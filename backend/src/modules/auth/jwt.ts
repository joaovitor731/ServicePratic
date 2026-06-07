import jwt from 'jsonwebtoken';

interface TokenPayload {
  sub: string;
  email: string;
  nome: string;
}

const JWT_SECRET = process.env.JWT_SECRET || 'servicepratic-secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';

export function signToken(payload: TokenPayload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'] });
}
