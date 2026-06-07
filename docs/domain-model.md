# Domain Model

## Usuario

Representa o usuário autenticado do sistema.

Campos:

- id
- nome
- email
- senha_hash
- ativo

---

## Cliente

Representa o cliente proprietário dos equipamentos.

Campos:

- id
- nome
- telefone
- email
- endereco
- observacao

---

## Equipamento

Representa um equipamento pertencente a um cliente.

Campos:

- id
- cliente_id
- tipo
- marca
- modelo
- numero_serie
- defeito_relatado

---

## OrdemServico

Representa um atendimento.

Campos:

- id
- numero
- cliente_id
- equipamento_id
- problema_relatado
- status
- data_abertura
- data_fechamento

---

## HistoricoOrdemServico

Representa as alterações realizadas em uma OS.

Campos:

- id
- ordem_servico_id
- usuario_id
- status_anterior
- status_novo
- observacao
- data_evento