import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { createCliente, deleteCliente, getClientes, updateCliente, type Cliente, type ClientePayload } from '../services/api';

type ClienteForm = ClientePayload & { id?: number };

const emptyForm: ClienteForm = {
  nome: '',
  telefone: '',
  email: '',
  endereco: '',
  observacao: '',
};

function normalize(value: string) {
  return value.toLowerCase().trim();
}

function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [form, setForm] = useState<ClienteForm>(emptyForm);
  const [query, setQuery] = useState('');
  const [view, setView] = useState<'search' | 'form'>('search');
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function refresh() {
    setLoading(true);
    try {
      const data = await getClientes();
      setClientes(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh().catch((error) => setMessage(error instanceof Error ? error.message : 'Erro ao carregar clientes'));
  }, []);

  const filteredClientes = clientes.filter((cliente) => {
    const search = normalize(query);

    if (!search) {
      return true;
    }

    return [cliente.nome, cliente.telefone, cliente.email, cliente.endereco, cliente.observacao]
      .join(' ')
      .toLowerCase()
      .includes(search);
  });

  const handleChange =
    (field: keyof ClientePayload) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm({ ...form, [field]: event.target.value });
    };

  const openNew = () => {
    setForm(emptyForm);
    setMessage(null);
    setView('form');
  };

  const openEdit = (cliente: Cliente) => {
    setForm(cliente);
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
        await updateCliente(id, payload);
        setMessage('Cliente atualizado com sucesso');
      } else {
        await createCliente(payload);
        setMessage('Cliente criado com sucesso');
      }

      setForm(emptyForm);
      setView('search');
      await refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Erro ao salvar cliente');
    }
  };

  const handleDelete = async () => {
    if (!form.id) {
      return;
    }

    if (!window.confirm('Deseja remover este cliente?')) {
      return;
    }

    setMessage(null);

    try {
      await deleteCliente(form.id);
      setMessage('Cliente removido com sucesso');
      setForm(emptyForm);
      setView('search');
      await refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Erro ao remover cliente');
    }
  };

  return (
    <section className="cliente-page">
      {view === 'search' ? (
        <div className="page-screen">
          <div className="page-toolbar">
            <div>
              <span className="eyebrow">Pesquisa</span>
              <h2>Clientes</h2>
              <p>Clique em um registro para abrir o cadastro ou use o botão Novo.</p>
            </div>

            <div className="toolbar-actions">
              <input
                className="search-input"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Pesquisar cliente"
                aria-label="Pesquisar cliente"
              />
              <button type="button" className="button-primary" onClick={openNew}>
                Novo
              </button>
            </div>
          </div>

          {message && <div className="message">{message}</div>}
          {loading && <div className="message">Carregando clientes...</div>}

          <div className="table-card">
            <h2>Lista de Clientes</h2>
            <p>Selecione um item da tabela para editar.</p>
            {filteredClientes.length === 0 ? (
              <div className="empty-state">Nenhum cliente encontrado.</div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Telefone</th>
                    <th>Email</th>
                    <th>Endereço</th>
                    <th>Observação</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClientes.map((cliente) => (
                    <tr
                      key={cliente.id}
                      className="clickable-row"
                      role="button"
                      tabIndex={0}
                      onClick={() => openEdit(cliente)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault();
                          openEdit(cliente);
                        }
                      }}
                      title="Abrir cadastro"
                    >
                      <td>{cliente.nome}</td>
                      <td>{cliente.telefone}</td>
                      <td>{cliente.email}</td>
                      <td>{cliente.endereco}</td>
                      <td>{cliente.observacao}</td>
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
            <h2>{form.id ? 'Editar cliente' : 'Cadastro de cliente'}</h2>
            <p>Preencha os dados e salve para voltar à pesquisa.</p>
          </div>

          {message && <div className="message">{message}</div>}

          <form onSubmit={handleSubmit}>
            <label>
              Nome
              <input value={form.nome} onChange={handleChange('nome')} required />
            </label>
            <label>
              Telefone
              <input value={form.telefone} onChange={handleChange('telefone')} required />
            </label>
            <label>
              Email
              <input type="email" value={form.email} onChange={handleChange('email')} required />
            </label>
            <label>
              Endereço
              <input value={form.endereco} onChange={handleChange('endereco')} required />
            </label>
            <label>
              Observação
              <textarea value={form.observacao} onChange={handleChange('observacao')} />
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

export default ClientesPage;
