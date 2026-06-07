import prisma from '../../infra/prisma/client.js';
import type { CreateEquipamentoDto } from './dtos/create-equipamento.dto.js';
import type { UpdateEquipamentoDto } from './dtos/update-equipamento.dto.js';

export class EquipamentosRepository {
  async findAll() {
    return prisma.equipamento.findMany({
      include: {
        cliente: true,
      },
    });
  }

  async findById(id: number) {
    return prisma.equipamento.findUnique({
      where: { id },
      include: {
        cliente: true,
      },
    });
  }

  async create(data: CreateEquipamentoDto) {
    return prisma.equipamento.create({ data });
  }

  async update(id: number, data: UpdateEquipamentoDto) {
    return prisma.equipamento.update({
      where: { id },
      data,
    });
  }

  async delete(id: number) {
    return prisma.equipamento.delete({ where: { id } });
  }
}
