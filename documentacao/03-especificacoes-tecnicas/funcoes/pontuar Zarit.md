---
tipo: funcao
classe: ZaritCalculadora
tags: [funcao, zarit, bem-estar]
---

# pontuar Zarit

`static int ZaritCalculadora.pontuar(int[] respostas)` e `static FaixaZarit ZaritCalculadora.faixa(int pontuacao)` · classe [[ZaritCalculadora]] · [[Módulo Bem-estar]] · [[Escala Zarit]]

## O que faz
- `pontuar`: confere que são **exatamente 12 respostas**, cada uma de **0 (nunca) a 4 (sempre)**, e soma, dando de 0 a 48. Entrada inválida → `IllegalArgumentException`, que a API devolve como 400.
- `faixa`: **BAIXA** até 10, **MODERADA** de 11 a 20, **ALTA** acima de 20 (formulário ZBI-12).

## Exemplos (do teste)
Doze respostas "2" → 24 pontos → ALTA. Doze "0" → 0 → BAIXA. `faixa(10)` = BAIXA, `faixa(11)` = MODERADA, `faixa(21)` = ALTA. Onze respostas, ou uma resposta 5 → recusado.

## Testes
`ZaritCalculadoraTest` (4 testes).
