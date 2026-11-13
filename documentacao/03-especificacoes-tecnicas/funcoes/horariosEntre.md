---
tipo: funcao
classe: RegraHorario
tags: [funcao, medicacao, polimorfismo]
---

# horariosEntre

`abstract List<LocalDateTime> RegraHorario.horariosEntre(LocalDateTime de, LocalDateTime ate)` · classes [[RegraHorario]], [[RegraIntervalo]], [[RegraHorariosFixos]], [[RegraDiasAlternados]] · [[Módulo Medicação]]

## O que faz
Devolve os horários previstos das doses dentro de [de, ate), **em ordem e sem repetição**, respeitando o início e o fim da regra. É o exemplo principal de **polimorfismo** do projeto: o serviço chama o mesmo método sem saber o tipo da regra, e cada subclasse calcula do seu jeito.

| Subclasse | Regra | Como calcula |
|---|---|---|
| [[RegraIntervalo]] | "De 8 em 8 horas a partir das 6h" | Conta a partir do primeiro dia e pula direto para a primeira dose depois de `de` (não percorre os dias anteriores) |
| [[RegraHorariosFixos]] | "Todo dia às 8h e às 20h" | Para cada dia vigente, cada horário |
| [[RegraDiasAlternados]] | "Dia sim, dia não, às 9h" | Igual aos horários fixos, mas o gancho `valeNoDia()` só aceita os dias pares contados a partir do início |

Chamar duas vezes com o mesmo período dá **a mesma lista**. Junto com a `UNIQUE (medicamento_id, previsto_para)` do banco, isso garante que **as doses não duplicam** quando a tela é aberta várias vezes (ver [[garantirDoses]]).

## Exemplos (do teste)
- 8 em 8 horas a partir das 6h → [06:00, 14:00, 22:00] no dia, e de novo nos dias seguintes.
- Horários fixos 08:00 e 20:00 em 2 dias → 4 doses.
- Dias alternados com início no dia 1 → dia 1 sim, dia 2 não, dia 3 sim.
- Fora do início ou do fim da regra → lista vazia.

## Testes
`RegraHorarioTest` (7 testes, incluindo `geracaoIdempotente` e `criarMontaASubclasseCertaPeloTipo`).
