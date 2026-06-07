import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { getClientes, type Cliente } from '../services/api';
import {
  createEquipamento,
  deleteEquipamento,
  getEquipamentos,
  updateEquipamento,
  type Equipamento,
  type EquipamentoPayload,
} from '../services/api';

type EquipamentoForm = EquipamentoPayload & { id?: number };

const emptyForm: EquipamentoForm = {
  cliente_id: 0,
  tipo: '',
  marca: '',
  modelo: '',
  numero_serie: '',
  defeito_relatado: '',
};

function normalize(value: string) {
  return value.toLowerCase().trim();
}

function EquipamentosPage() {
  const [equipamentos, setEquipamentos] = useState<Equipamento[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [form, setForm] = useState<EquipamentoForm>(emptyForm);
  const [query, setQuery] = useState('');
  const [view, setView] = useState<'search' | 'form'>('search');
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function refresh() {
    setLoading(true);
    try {
      const [equipamentosResult, clientesResult] = await Promise.allSettled([getEquipamentos(), getClientes()]);

      if (equipamentosResult.status === 'fulfilled') {
        setEquipamentos(equipamentosResult.value);
      } else {
        setMessage(equipamentosResult.reason instanceof Error ? equipamentosResult.reason.message : 'Erro ao carregar equipamentos');
      }

      if (clientesResult.status === 'fulfilled') {
        setClientes(clientesResult.value);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  const filteredEquipamentos = equipamentos.filter((equipamento) => {
    const search = normalize(query);

    if (!search) {
      return true;
    }

    return [
      equipamento.id,
      equipamento.cliente?.nome || equipamento.cliente_id,
      equipamento.tipo,
      equipamento.marca,
      equipamento.modelo,
      equipamento.numero_serie,
      equipamento.defeito_relatado,
    ]
      .join(' ')
      .toLowerCase()
      .includes(search);
  });

  const handleChange =
    (field: keyof Omit<EquipamentoPayload, 'cliente_id'>) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm({ ...form, [field]: event.target.value });
    };

  const handleClienteChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setForm({
      ...form,
      cliente_id: value ? Number(value) : 0,
    });
  };

  const openNew = () => {
    setForm(emptyForm);
    setMessage(null);
    setView('form');
  };

  const openEdit = (equipamento: Equipamento) => {
    const { cliente, ...payload } = equipamento;
    setForm(payload);
    setMessage(null);
    setView('form');
  };

  const closeForm = () => {
    setForm(emptyForm);
    setMessage(null);
    setView('search');
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);

    try {
      const { id, ...payload } = form;

      if (id) {
        await updateEquipamento(id, payload);
        setMessage('Equipamento atualizado com sucesso');
      } else {
        await createEquipamento(payload);
        setMessage('Equipamento criado com sucesso');
      }

      setForm(emptyForm);
      setView('search');
      await refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Erro ao salvar equipamento');
    }
  };

  const handleDelete = async () => {
    if (!form.id) {
      return;
    }

    if (!window.confirm('Deseja remover este equipamento?')) {
      return;
    }

    setMessage(null);

    try {
      await deleteEquipamento(form.id);
      setMessage('Equipamento removido com sucesso');
      setForm(emptyForm);
      setView('search');
      await refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Erro ao remover equipamento');
    }
  };

  return (
    <section className="cliente-page">
      {view === 'search' ? (
        <div className="page-screen">
          <div className="page-toolbar">
            <div>
              <span className="eyebrow">Pesquisa</span>
              <h2>Equipamentos</h2>
              <p>Clique em um registro para abrir o cadastro ou use o botão Novo.</p>
            </div>

            <div className="toolbar-actions">
              <input
                className="search-input"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Pesquisar equipamento"
                aria-label="Pesquisar equipamento"
              />
              <button type="button" className="button-primary" onClick={openNew}>
                Novo
              </button>
            </div>
          </div>

          {message && <div className="message">{message}</div>}
          {loading && <div className="message">Carregando dados...</div>}

          <div className="table-card">
            <h2>Lista de Equipamentos</h2>
            <p>Selecione um item da tabela para editar.</p>
            {filteredEquipamentos.length === 0 ? (
              <div className="empty-state">Nenhum equipamento encontrado.</div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Cliente</th>
                    <th>Tipo</th>
                    <th>Marca</th>
                    <th>Modelo</th>
                    <th>Série</th>
                    <th>Defeito</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEquipamentos.map((equipamento) => (
                    <tr
                      key={equipamento.id}
                      className="clickable-row"
                      role="button"
                      tabIndex={0}
                      onClick={() => openEdit(equipamento)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault();
                          openEdit(equipamento);
                        }
                      }}
                      title="Abrir cadastro"
                    >
                      <td>{equipamento.id}</td>
                      <td>{equipamento.cliente?.nome || equipamento.cliente_id}</td>
                      <td>{equipamento.tipo}</td>
                      <td>{equipamento.marca}</td>
                      <td>{equipamento.modelo}</td>
                      <td>{equipamento.numero_serie}</td>
                      <td>{equipamento.defeito_relatado}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      ) : (
        <div className="form-card">
          <div>
            <span className="eyebrow">{form.id ? 'Cadastro' : 'Novo'}</span>
            <h2>{form.id ? 'Editar equipamento' : 'Cadastro de equipamento'}</h2>
            <p>Preencha os dados e salve para voltar à pesquisa.</p>
          </div>

          {message && <div className="message">{message}</div>}

          <form onSubmit={handleSubmit}>
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
              Tipo
              <input value={form.tipo} onChange={handleChange('tipo')} required />
            </label>
            <label>
              Marca
              <input value={form.marca} onChange={handleChange('marca')} required />
            </label>
            <label>
              Modelo
              <input value={form.modelo} onChange={handleChange('modelo')} required />
            </label>
            <label>
              Número de série
              <input value={form.numero_serie} onChange={handleChange('numero_serie')} required />
            </label>
            <label>
              Defeito relatado
              <textarea value={form.defeito_relatado} onChange={handleChange('defeito_relatado')} required />
            </label>
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

export default EquipamentosPage;
