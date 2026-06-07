import { Prisma } from '@prisma/client';
import prisma from '../../infra/prisma/client.js';
import type { CreateOrdemServicoDto } from './dtos/create-ordem-servico.dto.js';
import type { UpdateOrdemServicoDto } from './dtos/update-ordem-servico.dto.js';
import type { ChangeStatusDto } from './dtos/change-status.dto.js';
import type { OrdemServicoItemDto } from './dtos/ordem-servico-item.dto.js';

type OrdemPayload = (CreateOrdemServicoDto | UpdateOrdemServicoDto) & {
  id?: number;
  historico?: unknown;
  itens?: OrdemServicoItemDto[];
};

type OrdemBasePayload = Omit<OrdemPayload, 'itens' | 'historico' | 'id'>;

function extractOrderPayload(data: OrdemPayload) {
  const { id: _id, historico: _historico, itens, ...base } = data;

  return {
    base: base as OrdemBasePayload,
    itens,
  };
}

function toOrderItemRows(ordemServicoId: number, itens: OrdemServicoItemDto[]) {
  return itens.map((item) => {
    const valorUnitario = new Prisma.Decimal(item.valor_unitario);

    return {
      ordem_servico_id: ordemServicoId,
      servico_id: item.servico_id,
      quantidade: item.quantidade,
      valor_unitario: valorUnitario,
      subtotal: valorUnitario.mul(item.quantidade),
    };
  });
}

function sumItemSubtotals(itens: Array<{ subtotal: Prisma.Decimal }>) {
  return itens.reduce((total, item) => total.add(item.subtotal), new Prisma.Decimal(0));
}

function buildOrderData(base: OrdemBasePayload) {
  return {
    ...base,
    ...(base.status === 'FINALIZADA' && base.data_fechamento == null ? { data_fechamento: new Date() } : {}),
  };
}

export class OrdensServicoRepository {
  async findAll() {
    return prisma.ordemServico.findMany({
      orderBy: {
        data_abertura: 'desc',
      },
      include: {
        cliente: true,
        equipamento: true,
        itens: {
          include: {
            servico: true,
          },
          orderBy: {
            id: 'asc',
          },
        },
      },
    });
  }

  async findById(id: number) {
    return prisma.ordemServico.findUnique({
      where: { id },
      include: {
        cliente: true,
        equipamento: true,
        historico: {
          include: {
            usuario: true,
          },
          orderBy: {
            data_evento: 'desc',
          },
        },
        itens: {
          include: {
            servico: true,
          },
          orderBy: {
            id: 'asc',
          },
        },
      },
    });
  }

  async create(data: CreateOrdemServicoDto) {
    const payload = extractOrderPayload(data as OrdemPayload);
    const itens = payload.itens ?? [];
    const normalizedItens = toOrderItemRows(0, itens);
    const valorTotal = sumItemSubtotals(normalizedItens);

    const ordem = await prisma.$transaction(async (tx) => {
      const created = await tx.ordemServico.create({
        data: {
          ...buildOrderData(payload.base),
          valor_total: valorTotal,
        } as Prisma.OrdemServicoUncheckedCreateInput,
      });

      if (normalizedItens.length > 0) {
        await tx.ordemServicoItem.createMany({
          data: normalizedItens.map((item) => ({
            ...item,
            ordem_servico_id: created.id,
          })),
        });
      }

      return created;
    });

    return this.findById(ordem.id);
  }

  async update(id: number, data: UpdateOrdemServicoDto) {
    const payload = extractOrderPayload(data as OrdemPayload);
    const hasItens = Object.prototype.hasOwnProperty.call(data, 'itens');
    const itens = payload.itens ?? [];
    const normalizedItens = toOrderItemRows(id, itens);
    const valorTotal = sumItemSubtotals(normalizedItens);

    await prisma.$transaction(async (tx) => {
      await tx.ordemServico.update({
        where: { id },
        data: {
          ...buildOrderData(payload.base),
          ...(hasItens ? { valor_total: valorTotal } : {}),
        } as Prisma.OrdemServicoUncheckedUpdateInput,
      });

      if (hasItens) {
        await tx.ordemServicoItem.deleteMany({
          where: {
            ordem_servico_id: id,
          },
        });

        if (normalizedItens.length > 0) {
          await tx.ordemServicoItem.createMany({
            data: normalizedItens.map((item) => ({
              ...item,
              ordem_servico_id: id,
            })),
          });
        }
      }
    });

    return this.findById(id);
  }

  async delete(id: number) {
    return prisma.ordemServico.delete({
      where: { id },
    });
  }

  async changeStatus(id: number, data: ChangeStatusDto) {
    const ordem = await prisma.ordemServico.findUnique({
      where: { id },
      select: {
        id: true,
        status: true,
        data_fechamento: true,
      },
    });

    if (!ordem) {
      return null;
    }

    await prisma.$transaction(async (tx) => {
      await tx.ordemServico.update({
        where: { id },
        data: {
          status: data.status_novo,
          ...(data.status_novo === 'FINALIZADA' && ordem.data_fechamento == null ? { data_fechamento: new Date() } : {}),
        },
      });

      await tx.historicoOrdemServico.create({
        data: {
          ordem_servico_id: id,
          usuario_id: data.usuario_id,
          status_anterior: ordem.status,
          status_novo: data.status_novo,
          observacao: data.observacao,
        },
      });
    });

    return this.findById(id);
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
