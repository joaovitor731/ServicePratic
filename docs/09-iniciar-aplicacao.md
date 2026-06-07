# Executando a Aplicação Localmente

Para testar a aplicação localmente, você deve subir os serviços na seguinte ordem:

1. Banco de dados
2. Backend
3. Frontend

---

## 1. Configurar o Backend

Caso ainda não exista, crie um arquivo `.env` baseado no `.env.example`.

### Subir o MySQL

```bash
cd backend
npm run db:start
```

### Criar o usuário padrão (opcional)

Após o banco estar em execução, execute o seed:

```bash
npm run prisma:seed
```

Usuário padrão criado:

| Campo | Valor |
|---------|---------|
| E-mail | admin@servicepratic.local |
| Senha | admin123 |

---

## 2. Iniciar o Backend

```bash
npm run dev
```

O backend ficará disponível em:

```text
http://localhost:3000
```

---

## 3. Iniciar o Frontend

Abra outro terminal:

```bash
cd frontend
npm run dev
```

O frontend ficará disponível em:

```text
http://localhost:5173
```

---

## 4. Validar o Backend

Para verificar se o backend foi iniciado corretamente, execute:

```bash
curl http://localhost:3000/health
```

Se tudo estiver funcionando, a API deverá retornar uma resposta de sucesso.

---

## Fluxo Resumido

```bash
# Backend
cd backend
cp .env.example .env
npm run db:start
npm run prisma:seed   # opcional
npm run dev

# Frontend (novo terminal)
cd frontend
npm run dev
```

---

## Credenciais Padrão

```text
E-mail: admin@servicepratic.local
Senha:  admin123
```