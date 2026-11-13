---
tipo: funcao
classe: EscalaRegras
tags: [funcao, escala, ordenacao]
---

# sugerirCobertura

`static List<Long> EscalaRegras.sugerirCobertura(Turno vago, Map<Long, List<Turno>> turnosPorPessoa, LocalDateTime agora)` · classe [[EscalaRegras]]

## O que faz
Sugere **quem pode cobrir** um turno vago: tira quem já tem turno no horário (conflito) e **ordena os demais do menos para o mais carregado** (horas nos últimos 7 dias, ver [[horasNaJanela]]). No empate, ordena pelo id. É a ideia central do produto: **redistribuir o cuidado** para tirar peso de quem está sobrecarregado.

## Exemplo (do teste)
Turno vago hoje das 22h às 6h. A pessoa 1 já tem turno das 21h às 5h (fica de fora). A pessoa 2 fez 30 h na semana e a pessoa 3 fez 10 h. **Resultado: [3, 2].**

## Testes
`EscalaRegrasTest.sugestaoExcluiQuemTemConflitoEOrdenaPelaCarga`.
