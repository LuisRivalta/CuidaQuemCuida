---
tipo: funcao
classe: EscalaRegras
tags: [funcao, escala]
---

# periodosDescobertos

`static List<Intervalo> EscalaRegras.periodosDescobertos(List<Turno> doPaciente, LocalDateTime de, LocalDateTime ate)` · classe [[EscalaRegras]]

## O que faz
Para um paciente que **precisa de alguém 24 h**, encontra os intervalos dentro de [de, ate) **sem nenhum turno com pessoa**. Turno marcado como vago **não conta** como coberto. Gera o alerta [[AlertaTurnoVago]] e o botão "Posso cobrir" na escala.

Como funciona: ordena os turnos e avança um cursor. Cada vez que um turno começa depois do cursor, o pedaço entre os dois é um período descoberto.

## Exemplo (do teste)
Turnos 06–14 e 14–22, janela das 6h às 6h do dia seguinte → **[22:00, 06:00]**. Com o turno das 14–22 vago → **[14:00, 06:00]**.

## Testes
`EscalaRegrasTest.periodoDescobertoEhOIntervaloSemNinguem` e `turnoVagoNaoContaComoCoberto`.
