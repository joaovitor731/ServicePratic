export interface CreateServicoDto {
  nome: string;
  descricao: string;
  valor_padrao: number;
  ativo?: boolean;
}
