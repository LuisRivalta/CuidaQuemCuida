---
tipo: funcao
classe: EscalaRegras
tags: [funcao, escala, sobrecarga]
---

# horasNaJanela

`static double EscalaRegras.horasNaJanela(List<Turno> turnos, LocalDateTime fim, int dias)` · classe [[EscalaRegras]]

## O que faz
Soma as horas de turno dentro da janela **[fim − dias, fim)**, **recortando** os turnos que passam das bordas. Com `dias = 7` e `fim = agora`, dá as "horas nos últimos 7 dias" de cada pessoa (sobrecarga, sugestão de cobertura e lista de membros).

## Exemplo (do teste)
Janela de 7 dias terminando hoje às 12h. Turnos: um de 8 dias atrás (fora da janela), uma noite de 22h às 6h dentro da janela (8 h) e o turno de hoje das 6h às 14h, recortado até as 12h (6 h). **Resultado: 14 h.**

## Testes
`EscalaRegrasTest.horasNaJanelaRecortaOsTurnos`.
