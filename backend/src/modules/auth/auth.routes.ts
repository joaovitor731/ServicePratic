import { Router } from 'express';
import { AuthController } from './auth.controller.js';

const router = Router();
const controller = new AuthController();

router.post('/login', (req, res, next) => controller.login(req, res, next));

export default router;
