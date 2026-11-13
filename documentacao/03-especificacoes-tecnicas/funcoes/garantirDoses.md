---
tipo: funcao
classe: MedicacaoService
tags: [funcao, medicacao, banco]
---

# garantirDoses

`static void MedicacaoService.garantirDoses(long pacienteId, LocalDate dia)` · classe [[MedicacaoService]] · usa [[DoseDao]]

## O que faz
Cria no banco as **doses previstas do dia** que ainda não existem: para cada remédio ativo, pede os horários à regra ([[horariosEntre]]) e insere cada um com:

```sql
INSERT INTO dose (medicamento_id, previsto_para) VALUES (?, ?)
ON CONFLICT (medicamento_id, previsto_para) DO NOTHING
```

Pode ser chamada **quantas vezes for**, ao abrir a tela Hoje, a lista de doses ou os alertas: a restrição `UNIQUE` do banco garante que **nada duplica**. Tudo roda numa **transação** (uma conexão só).

Por que não uma rotina agendada? Gerar "sob demanda" dispensa um processo rodando em segundo plano, e o resultado é o mesmo para quem usa.

## Verificação
Teste de idempotência da regra em `RegraHorarioTest.geracaoIdempotente`. O comportamento no banco é conferido no teste de ponta a ponta (B4): abrir a tela de doses duas vezes não muda a contagem.
