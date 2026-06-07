import type { NextFunction, Request, Response } from 'express';
import { ServicosService } from './servicos.service.js';
import type { CreateServicoDto } from './dtos/create-servico.dto.js';
import type { UpdateServicoDto } from './dtos/update-servico.dto.js';

const servicosService = new ServicosService();

export class ServicosController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = req.body as CreateServicoDto;
      const servico = await servicosService.create(payload);
      return res.status(201).json(servico);
    } catch (error) {
      return next(error);
    }
  }

  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const servicos = await servicosService.getAll();
      return res.json(servicos);
    } catch (error) {
      return next(error);
    }
  }

  async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const servico = await servicosService.getById(id);

      if (!servico) {
        return res.status(404).json({ message: 'Serviço não encontrado' });
      }

      return res.json(servico);
    } catch (error) {
      return next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const payload = req.body as UpdateServicoDto;
      const servico = await servicosService.update(id, payload);
      return res.json(servico);
    } catch (error) {
      return next(error);
    }
  }

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      await servicosService.remove(id);
      return res.status(204).send();
    } catch (error) {
      return next(error);
    }
  }
}
