import { Prisma } from '@prisma/client';
import prisma from '../../infra/prisma/client.js';
import type { CreateServicoDto } from './dtos/create-servico.dto.js';
import type { UpdateServicoDto } from './dtos/update-servico.dto.js';

function toDecimal(value: number | string) {
  return new Prisma.Decimal(value);
}

export class ServicosRepository {
  async findAll() {
    return prisma.servico.findMany({
      orderBy: [
        { ativo: 'desc' },
        { nome: 'asc' },
      ],
    });
  }

  async findById(id: number) {
    return prisma.servico.findUnique({
      where: { id },
    });
  }

  async create(data: CreateServicoDto) {
    return prisma.servico.create({
      data: {
        nome: data.nome,
        descricao: data.descricao,
        valor_padrao: toDecimal(data.valor_padrao),
        ativo: data.ativo ?? true,
      },
    });
  }

  async update(id: number, data: UpdateServicoDto) {
    return prisma.servico.update({
      where: { id },
      data: {
        ...(data.nome !== undefined ? { nome: data.nome } : {}),
        ...(data.descricao !== undefined ? { descricao: data.descricao } : {}),
        ...(data.valor_padrao !== undefined ? { valor_padrao: toDecimal(data.valor_padrao) } : {}),
        ...(data.ativo !== undefined ? { ativo: data.ativo } : {}),
      },
    });
  }

  async deactivate(id: number) {
    return prisma.servico.update({
      where: { id },
      data: {
        ativo: false,
      },
    });
  }
}
