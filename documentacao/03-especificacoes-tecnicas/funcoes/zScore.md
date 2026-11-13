---
tipo: funcao
classe: Estatistica
tags: [funcao, estatistica]
---

# zScore

`static double Estatistica.zScore(double valor, List<Double> historico)` · classe [[Estatistica]]

## O que faz
Quantos **desvios padrão** o valor está longe da média do histórico: z = (valor − média) ÷ desvio. Com desvio zero ou sem histórico → NaN. Base do [[foraDaCurva]].

## Exemplo (do teste)
`zScore(7, [1..9])`: média 5, desvio 2,58 → z ≈ 0,77 (positivo, acima da média).

## Testes
`EstatisticaTest.zScorePositivoParaValorAcimaDaMedia`.
