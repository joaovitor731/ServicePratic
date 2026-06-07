import bcrypt from 'bcryptjs';
import prisma from '../../infra/prisma/client.js';
import { AuthError } from './errors.js';
import { signToken } from './jwt.js';
import type { LoginDto } from './dtos/login.dto.js';

export class AuthService {
  async login(data: LoginDto) {
    const user = await prisma.usuario.findUnique({
      where: { email: data.email },
    });

    if (!user || !user.ativo) {
      throw new AuthError();
    }

    const isValid = await bcrypt.compare(data.senha, user.senha_hash);

    if (!isValid) {
      throw new AuthError();
    }

    const token = signToken({
      sub: String(user.id),
      email: user.email,
      nome: user.nome,
    });

    return {
      token,
      usuario: {
        id: user.id,
        nome: user.nome,
        email: user.email,
      },
    };
  }
}
