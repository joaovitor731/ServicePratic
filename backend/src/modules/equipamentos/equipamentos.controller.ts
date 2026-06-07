import type { NextFunction, Request, Response } from 'express';
import { EquipamentosService } from './equipamentos.service.js';
import type { CreateEquipamentoDto } from './dtos/create-equipamento.dto.js';
import type { UpdateEquipamentoDto } from './dtos/update-equipamento.dto.js';

const equipamentosService = new EquipamentosService();

export class EquipamentosController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = req.body as CreateEquipamentoDto;
      const equipamento = await equipamentosService.create(payload);
      return res.status(201).json(equipamento);
    } catch (error) {
      return next(error);
    }
  }

  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const equipamentos = await equipamentosService.getAll();
      return res.json(equipamentos);
    } catch (error) {
      return next(error);
    }
  }

  async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const equipamento = await equipamentosService.getById(id);

      if (!equipamento) {
        return res.status(404).json({ message: 'Equipamento não encontrado' });
      }

      return res.json(equipamento);
    } catch (error) {
      return next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const payload = req.body as UpdateEquipamentoDto;
      const equipamento = await equipamentosService.update(id, payload);
      return res.json(equipamento);
    } catch (error) {
      return next(error);
    }
  }

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      await equipamentosService.remove(id);
      return res.status(204).send();
    } catch (error) {
      return next(error);
    }
  }
}
