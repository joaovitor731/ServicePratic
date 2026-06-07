const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export interface ClientePayload {
  nome: string;
  telefone: string;
  email: string;
  endereco: string;
  observacao: string;
}

export interface Cliente extends ClientePayload {
  id: number;
}

export interface EquipamentoPayload {
  cliente_id: number;
  tipo: string;
  marca: string;
  modelo: string;
  numero_serie: string;
  defeito_relatado: string;
}

export interface Equipamento extends EquipamentoPayload {
  id: number;
  cliente?: Cliente;
}

export interface ServicoPayload {
  nome: string;
  descricao: string;
  valor_padrao: number;
  ativo?: boolean;
}

export interface Servico extends Omit<ServicoPayload, 'valor_padrao'> {
  id: number;
  valor_padrao: string;
  ativo: boolean;
}

export interface OrdemServicoItemPayload {
  servico_id: number;
  quantidade: number;
  valor_unitario: number;
}

export interface OrdemServicoItem extends Omit<OrdemServicoItemPayload, 'valor_unitario'> {
  id: number;
  ordem_servico_id: number;
  valor_unitario: string;
  subtotal: string;
  servico?: Servico;
}

export type StatusOS = 'ABERTA' | 'EM_ANALISE' | 'EM_EXECUCAO' | 'FINALIZADA' | 'CANCELADA';

export interface OrdemServicoPayload {
  id?: number;
  numero: string;
  cliente_id: number;
  equipamento_id: number;
  problema_relatado: string;
  status: StatusOS;
  itens: OrdemServicoItemPayload[];
}

export interface OrdemServico extends Omit<OrdemServicoPayload, 'itens'> {
  id: number;
  data_abertura: string;
  data_fechamento?: string | null;
  valor_total: string;
  cliente?: Cliente;
  equipamento?: {
    modelo: string;
  };
  itens: OrdemServicoItem[];
  historico?: HistoricoOrdem[];
}

export interface HistoricoOrdem {
  id: number;
  ordem_servico_id: number;
  usuario_id: number;
  status_anterior: StatusOS;
  status_novo: StatusOS;
  observacao: string;
  data_evento: string;
  usuario?: {
    nome: string;
  };
}

interface ChangeStatusPayload {
  status_novo: StatusOS;
  observacao: string;
  usuario_id: number;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  });

  if (!response.ok) {
    const contentType = response.headers.get('content-type') || '';
    let message = `Request failed with status ${response.status}`;

    if (contentType.includes('application/json')) {
      const errorBody = await response.json();
      message = errorBody.message || errorBody.error || message;
    } else {
      const text = await response.text();
      if (text) {
        message = text;
      }
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

export function getClientes(): Promise<Cliente[]> {
  return request<Cliente[]>('/clientes');
}

export function createCliente(payload: ClientePayload): Promise<Cliente> {
  return request<Cliente>('/clientes', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function updateCliente(id: number, payload: Partial<ClientePayload>): Promise<Cliente> {
  return request<Cliente>(`/clientes/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export function deleteCliente(id: number): Promise<void> {
  return request<void>(`/clientes/${id}`, {
    method: 'DELETE',
  });
}

export function getEquipamentos(): Promise<Equipamento[]> {
  return request<Equipamento[]>('/equipamentos');
}

export function createEquipamento(payload: EquipamentoPayload): Promise<Equipamento> {
  return request<Equipamento>('/equipamentos', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function updateEquipamento(id: number, payload: Partial<EquipamentoPayload>): Promise<Equipamento> {
  return request<Equipamento>(`/equipamentos/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export function deleteEquipamento(id: number): Promise<void> {
  return request<void>(`/equipamentos/${id}`, {
    method: 'DELETE',
  });
}

export function getServicos(): Promise<Servico[]> {
  return request<Servico[]>('/servicos');
}

export function createServico(payload: ServicoPayload): Promise<Servico> {
  return request<Servico>('/servicos', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function updateServico(id: number, payload: Partial<ServicoPayload>): Promise<Servico> {
  return request<Servico>(`/servicos/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export function deleteServico(id: number): Promise<void> {
  return request<void>(`/servicos/${id}`, {
    method: 'DELETE',
  });
}

export function getOrdensServico(): Promise<OrdemServico[]> {
  return request<OrdemServico[]>('/ordens-servico');
}

export function createOrdemServico(payload: OrdemServicoPayload): Promise<OrdemServico> {
  return request<OrdemServico>('/ordens-servico', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function updateOrdemServico(id: number, payload: OrdemServicoPayload): Promise<OrdemServico> {
  return request<OrdemServico>(`/ordens-servico/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export function deleteOrdemServico(id: number): Promise<void> {
  return request<void>(`/ordens-servico/${id}`, {
    method: 'DELETE',
  });
}

export function changeOrdemStatus(id: number, payload: ChangeStatusPayload): Promise<OrdemServico> {
  return request<OrdemServico>(`/ordens-servico/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export function getOrdemHistorico(id: number): Promise<HistoricoOrdem[]> {
  return request<HistoricoOrdem[]>(`/ordens-servico/${id}/historico`);
}
