import prisma from '../../infra/prisma/client.js';
import type { CreateClienteDto } from './dtos/create-cliente.dto.js';
import type { UpdateClienteDto } from './dtos/update-cliente.dto.js';

export class ClientesRepository {
  async findAll() {
    return prisma.cliente.findMany();
  }

  async findById(id: number) {
    return prisma.cliente.findUnique({
      where: { id },
    });
  }

  async create(data: CreateClienteDto) {
    return prisma.cliente.create({
      data,
    });
  }

  async update(id: number, data: UpdateClienteDto) {
    return prisma.cliente.update({
      where: { id },
      data,
    });
  }

  async delete(id: number) {
    return prisma.cliente.delete({
      where: { id },
    });
  }
}
