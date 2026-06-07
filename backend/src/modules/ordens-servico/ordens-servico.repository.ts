import prisma from '../../infra/prisma/client.js';
import type { CreateOrdemServicoDto } from './dtos/create-ordem-servico.dto.js';
import type { UpdateOrdemServicoDto } from './dtos/update-ordem-servico.dto.js';
import type { ChangeStatusDto } from './dtos/change-status.dto.js';

export class OrdensServicoRepository {
  async findAll() {
    return prisma.ordemServico.findMany({
      include: {
        cliente: true,
        equipamento: true,
        historico: true,
      },
    });
  }

  async findById(id: number) {
    return prisma.ordemServico.findUnique({
      where: { id },
      include: {
        cliente: true,
        equipamento: true,
        historico: true,
      },
    });
  }

  async create(data: CreateOrdemServicoDto) {
    return prisma.ordemServico.create({
      data,
    });
  }

  async update(id: number, data: UpdateOrdemServicoDto) {
    return prisma.ordemServico.update({
      where: { id },
      data,
    });
  }

  async delete(id: number) {
    return prisma.ordemServico.delete({
      where: { id },
    });
  }

  async changeStatus(id: number, data: ChangeStatusDto) {
    const ordem = await this.findById(id);

    if (!ordem) {
      return null;
    }

    const updated = await prisma.$transaction([
      prisma.ordemServico.update({
        where: { id },
        data: {
          status: data.status_novo,
        },
      }),
      prisma.historicoOrdemServico.create({
        data: {
          ordem_servico_id: id,
          usuario_id: data.usuario_id,
          status_anterior: ordem.status,
          status_novo: data.status_novo,
          observacao: data.observacao,
        },
      }),
    ]);

    return updated[0];
  }

  async findHistoricoByOrdemId(ordemId: number) {
    return prisma.historicoOrdemServico.findMany({
      where: {
        ordem_servico_id: ordemId,
      },
      include: {
        usuario: true,
      },
      orderBy: {
        data_evento: 'desc',
      },
    });
  }
}
