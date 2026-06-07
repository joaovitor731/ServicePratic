import type { CreateEquipamentoDto } from './dtos/create-equipamento.dto.js';
import type { UpdateEquipamentoDto } from './dtos/update-equipamento.dto.js';
import { EquipamentosRepository } from './equipamentos.repository.js';

export class EquipamentosService {
  private repository = new EquipamentosRepository();

  async getAll() {
    return this.repository.findAll();
  }

  async getById(id: number) {
    return this.repository.findById(id);
  }

  async create(data: CreateEquipamentoDto) {
    return this.repository.create(data);
  }

  async update(id: number, data: UpdateEquipamentoDto) {
    return this.repository.update(id, data);
  }

  async remove(id: number) {
    return this.repository.delete(id);
  }
}
