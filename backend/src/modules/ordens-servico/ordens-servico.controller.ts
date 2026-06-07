import type { Request, Response, NextFunction } from 'express';
import { OrdensServicoService } from './ordens-servico.service.js';
import type { CreateOrdemServicoDto } from './dtos/create-ordem-servico.dto.js';
import type { UpdateOrdemServicoDto } from './dtos/update-ordem-servico.dto.js';
import type { ChangeStatusDto } from './dtos/change-status.dto.js';

const ordensServicoService = new OrdensServicoService();

export class OrdensServicoController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = req.body as CreateOrdemServicoDto;
      const ordem = await ordensServicoService.create(payload);
      return res.status(201).json(ordem);
    } catch (error) {
      return next(error);
    }
  }

  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const ordens = await ordensServicoService.getAll();
      return res.json(ordens);
    } catch (error) {
      return next(error);
    }
  }

  async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const ordem = await ordensServicoService.getById(id);

      if (!ordem) {
        return res.status(404).json({ message: 'Ordem de serviço não encontrada' });
      }

      return res.json(ordem);
    } catch (error) {
      return next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const payload = req.body as UpdateOrdemServicoDto;
      const ordem = await ordensServicoService.update(id, payload);
      return res.json(ordem);
    } catch (error) {
      return next(error);
    }
  }

  async changeStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const payload = req.body as ChangeStatusDto;
      const ordem = await ordensServicoService.changeStatus(id, payload);

      if (!ordem) {
        return res.status(404).json({ message: 'Ordem de serviço não encontrada' });
      }

      return res.json(ordem);
    } catch (error) {
      return next(error);
    }
  }

  async getHistorico(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const historico = await ordensServicoService.getHistorico(id);
      return res.json(historico);
    } catch (error) {
      return next(error);
    }
  }

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      await ordensServicoService.remove(id);
      return res.status(204).send();
    } catch (error) {
      return next(error);
    }
  }
}
