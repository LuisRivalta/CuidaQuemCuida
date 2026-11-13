---
tipo: funcao
classe: SinalVitalRegras
tags: [funcao, sinais-vitais, estatistica]
---

# foraDaCurva

`static boolean SinalVitalRegras.foraDaCurva(double valor, List<Double> historico)` · classe [[SinalVitalRegras]] · [[Módulo Sinais Vitais]]

## O que faz
Diz se uma medição está **fora do padrão do próprio paciente**: o [[zScore]] em relação às medições anteriores do mesmo tipo é maior que **2** (em módulo). Só avalia com **pelo menos 7 medições**; com menos, não há base para comparar.

Complementa a faixa fixa (`foraDaFaixa`). Uma pressão de 145 pode estar dentro da faixa combinada (até 150) e mesmo assim ser estranha para quem sempre fica em 125. Conteúdo do curso: **Fase 5, "É fora da curva!"**.

## Exemplo (do teste)
Histórico [130, 128, 132, 129, 131, 130, 127, 133]: média 130, desvio padrão 1,87.
- **175** → z = 24 → fora da curva.
- **131** → z = 0,5 → normal.
- Só 6 medições → nunca fora da curva.

## Testes
`SinalVitalRegrasTest` (4 testes).
