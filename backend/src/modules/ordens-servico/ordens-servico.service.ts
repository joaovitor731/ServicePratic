import type { CreateOrdemServicoDto } from './dtos/create-ordem-servico.dto.js';
import type { UpdateOrdemServicoDto } from './dtos/update-ordem-servico.dto.js';
import type { ChangeStatusDto } from './dtos/change-status.dto.js';
import { OrdensServicoRepository } from './ordens-servico.repository.js';

export class OrdensServicoService {
  private repository = new OrdensServicoRepository();

  async getAll() {
    return this.repository.findAll();
  }

  async getById(id: number) {
    return this.repository.findById(id);
  }

  async create(data: CreateOrdemServicoDto) {
    return this.repository.create(data);
  }

  async update(id: number, data: UpdateOrdemServicoDto) {
    return this.repository.update(id, data);
  }

  async changeStatus(id: number, data: ChangeStatusDto) {
    return this.repository.changeStatus(id, data);
  }

  async getHistorico(id: number) {
    return this.repository.findHistoricoByOrdemId(id);
  }

  async remove(id: number) {
    return this.repository.delete(id);
  }
}
