import type { Request, Response, NextFunction } from 'express';
import { ClientesService } from './clientes.service.js';
import type { CreateClienteDto } from './dtos/create-cliente.dto.js';
import type { UpdateClienteDto } from './dtos/update-cliente.dto.js';

const clientesService = new ClientesService();

export class ClientesController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = req.body as CreateClienteDto;
      const cliente = await clientesService.create(payload);
      return res.status(201).json(cliente);
    } catch (error) {
      return next(error);
    }
  }

  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const clientes = await clientesService.getAll();
      return res.json(clientes);
    } catch (error) {
      return next(error);
    }
  }

  async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const cliente = await clientesService.getById(id);

      if (!cliente) {
        return res.status(404).json({ message: 'Cliente não encontrado' });
      }

      return res.json(cliente);
    } catch (error) {
      return next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const payload = req.body as UpdateClienteDto;
      const cliente = await clientesService.update(id, payload);
      return res.json(cliente);
    } catch (error) {
      return next(error);
    }
  }

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      await clientesService.remove(id);
      return res.status(204).send();
    } catch (error) {
      return next(error);
    }
  }
}
