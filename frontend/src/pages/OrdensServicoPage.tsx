import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import {
  changeOrdemStatus,
  createOrdemServico,
  deleteOrdemServico,
  getClientes,
  getEquipamentos,
  getOrdemHistorico,
  getOrdensServico,
  getServicos,
  updateOrdemServico,
  type Cliente,
  type Equipamento,
  type HistoricoOrdem,
  type OrdemServico,
  type OrdemServicoItem,
  type OrdemServicoItemPayload,
  type OrdemServicoPayload,
  type Servico,
  type StatusOS,
} from '../services/api';

type OrdemItemForm = OrdemServicoItemPayload;

type OrdemForm = Omit<OrdemServicoPayload, 'itens'> & {
  itens: OrdemItemForm[];
};

type ItemDraft = OrdemItemForm;

const emptyForm: OrdemForm = {
  numero: '',
  cliente_id: 0,
  equipamento_id: 0,
  problema_relatado: '',
  status: 'ABERTA',
  itens: [],
};

const emptyDraft: ItemDraft = {
  servico_id: 0,
  quantidade: 1,
  valor_unitario: 0,
};

const moneyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

function formatCurrency(value: string | number) {
  return moneyFormatter.format(Number(value));
}

function normalize(value: string) {
  return value.toLowerCase().trim();
}

function toFormItem(item: OrdemServicoItem): OrdemItemForm {
  return {
    servico_id: item.servico_id,
    quantidade: item.quantidade,
    valor_unitario: Number(item.valor_unitario),
  };
}

function createDraftFromServices(servicos: Servico[]): ItemDraft {
  const service = servicos.find((item) => item.ativo);

  return {
    servico_id: service?.id ?? 0,
    quantidade: 1,
    valor_unitario: service ? Number(service.valor_padrao) : 0,
  };
}

function calculateItemsTotal(itens: OrdemItemForm[]) {
  return itens.reduce((total, item) => total + Number(item.quantidade) * Number(item.valor_unitario), 0);
}

function OrdensServicoPage() {
  const [ordens, setOrdens] = useState<OrdemServico[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [equipamentos, setEquipamentos] = useState<Equipamento[]>([]);
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [form, setForm] = useState<OrdemForm>(emptyForm);
  const [draftItem, setDraftItem] = useState<ItemDraft>(emptyDraft);
  const [query, setQuery] = useState('');
  const [view, setView] = useState<'search' | 'form'>('search');
  const [message, setMessage] = useState<string | null>(null);
  const [selectedHistorico, setSelectedHistorico] = useState<HistoricoOrdem[]>([]);
  const [historicoOrdem, setHistoricoOrdem] = useState<number | null>(null);
  const [statusChange, setStatusChange] = useState<{ id: number; status: StatusOS; observacao: string; usuario_id: number } | null>(
    null,
  );
  const [loading, setLoading] = useState(false);

  async function refresh() {
    setLoading(true);
    try {
      const [ordensData, clientesData, equipamentosData, servicosData] = await Promise.all([
        getOrdensServico(),
        getClientes(),
        getEquipamentos(),
        getServicos(),
      ]);

      setOrdens(ordensData);
      setClientes(clientesData);
      setEquipamentos(equipamentosData);
      setServicos(servicosData);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh().catch((error) => setMessage(error instanceof Error ? error.message : 'Erro ao carregar ordens de serviço'));
  }, []);

  useEffect(() => {
    if (view === 'form' && draftItem.servico_id === 0 && servicos.length > 0) {
      setDraftItem(createDraftFromServices(servicos));
    }
  }, [draftItem.servico_id, servicos, view]);

  const filteredOrdens = ordens.filter((ordem) => {
    const search = normalize(query);

    if (!search) {
      return true;
    }

    const servicosText = ordem.itens.map((item) => item.servico?.nome ?? '').join(' ');

    return [
      ordem.numero,
      ordem.cliente?.nome || ordem.cliente_id,
      ordem.equipamento?.modelo || ordem.equipamento_id,
      ordem.status,
      ordem.problema_relatado,
      servicosText,
      ordem.valor_total,
    ]
      .join(' ')
      .toLowerCase()
      .includes(search);
  });

  const equipamentosFiltrados = form.cliente_id
    ? equipamentos.filter((equipamento) => equipamento.cliente_id === form.cliente_id)
    : equipamentos;

  const selectedService = servicos.find((servico) => servico.id === draftItem.servico_id);
  const total = calculateItemsTotal(form.itens);

  const handleFormTextChange =
    (field: keyof Omit<OrdemForm, 'itens' | 'cliente_id' | 'equipamento_id' | 'status'>) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm({
        ...form,
        [field]: event.target.value,
      });
    };

  const handleStatusChangeField = (event: ChangeEvent<HTMLSelectElement>) => {
    setForm({
      ...form,
      status: event.target.value as StatusOS,
    });
  };

  const handleClienteChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    const cliente_id = value ? Number(value) : 0;

    setForm({
      ...form,
      cliente_id,
      equipamento_id: 0,
    });
  };

  const handleEquipamentoChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;

    setForm({
      ...form,
      equipamento_id: value ? Number(value) : 0,
    });
  };

  const openNew = () => {
    setForm(emptyForm);
    setDraftItem(createDraftFromServices(servicos));
    setMessage(null);
    setView('form');
  };

  const openEdit = (ordem: OrdemServico) => {
    setForm({
      id: ordem.id,
      numero: ordem.numero,
      cliente_id: ordem.cliente_id,
      equipamento_id: ordem.equipamento_id,
      problema_relatado: ordem.problema_relatado,
      status: ordem.status,
      itens: ordem.itens.map(toFormItem),
    });
    setDraftItem(createDraftFromServices(servicos));
    setMessage(null);
    setView('form');
  };

  const closeForm = () => {
    setForm(emptyForm);
    setDraftItem(createDraftFromServices(servicos));
    setMessage(null);
    setView('search');
  };

  const addDraftItem = () => {
    if (!selectedService) {
      setMessage('Selecione um serviço válido antes de adicionar.');
      return;
    }

    if (draftItem.quantidade <= 0) {
      setMessage('A quantidade precisa ser maior que zero.');
      return;
    }

    const itemToAdd: OrdemItemForm = {
      servico_id: selectedService.id,
      quantidade: draftItem.quantidade,
      valor_unitario: Number.isFinite(draftItem.valor_unitario) ? draftItem.valor_unitario : Number(selectedService.valor_padrao),
    };

    setForm((current) => {
      const index = current.itens.findIndex((item) => item.servico_id === itemToAdd.servico_id);

      if (index >= 0) {
        const itens = [...current.itens];
        itens[index] = itemToAdd;
        return {
          ...current,
          itens,
        };
      }

      return {
        ...current,
        itens: [...current.itens, itemToAdd],
      };
    });

    setDraftItem(createDraftFromServices(servicos));
    setMessage(null);
  };

  const updateItem = (index: number, field: keyof OrdemItemForm, value: string | number) => {
    setForm((current) => {
      const itens = [...current.itens];
      const currentItem = itens[index];

      if (!currentItem) {
        return current;
      }

      if (field === 'servico_id') {
        const servicoId = Number(value);
        const servico = servicos.find((item) => item.id === servicoId);

        itens[index] = {
          ...currentItem,
          servico_id: servicoId,
          valor_unitario: servico ? Number(servico.valor_padrao) : currentItem.valor_unitario,
        };

        return {
          ...current,
          itens,
        };
      }

      itens[index] = {
        ...currentItem,
        [field]: Number(value),
      };

      return {
        ...current,
        itens,
      };
    });
  };

  const removeItem = (index: number) => {
    setForm((current) => ({
      ...current,
      itens: current.itens.filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);

    if (form.itens.length === 0) {
      setMessage('Adicione pelo menos um serviço à ordem.');
      return;
    }

    try {
      const { id, ...payload } = form;

      if (id) {
        await updateOrdemServico(id, payload);
        setMessage('Ordem de serviço atualizada com sucesso');
      } else {
        await createOrdemServico(payload);
        setMessage('Ordem de serviço criada com sucesso');
      }

      setForm(emptyForm);
      setDraftItem(createDraftFromServices(servicos));
      setView('search');
      await refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Erro ao salvar ordem de serviço');
    }
  };

  const handleDelete = async () => {
    if (!form.id) {
      return;
    }

    if (!window.confirm('Deseja remover esta ordem de serviço?')) {
      return;
    }

    setMessage(null);

    try {
      await deleteOrdemServico(form.id);
      setMessage('Ordem removida com sucesso');
      setForm(emptyForm);
      setDraftItem(createDraftFromServices(servicos));
      setView('search');
      await refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Erro ao remover ordem');
    }
  };

  const openHistorico = async (id: number) => {
    try {
      const data = await getOrdemHistorico(id);
      setHistoricoOrdem(id);
      setSelectedHistorico(data);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Erro ao carregar histórico');
    }
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
      await refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Erro ao atualizar status');
    }
  };

  return (
    <section className="cliente-page">
      {view === 'search' ? (
        <div className="page-screen">
          <div className="page-toolbar">
            <div>
              <span className="eyebrow">Pesquisa</span>
              <h2>Ordens de Serviço</h2>
              <p>Clique em um registro para abrir o cadastro ou use o botão Novo.</p>
            </div>

            <div className="toolbar-actions">
              <input
                className="search-input"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Pesquisar ordem"
                aria-label="Pesquisar ordem de serviço"
              />
              <button type="button" className="button-primary" onClick={openNew}>
                Novo
              </button>
            </div>
          </div>

          {message && <div className="message">{message}</div>}
          {loading && <div className="message">Carregando dados...</div>}

          <div className="table-card">
            <h2>Lista de Ordens de Serviço</h2>
            <p>Selecione um item da tabela para editar.</p>
            {filteredOrdens.length === 0 ? (
              <div className="empty-state">Nenhuma ordem encontrada.</div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Número</th>
                    <th>Cliente</th>
                    <th>Equipamento</th>
                    <th>Serviços</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Aberta em</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrdens.map((ordem) => (
                    <tr
                      key={ordem.id}
                      className="clickable-row"
                      role="button"
                      tabIndex={0}
                      onClick={() => openEdit(ordem)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault();
                          openEdit(ordem);
                        }
                      }}
                      title="Abrir cadastro"
                    >
                      <td>{ordem.numero}</td>
                      <td>{ordem.cliente?.nome || ordem.cliente_id}</td>
                      <td>{ordem.equipamento?.modelo || ordem.equipamento_id}</td>
                      <td>{ordem.itens.map((item) => item.servico?.nome || item.servico_id).join(', ') || 'Sem itens'}</td>
                      <td>{formatCurrency(ordem.valor_total)}</td>
                      <td>{ordem.status}</td>
                      <td>{new Date(ordem.data_abertura).toLocaleString()}</td>
                      <td>
                        <div className="inline-actions">
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              openEdit(ordem);
                            }}
                          >
                            Editar
                          </button>
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              void openHistorico(ordem.id);
                            }}
                          >
                            Histórico
                          </button>
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              setStatusChange({
                                id: ordem.id,
                                status: 'EM_EXECUCAO',
                                observacao: '',
                                usuario_id: 1,
                              });
                            }}
                          >
                            Mudar status
                          </button>
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              if (!window.confirm('Deseja remover esta ordem de serviço?')) {
                                return;
                              }

                              void deleteOrdemServico(ordem.id)
                                .then(async () => {
                                  setMessage('Ordem removida com sucesso');
                                  await refresh();
                                })
                                .catch((error) => {
                                  setMessage(error instanceof Error ? error.message : 'Erro ao remover ordem');
                                });
                            }}
                          >
                            Remover
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {statusChange && (
            <div className="status-card">
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
              <div className="form-actions">
                <button type="button" onClick={handleStatusChange}>
                  Salvar status
                </button>
                <button type="button" className="button-secondary" onClick={() => setStatusChange(null)}>
                  Cancelar
                </button>
              </div>
            </div>
          )}

          {historicoOrdem && (
            <div className="history-card">
              <h3>Histórico da OS {historicoOrdem}</h3>
              <button type="button" className="button-secondary" onClick={() => setHistoricoOrdem(null)}>
                Fechar
              </button>
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
        </div>
      ) : (
        <div className="form-card">
          <div>
            <span className="eyebrow">{form.id ? 'Cadastro' : 'Novo'}</span>
            <h2>{form.id ? 'Editar ordem de serviço' : 'Cadastro de ordem de serviço'}</h2>
            <p>Preencha os dados da ordem e adicione os serviços abaixo.</p>
          </div>

          {message && <div className="message">{message}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <label>
                Número
                <input value={form.numero} onChange={handleFormTextChange('numero')} required />
              </label>
              <label>
                Cliente
                <select value={form.cliente_id ? String(form.cliente_id) : ''} onChange={handleClienteChange} required>
                  <option value="">Selecione um cliente</option>
                  {clientes.map((cliente) => (
                    <option key={cliente.id} value={cliente.id}>
                      {cliente.nome} - {cliente.id}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Equipamento
                <select
                  value={form.equipamento_id ? String(form.equipamento_id) : ''}
                  onChange={handleEquipamentoChange}
                  required
                  disabled={!form.cliente_id}
                >
                  <option value="">Selecione um equipamento</option>
                  {equipamentosFiltrados.map((equipamento) => (
                    <option key={equipamento.id} value={equipamento.id}>
                      {equipamento.modelo} - {equipamento.id}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Status inicial
                <select value={form.status} onChange={handleStatusChangeField}>
                  <option value="ABERTA">ABERTA</option>
                  <option value="EM_ANALISE">EM_ANALISE</option>
                  <option value="EM_EXECUCAO">EM_EXECUCAO</option>
                  <option value="FINALIZADA">FINALIZADA</option>
                  <option value="CANCELADA">CANCELADA</option>
                </select>
              </label>
            </div>

            <label>
              Problema relatado
              <textarea value={form.problema_relatado} onChange={handleFormTextChange('problema_relatado')} required />
            </label>

            <section className="items-card">
              <div className="items-header">
                <div>
                  <h3>Serviços da OS</h3>
                  <p>Adicione um ou mais serviços e ajuste quantidade e valor se necessário.</p>
                </div>
                <strong>Total: {formatCurrency(total)}</strong>
              </div>

              <div className="items-draft">
                <label>
                  Serviço
                  <select
                    value={draftItem.servico_id ? String(draftItem.servico_id) : ''}
                    onChange={(event) => {
                      const servicoId = Number(event.target.value);
                      const servico = servicos.find((item) => item.id === servicoId);
                      setDraftItem({
                        servico_id: servicoId,
                        quantidade: draftItem.quantidade,
                        valor_unitario: servico ? Number(servico.valor_padrao) : 0,
                      });
                    }}
                    disabled={servicos.length === 0}
                  >
                    <option value="">Selecione um serviço</option>
                    {servicos.map((servico) => (
                      <option key={servico.id} value={servico.id} disabled={!servico.ativo}>
                        {servico.nome} - {formatCurrency(servico.valor_padrao)} {servico.ativo ? '' : '(inativo)'}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Quantidade
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={draftItem.quantidade}
                    onChange={(event) => setDraftItem({ ...draftItem, quantidade: Number(event.target.value) })}
                  />
                </label>
                <label>
                  Valor unitário
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={draftItem.valor_unitario}
                    onChange={(event) => setDraftItem({ ...draftItem, valor_unitario: Number(event.target.value) })}
                  />
                </label>
                <button type="button" className="button-primary" onClick={addDraftItem} disabled={servicos.length === 0}>
                  Adicionar serviço
                </button>
              </div>

              {form.itens.length === 0 ? (
                <div className="empty-state">Nenhum serviço adicionado ainda.</div>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Serviço</th>
                      <th>Quantidade</th>
                      <th>Valor unitário</th>
                      <th>Subtotal</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {form.itens.map((item, index) => {
                      const servico = servicos.find((current) => current.id === item.servico_id);

                      return (
                        <tr key={`${item.servico_id}-${index}`}>
                          <td>
                            <select
                              value={String(item.servico_id)}
                              onChange={(event) => updateItem(index, 'servico_id', Number(event.target.value))}
                            >
                              {servicos.map((servicoOption) => (
                                <option key={servicoOption.id} value={servicoOption.id} disabled={!servicoOption.ativo}>
                                  {servicoOption.nome}
                                  {!servicoOption.ativo ? ' (inativo)' : ''}
                                </option>
                              ))}
                            </select>
                            <small>{servico ? formatCurrency(servico.valor_padrao) : 'Serviço não encontrado'}</small>
                          </td>
                          <td>
                            <input
                              type="number"
                              min="1"
                              step="1"
                              value={item.quantidade}
                              onChange={(event) => updateItem(index, 'quantidade', Number(event.target.value))}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={item.valor_unitario}
                              onChange={(event) => updateItem(index, 'valor_unitario', Number(event.target.value))}
                            />
                          </td>
                          <td>{formatCurrency(Number(item.quantidade) * Number(item.valor_unitario))}</td>
                          <td>
                            <button type="button" className="button-danger" onClick={() => removeItem(index)}>
                              Remover
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </section>

            <div className="form-actions">
              <button type="submit">Salvar</button>
              <button type="button" className="button-secondary" onClick={closeForm}>
                Cancelar
              </button>
              {form.id && (
                <button type="button" className="button-danger" onClick={handleDelete}>
                  Excluir
                </button>
              )}
            </div>
          </form>
        </div>
      )}
    </section>
  );
}

export default OrdensServicoPage;
