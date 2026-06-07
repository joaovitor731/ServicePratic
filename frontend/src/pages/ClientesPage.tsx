import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from 'react';
import { getClientes, createCliente, updateCliente, deleteCliente } from '../services/api';

interface ClienteForm {
  id?: number;
  nome: string;
  telefone: string;
  email: string;
  endereco: string;
  observacao: string;
}

const emptyForm: ClienteForm = {
  nome: '',
  telefone: '',
  email: '',
  endereco: '',
  observacao: '',
};

function ClientesPage() {
  const [clientes, setClientes] = useState<ClienteForm[]>([]);
  const [form, setForm] = useState<ClienteForm>(emptyForm);
  const [message, setMessage] = useState<string | null>(null);

  const title = useMemo(() => (form.id ? 'Editar cliente' : 'Novo cliente'), [form.id]);

  async function refresh() {
    const data = await getClientes();
    setClientes(data);
  }

  useEffect(() => {
    refresh();
  }, []);

  const handleChange =
    (field: keyof ClienteForm) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm({ ...form, [field]: event.target.value });
    };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      if (form.id) {
        await updateCliente(form.id, form);
        setMessage('Cliente atualizado com sucesso');
      } else {
        await createCliente(form);
        setMessage('Cliente criado com sucesso');
      }
      setForm(emptyForm);
      refresh();
    } catch (error) {
      setMessage('Erro ao salvar cliente');
    }
  };

  const handleEdit = (cliente: ClienteForm) => {
    setForm(cliente);
    setMessage(null);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Deseja remover este cliente?')) {
      return;
    }
    try {
      await deleteCliente(id);
      setMessage('Cliente removido com sucesso');
      refresh();
    } catch (error) {
      setMessage('Erro ao remover cliente');
    }
  };

  return (
    <section className="cliente-page">
      <div className="cliente-form">
        <h2>{title}</h2>
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
          <div className="actions">
            <button type="submit">Salvar</button>
            <button type="button" onClick={() => setForm(emptyForm)}>
              Limpar
            </button>
          </div>
        </form>
      </div>
      <div className="cliente-list">
        <h2>Lista de Clientes</h2>
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Telefone</th>
              <th>Email</th>
              <th>Endereço</th>
              <th>Observação</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((cliente) => (
              <tr key={cliente.id}>
                <td>{cliente.nome}</td>
                <td>{cliente.telefone}</td>
                <td>{cliente.email}</td>
                <td>{cliente.endereco}</td>
                <td>{cliente.observacao}</td>
                <td>
                  <button onClick={() => handleEdit(cliente)}>Editar</button>
                  <button onClick={() => cliente.id && handleDelete(cliente.id)}>Remover</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default ClientesPage;
