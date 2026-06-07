import type { StatusOS } from '@prisma/client';

export interface ChangeStatusDto {
  status_novo: StatusOS;
  observacao: string;
  usuario_id: number;
}
