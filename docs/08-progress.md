# Progresso do Projeto ServicePratic

## Status atual

### Concluído

- **Task 001** — Criar projeto backend.
- **Task 002** — Configurar TypeScript.
- **Task 003** — Configurar Prisma.
- **Task 004** — Criar schema Prisma.
- **Task 005** — Configurar MySQL.

- **Task 007** — Criar entidade Cliente.
- **Task 008** — Criar migration Cliente.
- **Task 009** — Criar CRUD Cliente.
- **Task 010** — Criar tela Cliente.

- **Task 015** — Criar entidade OrdemServico (já estava definido no schema e está implementado).
- **Task 016** — Criar migration OrdemServico.
- **Task 017** — Criar CRUD OrdemServico.
- **Task 018** — Implementar alteração de status.
- **Task 019** — Implementar histórico.
- **Task 020** — Criar telas de OS.

### O que já está disponível

- Backend:
  - API `clientes` com CRUD completo.
  - API `ordens-servico` com CRUD completo.
  - Endpoint `PATCH /ordens-servico/:id/status` para alterar status de OS.
  - Endpoint `GET /ordens-servico/:id/historico` para consultar histórico de mudanças de status.

- Frontend:
  - Página de clientes com listagem, criação, edição e exclusão.
  - Página de ordens de serviço com listagem, criação, alteração de status, remoção e histórico.
  - Navegação entre as telas de clientes e ordens de serviço.

## Pendências

- **Task 006** — Implementar autenticação JWT.
- **Task 011** — Criar entidade Equipamento.
- **Task 012** — Criar migration Equipamento.
- **Task 013** — Criar CRUD Equipamento.
- **Task 014** — Criar tela Equipamento.
- Relatórios e dashboard ainda não foram implementados.

## Observações

- O backend atual segue o padrão modular e utiliza Express, TypeScript e Prisma.
- O frontend usa Vite, React e TypeScript.
- O banco de dados local está configurado via `docker-compose.yml` para MySQL.

## Como testar

1. Iniciar backend:

```bash
cd backend
npm run dev
```

2. Iniciar frontend:

```bash
cd frontend
npm run dev
```

3. Abrir no navegador:

```text
http://localhost:5173
```

4. Verificar health do backend:

```bash
curl http://localhost:3000/health
```
