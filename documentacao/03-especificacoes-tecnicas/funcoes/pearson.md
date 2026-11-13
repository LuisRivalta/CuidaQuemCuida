---
tipo: funcao
classe: Estatistica
tags: [funcao, estatistica, correlacao]
---

# pearson

`static double Estatistica.pearson(double[] x, double[] y)` · classe [[Estatistica]] · [[Módulo Painel Estatístico]]

## O que faz
Calcula a **correlação de Pearson** (de −1 a 1) entre duas séries: o quanto elas "andam juntas".

r = Σ(x − x̄)(y − ȳ) / √(Σ(x − x̄)² · Σ(y − ȳ)²)

Com menos de 2 pontos, ou com uma série constante (variância zero), devolve **NaN**. A API transforma em `null` e a tela mostra "Dados insuficientes" (ver [[Estatística]]).

## Onde é usada
No painel, para responder à pergunta do projeto: **quem faz mais turnos noturnos fica mais sobrecarregado?**
- x = turnos noturnos da pessoa nos 14 dias antes de cada avaliação Zarit;
- y = pontuação Zarit (e, numa segunda correlação, qualidade do sono).

Só entram as avaliações de quem **compartilhou** com o coordenador. Correlação mostra que as coisas andam juntas, **não que uma causa a outra**, e a tela diz isso.

## Exemplos (do teste)
x = [1, 2, 3, 4, 5]: com y = [2, 4, 6, 8, 10] → **1,0**; com y = [10, 8, 6, 4, 2] → **−1,0**. Um ponto só, ou x constante → NaN.

## Testes
`EstatisticaTest.pearsonPerfeitoPositivoENegativo` e `semDadosSuficientesDevolveNaN`.
