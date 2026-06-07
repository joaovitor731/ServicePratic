# ServicePratic Backend

Backend do sistema de gerenciamento de ordens de serviço ServicePratic.

## Stack Tecnológico

- **Node.js** — Runtime JavaScript
- **Express** — Framework HTTP
- **TypeScript** — Linguagem tipada
- **Prisma ORM** — Gerenciamento de banco de dados
- **MySQL 8** — Banco de dados
- **JWT** — Autenticação
- **Helmet** — Segurança HTTP
- **CORS** — Cross-Origin Resource Sharing

## Estrutura do Projeto

```
backend/
├── src/
│   ├── modules/          # Módulos de negócio
│   │   ├── auth/
│   │   ├── clientes/
│   │   ├── equipamentos/
│   │   ├── ordens-servico/
│   │   ├── historico-os/
│   │   ├── dashboard/
│   │   └── relatorios/
│   ├── shared/           # Utilitários compartilhados
│   │   ├── types/
│   │   ├── utils/
│   │   ├── validators/
│   │   └── dto/
│   ├── infra/            # Infraestrutura
│   │   ├── prisma/
│   │   └── config/
│   ├── app.ts            # Configuração Express
│   └── server.ts         # Inicialização do servidor
└── dist/                 # Compilado (gerado em build)
```

## Instalação

### Pré-requisitos

- Node.js >= 18.0.0
- npm ou yarn
- MySQL 8

### Passos

1. **Clonar o repositório**

```bash
git clone <seu-repositorio>
cd ServicePratic/backend
```

2. **Instalar dependências**

```bash
npm install
```

3. **Configurar variáveis de ambiente**

```bash
cp .env.example .env
```

Editar `.env` com suas configurações (porta, banco de dados, JWT secret, etc).

4. **Configurar e iniciar MySQL**

Este projeto inclui um `docker-compose.yml` para rodar um container MySQL local.

```bash
docker compose up -d mysql
```

Verifique se o serviço está ativo:

```bash
docker compose ps
```

5. **Configurar banco de dados**

```bash
npm run prisma:format
npm run prisma:generate
```

---

## Scripts Disponíveis

- **`npm run dev`** — Inicia servidor em modo desenvolvimento com reload automático
- **`npm run build`** — Compila TypeScript para JavaScript
- **`npm start`** — Inicia servidor em modo produção
- **`npm run db:start`** — Inicia o container MySQL local
- **`npm run db:stop`** — Encerra o container MySQL local
- **`npm run lint`** — Executa linter (ESLint)
- **`npm run format`** — Formata código (Prettier)

## Health Check

Verifique se o servidor está rodando:

```bash
curl http://localhost:3000/health
```

Resposta esperada:

```json
{
  "status": "ok",
  "message": "Servidor do ServicePratic rodando",
  "timestamp": "2026-06-07T..."
}
```

## Desenvolvimento

### Modo desenvolvimento

```bash
npm run dev
```

O servidor reiniciará automaticamente ao detectar mudanças em arquivos TypeScript.

### Build para produção

```bash
npm run build
npm start
```

## Conformidade

Este projeto segue as diretrizes definidas em:

- `.github/copilot-instructions.md` — Instruções de desenvolvimento
- `docs/01-prd.md` — Requisitos de produto
- `docs/02-domain-model.md` — Modelo de domínio
- `docs/04-der.md` — Diagrama entidade-relacionamento
- `docs/05-api-spec.md` — Especificação da API
- `docs/06-adr.md` — Decisões arquiteturais

## Próximas Tasks

- Task 002: Configurar TypeScript (ESLint, Prettier)
- Task 003: Configurar Prisma e schema do banco
- Task 004: Criar migrations
- Task 005: Configurar MySQL
- Task 006: Implementar autenticação JWT

## Licença

MIT
