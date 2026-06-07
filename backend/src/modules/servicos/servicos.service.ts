import type { CreateServicoDto } from './dtos/create-servico.dto.js';
import type { UpdateServicoDto } from './dtos/update-servico.dto.js';
import { ServicosRepository } from './servicos.repository.js';

export class ServicosService {
  private repository = new ServicosRepository();

  async getAll() {
    return this.repository.findAll();
  }

  async getById(id: number) {
    return this.repository.findById(id);
  }

  async create(data: CreateServicoDto) {
    return this.repository.create(data);
  }

  async update(id: number, data: UpdateServicoDto) {
    return this.repository.update(id, data);
  }

  async remove(id: number) {
    return this.repository.deactivate(id);
  }
}
