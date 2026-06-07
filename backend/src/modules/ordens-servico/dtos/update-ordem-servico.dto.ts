import type { StatusOS } from '@prisma/client';
import type { OrdemServicoItemDto } from './ordem-servico-item.dto.js';

export interface UpdateOrdemServicoDto {
  numero?: string;
  cliente_id?: number;
  equipamento_id?: number;
  problema_relatado?: string;
  status?: StatusOS;
  data_fechamento?: Date | string | null;
  itens?: OrdemServicoItemDto[];
}
