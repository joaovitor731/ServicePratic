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

export interface OrdemServicoPayload {
  id?: number;
  numero: string;
  cliente_id: number;
  equipamento_id: number;
  problema_relatado: string;
  status: StatusOS;
}

export interface OrdemServico extends OrdemServicoPayload {
  id: number;
  data_abertura: string;
  data_fechamento?: string | null;
  cliente?: Cliente;
  equipamento?: {
    modelo: string;
  };
}

export type StatusOS = 'ABERTA' | 'EM_ANALISE' | 'EM_EXECUCAO' | 'FINALIZADA' | 'CANCELADA';

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
    throw new Error(`Request failed with status ${response.status}`);
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

export function getOrdensServico(): Promise<OrdemServico[]> {
  return request<OrdemServico[]>('/ordens-servico');
}

export function createOrdemServico(payload: OrdemServicoPayload): Promise<OrdemServico> {
  return request<OrdemServico>('/ordens-servico', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function updateOrdemServico(id: number, payload: Partial<OrdemServicoPayload>): Promise<OrdemServico> {
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
