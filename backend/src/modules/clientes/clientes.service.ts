import type { CreateClienteDto } from './dtos/create-cliente.dto.js';
import type { UpdateClienteDto } from './dtos/update-cliente.dto.js';
import { ClientesRepository } from './clientes.repository.js';

export class ClientesService {
  private repository = new ClientesRepository();

  async getAll() {
    return this.repository.findAll();
  }

  async getById(id: number) {
    return this.repository.findById(id);
  }

  async create(data: CreateClienteDto) {
    return this.repository.create(data);
  }

  async update(id: number, data: UpdateClienteDto) {
    return this.repository.update(id, data);
  }

  async remove(id: number) {
    return this.repository.delete(id);
  }
}
