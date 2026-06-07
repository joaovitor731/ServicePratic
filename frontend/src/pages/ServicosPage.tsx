import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { createServico, deleteServico, getServicos, updateServico, type Servico, type ServicoPayload } from '../services/api';

type ServicoForm = ServicoPayload & { id?: number; ativo: boolean };

const emptyForm: ServicoForm = {
  nome: '',
  descricao: '',
  valor_padrao: 0,
  ativo: true,
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

function ServicosPage() {
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [form, setForm] = useState<ServicoForm>(emptyForm);
  const [query, setQuery] = useState('');
  const [view, setView] = useState<'search' | 'form'>('search');
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function refresh() {
    setLoading(true);
    try {
      const data = await getServicos();
      setServicos(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh().catch((error) => setMessage(error instanceof Error ? error.message : 'Erro ao carregar serviços'));
  }, []);

  const filteredServicos = servicos.filter((servico) => {
    const search = normalize(query);

    if (!search) {
      return true;
    }

    return [servico.nome, servico.descricao, servico.ativo ? 'ativo' : 'inativo', String(servico.valor_padrao)]
      .join(' ')
      .toLowerCase()
      .includes(search);
  });

  const openNew = () => {
    setForm(emptyForm);
    setMessage(null);
    setView('form');
  };

  const openEdit = (servico: Servico) => {
    setForm({
      id: servico.id,
      nome: servico.nome,
      descricao: servico.descricao,
      valor_padrao: Number(servico.valor_padrao),
      ativo: servico.ativo,
    });
    setMessage(null);
    setView('form');
  };

  const closeForm = () => {
    setForm(emptyForm);
    setMessage(null);
    setView('search');
  };

  const handleTextChange =
    (field: keyof Omit<ServicoForm, 'valor_padrao' | 'ativo' | 'id'>) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm({ ...form, [field]: event.target.value });
    };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);

    try {
      const { id, ...payload } = form;

      if (id) {
        await updateServico(id, payload);
        setMessage('Serviço atualizado com sucesso');
      } else {
        await createServico(payload);
        setMessage('Serviço criado com sucesso');
      }

      setForm(emptyForm);
      setView('search');
      await refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Erro ao salvar serviço');
    }
  };

  const handleDelete = async () => {
    if (!form.id) {
      return;
    }

    if (!window.confirm('Deseja desativar este serviço?')) {
      return;
    }

    setMessage(null);

    try {
      await deleteServico(form.id);
      setMessage('Serviço desativado com sucesso');
      setForm(emptyForm);
      setView('search');
      await refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Erro ao desativar serviço');
    }
  };

  return (
    <section className="cliente-page">
      {view === 'search' ? (
        <div className="page-screen">
          <div className="page-toolbar">
            <div>
              <span className="eyebrow">Pesquisa</span>
              <h2>Serviços</h2>
              <p>Clique em um registro para abrir o cadastro ou use o botão Novo.</p>
            </div>

            <div className="toolbar-actions">
              <input
                className="search-input"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Pesquisar serviço"
                aria-label="Pesquisar serviço"
              />
              <button type="button" className="button-primary" onClick={openNew}>
                Novo
              </button>
            </div>
          </div>

          {message && <div className="message">{message}</div>}
          {loading && <div className="message">Carregando serviços...</div>}

          <div className="table-card">
            <h2>Lista de Serviços</h2>
            <p>Selecione um item da tabela para editar.</p>
            {filteredServicos.length === 0 ? (
              <div className="empty-state">Nenhum serviço encontrado.</div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Descrição</th>
                    <th>Valor padrão</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredServicos.map((servico) => (
                    <tr
                      key={servico.id}
                      className="clickable-row"
                      role="button"
                      tabIndex={0}
                      onClick={() => openEdit(servico)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault();
                          openEdit(servico);
                        }
                      }}
                      title="Abrir cadastro"
                    >
                      <td>{servico.nome}</td>
                      <td>{servico.descricao}</td>
                      <td>{formatCurrency(servico.valor_padrao)}</td>
                      <td>{servico.ativo ? 'Ativo' : 'Inativo'}</td>
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
            <h2>{form.id ? 'Editar serviço' : 'Cadastro de serviço'}</h2>
            <p>Preencha os dados e salve para voltar à pesquisa.</p>
          </div>

          {message && <div className="message">{message}</div>}

          <form onSubmit={handleSubmit}>
            <label>
              Nome
              <input value={form.nome} onChange={handleTextChange('nome')} required />
            </label>
            <label>
              Descrição
              <textarea value={form.descricao} onChange={handleTextChange('descricao')} required />
            </label>
            <label>
              Valor padrão
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.valor_padrao}
                onChange={(event) => setForm({ ...form, valor_padrao: Number(event.target.value) })}
                required
              />
            </label>
            <label className="checkbox-field">
              <span>Ativo</span>
              <input
                type="checkbox"
                checked={form.ativo}
                onChange={(event) => setForm({ ...form, ativo: event.target.checked })}
              />
            </label>
            <div className="form-actions">
              <button type="submit">Salvar</button>
              <button type="button" className="button-secondary" onClick={closeForm}>
                Cancelar
              </button>
              {form.id && (
                <button type="button" className="button-danger" onClick={handleDelete}>
                  Desativar
                </button>
              )}
            </div>
          </form>
        </div>
      )}
    </section>
  );
}

export default ServicosPage;
