import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from 'react';
import {
  createOrdemServico,
  getOrdensServico,
  updateOrdemServico,
  deleteOrdemServico,
  changeOrdemStatus,
  getOrdemHistorico,
  type OrdemServicoPayload,
  type OrdemServico,
  type StatusOS,
} from '../services/api';

const defaultPayload: OrdemServicoPayload = {
  numero: '',
  cliente_id: 0,
  equipamento_id: 0,
  problema_relatado: '',
  status: 'ABERTA',
};

function OrdensServicoPage() {
  const [ordens, setOrdens] = useState<OrdemServico[]>([]);
  const [form, setForm] = useState<OrdemServicoPayload>(defaultPayload);
  const [message, setMessage] = useState<string | null>(null);
  const [selectedHistorico, setSelectedHistorico] = useState<any[]>([]);
  const [historicoOrdem, setHistoricoOrdem] = useState<number | null>(null);
  const [statusChange, setStatusChange] = useState<{ id: number; status: StatusOS; observacao: string; usuario_id: number } | null>(null);

  const title = useMemo(() => (form.id ? 'Editar ordem de serviço' : 'Nova ordem de serviço'), [form.id]);

  async function refresh() {
    const data = await getOrdensServico();
    setOrdens(data);
  }

  useEffect(() => {
    refresh();
  }, []);

  const handleChange = (field: keyof OrdemServicoPayload) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [field]: field === 'cliente_id' || field === 'equipamento_id' ? Number(event.target.value) : event.target.value });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await createOrdemServico(form);
      setMessage('Ordem de serviço criada com sucesso');
      setForm(defaultPayload);
      refresh();
    } catch (error) {
      setMessage('Erro ao criar ordem de serviço');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Deseja remover esta ordem de serviço?')) {
      return;
    }

    try {
      await deleteOrdemServico(id);
      setMessage('Ordem removida com sucesso');
      refresh();
    } catch (error) {
      setMessage('Erro ao remover ordem');
    }
  };

  const openHistorico = async (id: number) => {
    const data = await getOrdemHistorico(id);
    setHistoricoOrdem(id);
    setSelectedHistorico(data);
  };

  const handleStatusChange = async () => {
    if (!statusChange) {
      return;
    }

    try {
      await changeOrdemStatus(statusChange.id, {
        status_novo: statusChange.status,
        observacao: statusChange.observacao,
        usuario_id: statusChange.usuario_id,
      });
      setMessage('Status atualizado com sucesso');
      setStatusChange(null);
      refresh();
    } catch (error) {
      setMessage('Erro ao atualizar status');
    }
  };

  return (
    <section className="ordens-page">
      <div className="ordens-form">
        <h2>{title}</h2>
        {message && <div className="message">{message}</div>}
        <form onSubmit={handleSubmit}>
          <label>
            Número
            <input value={form.numero} onChange={handleChange('numero')} required />
          </label>
          <label>
            Cliente ID
            <input type="number" value={form.cliente_id || ''} onChange={handleChange('cliente_id')} required />
          </label>
          <label>
            Equipamento ID
            <input type="number" value={form.equipamento_id || ''} onChange={handleChange('equipamento_id')} required />
          </label>
          <label>
            Problema relatado
            <textarea value={form.problema_relatado} onChange={handleChange('problema_relatado')} required />
          </label>
          <label>
            Status inicial
            <select value={form.status} onChange={handleChange('status')}>
              <option value="ABERTA">ABERTA</option>
              <option value="EM_ANALISE">EM_ANALISE</option>
              <option value="EM_EXECUCAO">EM_EXECUCAO</option>
              <option value="FINALIZADA">FINALIZADA</option>
              <option value="CANCELADA">CANCELADA</option>
            </select>
          </label>
          <button type="submit">Salvar</button>
        </form>
      </div>

      <div className="ordens-list">
        <h2>Lista de Ordens de Serviço</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Número</th>
              <th>Cliente</th>
              <th>Equipamento</th>
              <th>Status</th>
              <th>Aberta em</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {ordens.map((ordem) => (
              <tr key={ordem.id}>
                <td>{ordem.id}</td>
                <td>{ordem.numero}</td>
                <td>{ordem.cliente?.nome || ordem.cliente_id}</td>
                <td>{ordem.equipamento?.modelo || ordem.equipamento_id}</td>
                <td>{ordem.status}</td>
                <td>{new Date(ordem.data_abertura).toLocaleString()}</td>
                <td>
                  <button type="button" onClick={() => openHistorico(ordem.id)}>Histórico</button>
                  <button
                    type="button"
                    onClick={() =>
                      setStatusChange({
                        id: ordem.id,
                        status: 'EM_EXECUCAO',
                        observacao: '',
                        usuario_id: 1,
                      })
                    }
                  >
                    Mudar status
                  </button>
                  <button type="button" onClick={() => handleDelete(ordem.id)}>Remover</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {statusChange && (
        <div className="status-change">
          <h3>Alterar status da OS {statusChange.id}</h3>
          <label>
            Novo status
            <select
              value={statusChange.status}
              onChange={(event) => setStatusChange({ ...statusChange, status: event.target.value as StatusOS })}
            >
              <option value="ABERTA">ABERTA</option>
              <option value="EM_ANALISE">EM_ANALISE</option>
              <option value="EM_EXECUCAO">EM_EXECUCAO</option>
              <option value="FINALIZADA">FINALIZADA</option>
              <option value="CANCELADA">CANCELADA</option>
            </select>
          </label>
          <label>
            Observação
            <textarea
              value={statusChange.observacao}
              onChange={(event) => setStatusChange({ ...statusChange, observacao: event.target.value })}
            />
          </label>
          <label>
            Usuário ID
            <input
              type="number"
              value={statusChange.usuario_id}
              onChange={(event) => setStatusChange({ ...statusChange, usuario_id: Number(event.target.value) })}
            />
          </label>
          <div className="actions">
            <button type="button" onClick={handleStatusChange}>Salvar status</button>
            <button type="button" onClick={() => setStatusChange(null)}>Cancelar</button>
          </div>
        </div>
      )}

      {historicoOrdem && (
        <div className="historico-list">
          <h3>Histórico da OS {historicoOrdem}</h3>
          <button type="button" onClick={() => setHistoricoOrdem(null)}>Fechar</button>
          <table>
            <thead>
              <tr>
                <th>Evento</th>
                <th>Usuário</th>
                <th>Status anterior</th>
                <th>Status novo</th>
                <th>Observação</th>
                <th>Data</th>
              </tr>
            </thead>
            <tbody>
              {selectedHistorico.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.usuario?.nome || item.usuario_id}</td>
                  <td>{item.status_anterior}</td>
                  <td>{item.status_novo}</td>
                  <td>{item.observacao}</td>
                  <td>{new Date(item.data_evento).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default OrdensServicoPage;
