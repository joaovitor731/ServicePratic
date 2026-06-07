import { Router } from 'express';
import { OrdensServicoController } from './ordens-servico.controller.js';

const router = Router();
const controller = new OrdensServicoController();

router.get('/', (req, res, next) => controller.findAll(req, res, next));
router.get('/:id', (req, res, next) => controller.findById(req, res, next));
router.post('/', (req, res, next) => controller.create(req, res, next));
router.put('/:id', (req, res, next) => controller.update(req, res, next));
router.patch('/:id/status', (req, res, next) => controller.changeStatus(req, res, next));
router.get('/:id/historico', (req, res, next) => controller.getHistorico(req, res, next));
router.delete('/:id', (req, res, next) => controller.remove(req, res, next));

export default router;
