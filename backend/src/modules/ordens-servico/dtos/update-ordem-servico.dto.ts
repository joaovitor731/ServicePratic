import type { StatusOS } from '@prisma/client';

export interface UpdateOrdemServicoDto {
  numero?: string;
  cliente_id?: number;
  equipamento_id?: number;
  problema_relatado?: string;
  status?: StatusOS;
  data_fechamento?: Date | string | null;
}
