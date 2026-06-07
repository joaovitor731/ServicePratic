import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './modules/auth/index.js';
import { handleAuthError } from './modules/auth/error-handler.js';
import clientesRoutes from './modules/clientes/index.js';
import equipamentosRoutes from './modules/equipamentos/index.js';
import ordensServicoRoutes from './modules/ordens-servico/index.js';
import servicosRoutes from './modules/servicos/index.js';

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

// ===============================
// Rotas
// ===============================
app.use('/clientes', clientesRoutes);
app.use('/equipamentos', equipamentosRoutes);
app.use('/servicos', servicosRoutes);
app.use('/ordens-servico', ordensServicoRoutes);
app.use('/auth', authRoutes);

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

app.use(handleAuthError);

export default app;
