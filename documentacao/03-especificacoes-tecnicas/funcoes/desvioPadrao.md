---
tipo: funcao
classe: Estatistica
tags: [funcao, estatistica, dispersao]
---

# desvioPadrao

`static double Estatistica.desvioPadrao(List<Double> valores)` e `coeficienteVariacao(List<Double>)` · classe [[Estatistica]]

## O que faz
- **Desvio padrão populacional** (√ da média dos quadrados das distâncias até a média). É populacional porque a rede inteira é a população, não uma amostra.
- **Coeficiente de variação** = desvio ÷ média. Sem unidade: 0 = carga igual para todos; quanto maior, mais desigual.

No painel, aplicado às horas de cuidado de cada membro, vira o **"equilíbrio da rede"**: CV acima de 0,5 = "carga muito desigual". Conteúdo do curso: **Fase 2, "Spreadable data"** (dispersão).

## Exemplo (do teste)
[2, 4, 4, 4, 5, 5, 7, 9] → média 5, **desvio 2**, **CV 0,4**. Lista vazia → NaN. Média zero → CV NaN.

## Testes
`EstatisticaTest.mediaEDesvioPadraoPopulacional` e `coeficienteDeVariacaoEhDesvioSobreMedia`.
