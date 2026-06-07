# ServicePratic - Instruções do Projeto

## Objetivo

O ServicePratic é um sistema web de gerenciamento de ordens de serviço destinado a oficinas mecânicas, assistências técnicas e prestadores de serviço.

O sistema permite:

- Login de usuários
- Cadastro de clientes
- Cadastro de equipamentos
- Abertura de ordens de serviço
- Alteração de status dos atendimentos
- Histórico de movimentações
- Pesquisa de clientes
- Pesquisa de ordens de serviço
- Relatórios
- Dashboard de indicadores

---

# Documentação Obrigatória

Antes de implementar qualquer funcionalidade consulte obrigatoriamente:

docs/01-prd.md

docs/02-domain-model.md

docs/03-use-cases.md

docs/04-der.md

docs/05-api-spec.md

docs/06-adr.md

docs/07-backlog.md

Nenhuma implementação deve contrariar a documentação.

---

# Stack Tecnológica

Frontend:

- React
- TypeScript
- Vite
- Tailwind CSS

Backend:

- Node.js
- Express
- TypeScript

Banco:

- MySQL 8

ORM:

- Prisma ORM

Autenticação:

- JWT
- bcrypt

---

# Regras Arquiteturais

Utilizar arquitetura modular.

Estrutura esperada:

src/

modules/

auth/

clientes/

equipamentos/

ordens-servico/

historico-os/

dashboard/

shared/

infra/

Cada módulo deve possuir:

- Controller
- Service
- Repository
- DTOs
- Routes

Separar responsabilidades.

Controllers não devem conter regras de negócio.

Regras de negócio devem ficar em Services.

Acesso ao banco deve ficar em Repositories.

---

# Convenções de Código

Utilizar TypeScript estrito.

Utilizar async/await.

Utilizar nomes claros e descritivos.

Não utilizar abreviações desnecessárias.

Preferir código simples.

Seguir princípios SOLID quando aplicável.

Evitar duplicação de código.

---

# Entidades Permitidas

Somente as entidades abaixo podem ser criadas sem alteração da documentação:

Usuario

Cliente

Equipamento

OrdemServico

HistoricoOrdemServico

Não criar novas entidades sem justificativa.

---

# Regras de Negócio

## Ordem de Serviço

Uma ordem de serviço deve possuir:

- Cliente
- Equipamento

Uma ordem não pode existir sem cliente.

Uma ordem não pode existir sem equipamento.

---

## Histórico

Toda alteração de status deve gerar histórico.

O histórico deve registrar:

- usuário responsável
- status anterior
- status novo
- observação
- data do evento

Histórico nunca pode ser removido.

Histórico nunca pode ser alterado.

---

## Status Permitidos

ABERTA

EM_ANALISE

EM_EXECUCAO

FINALIZADA

CANCELADA

Não criar novos status.

---

## Ordem Finalizada

Uma ordem finalizada não pode receber novas alterações de status.

---

# API

Toda comunicação deve ocorrer através de JSON.

Seguir os endpoints definidos em:

docs/05-api-spec.md

Não criar endpoints fora da especificação sem justificativa.

---

# Banco de Dados

Utilizar Prisma ORM.

Seguir o DER definido em:

docs/04-der.md

Não criar tabelas fora da documentação.

Não criar relacionamentos não documentados.

Criar migrations organizadas.

Utilizar chaves estrangeiras corretamente.

---

# Segurança

Nunca armazenar senha em texto puro.

Utilizar bcrypt para hash de senha.

Utilizar JWT para autenticação.

Validar dados de entrada.

Tratar erros adequadamente.

---

# Frontend

Consumir apenas endpoints documentados.

Utilizar componentes reutilizáveis.

Utilizar React Hooks.

Separar:

- pages
- components
- services
- routes

Evitar lógica de negócio dentro dos componentes.

---

# Qualidade

Antes de finalizar qualquer implementação verificar:

- Compila sem erros.
- Segue documentação.
- Segue DER.
- Segue API Spec.
- Segue ADR.
- Não quebrou funcionalidades existentes.

Sempre priorizar clareza, simplicidade e manutenção futura.