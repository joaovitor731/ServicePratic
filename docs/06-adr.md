# Architecture Decision Record

## Frontend

- React
- TypeScript
- Vite
- Tailwind CSS

---

## Backend

- Node.js
- Express
- TypeScript

---

## Banco

- MySQL 8

---

## ORM

- Prisma ORM

---

## Autenticação

- JWT


## Arquitetura

Frontend

↓

API REST

↓

MySQL

---

## Estratégia de Histórico

Toda alteração de status deve gerar registro no histórico.

---

## Exclusão

Exclusão lógica utilizando campo ativo.