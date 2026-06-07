import 'dotenv/config';
import app from './app.js';

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

const server = app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║                   ServicePratic Backend                    ║
╚════════════════════════════════════════════════════════════╝

✓ Servidor iniciado com sucesso
  Port: ${PORT}
  Env: ${NODE_ENV}
  URL: http://localhost:${PORT}
  Health Check: http://localhost:${PORT}/health

  `);
});

// Tratamento de erros não capturados
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

export default server;
