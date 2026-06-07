import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';

const app: Express = express();

// ===============================
// Middlewares de Segurança
// ===============================
app.use(helmet());

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));

// ===============================
// Middlewares de Parsing
// ===============================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===============================
// Middlewares de Logging (básico)
// ===============================
app.use((req: Request, res: Response, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ===============================
// Health Check
// ===============================
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    message: 'Servidor do ServicePratic rodando',
    timestamp: new Date().toISOString(),
  });
});

import clientesRoutes from './modules/clientes/index.js';
import ordensServicoRoutes from './modules/ordens-servico/index.js';

// ===============================
// Rotas
// ===============================
app.use('/clientes', clientesRoutes);
app.use('/ordens-servico', ordensServicoRoutes);

// ===============================
// Tratamento de Erros (básico)
// ===============================
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Rota não encontrada',
    path: req.path,
    method: req.method,
  });
});

export default app;
