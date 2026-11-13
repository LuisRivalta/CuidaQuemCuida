---
tipo: funcao
classe: Estatistica
tags: [funcao, estatistica]
---

# mediaMovel

`static List<Double> Estatistica.mediaMovel(List<Double> serie, int janela)` · classe [[Estatistica]] · [[Módulo Painel Estatístico]]

## O que faz
Para cada posição da série, calcula a **média dos até `janela` últimos valores**, inclusive o atual. Suaviza o sobe e desce de um dia para o outro e mostra a **tendência** das horas de cuidado de cada pessoa no painel (janela de 7 dias).

Implementação com **soma deslizante**: soma o novo valor e subtrai o que saiu da janela. É O(n), sem recalcular a soma inteira a cada dia.

## Exemplo (do teste)
`mediaMovel([1, 2, 3, 4, 5], 3)` = **[1,0; 1,5; 2,0; 3,0; 4,0]**.

## Testes
`EstatisticaTest.mediaMovelUsaOsUltimosValoresDisponiveis`.
