---
titulo: Estatística
tags: [especificacao, estatistica, painel]
---

# Estatística

Os indicadores do [[Módulo Painel Estatístico]]: o que medem, como são calculados, onde estão no código e como ler. Ver [[Design da Solução]] (seção 6).

> Os dados da demonstração são **simulados** (`banco/03-dados-demo.sql`) e foram montados para contar a história real do problema: a filha carregando cerca de 60% do cuidado, sem folga, e as noites ligadas a mais sobrecarga.

## Indicadores
| Indicador | O que mede | Como é calculado | Onde | Conteúdo do curso |
|---|---|---|---|---|
| **Adesão aos remédios** (geral, por remédio, por período) | Quanto dos remédios saiu no horário | doses DADAS (até 30 min) ÷ doses previstas já vencidas, nos últimos 30 dias | SQL: `GROUP BY` com `COUNT(*) FILTER (WHERE status = 'DADA')`; período por `CASE` na hora | Fase 6: agrupamentos, totais e métricas |
| **Quem carrega o cuidado** | % das horas de turno de cada pessoa | `SUM` das horas recortadas no período, com `JOIN` turno × pessoa | SQL | Fase 5: junções |
| **Acima da média** | Quem faz mais horas que a média da rede | `HAVING SUM(horas) > (SELECT AVG(...) FROM (...))` | SQL | Fase 6: subconsultas |
| **Equilíbrio da rede** | O quanto a carga é desigual | desvio padrão populacional e coeficiente de variação das horas por membro | Java ([[desvioPadrao]]) | Fase 2: "Spreadable data" |
| **Média móvel de 7 dias** | Tendência das horas de cuidado por dia, por pessoa | soma deslizante dos 7 últimos dias ÷ 7 | Java ([[mediaMovel]]) | Fase 1: média |
| **Média, mediana e moda** | Duração típica dos turnos; pontuação típica da Zarit | ordenação (mediana) e contagem de frequência (moda) | Java ([[Estatistica]]) | Fase 1: "Está na média ou na moda?" |
| **Horário com mais atrasos** | Hora do dia em que mais se atrasa remédio (a moda) | `GROUP BY hora ORDER BY COUNT(*) DESC LIMIT 1` | SQL | Fase 1 e Fase 6 |
| **Chance de atraso** | P(atraso \| noite) × P(atraso \| dia) | frequência relativa: atrasadas ÷ total, separando 22h–6h | Java ([[EstatisticaService]]) | Fase 2: "Qual é a chance de...?" |
| **Noites × sobrecarga** | Se quem faz mais noites tem mais sobrecarga | correlação de Pearson; cada avaliação Zarit é um ponto (x = noites nos 14 dias antes) | Java ([[pearson]]) | Fase 1 e 2 |
| **Noites × qualidade do sono** | Se quem faz mais noites dorme pior | idem, com y = qualidade do sono | Java ([[pearson]]) | — |
| **Sinal fora da curva** | Medição estranha para aquele paciente | z-score > 2 com ≥ 7 medições | Java ([[foraDaCurva]]) | Fase 5: "É fora da curva!" |

## Como ler (o que a tela diz)
- **Correlação:** de −1 a 1. |r| ≥ 0,7 é forte; ≥ 0,4 moderada; ≥ 0,2 fraca; abaixo disso, "praticamente sem relação". A tela traduz em frase ("quem faz mais turnos noturnos tende a ter mais sobrecarga") e lembra que **correlação não é causa**.
- **Coeficiente de variação:** acima de 0,5 = "carga muito desigual"; de 0,25 a 0,5 = "desigual"; abaixo = "bem dividida".
- **Chance de atraso:** a tela mostra quantas vezes a noite é pior que o dia.

## Cuidados com dados insuficientes
- Toda medida sem dados suficientes (lista vazia, menos de 2 pontos, variância zero, divisão por zero) vira **NaN** no Java, **`null`** no JSON (o JSON não aceita NaN) e **"Dados insuficientes"** na tela. Função `EstatisticaService.paraJson`, testada em `EstatisticaServiceTest.nanViraNull`.
- As estatísticas da Zarit usam **só quem compartilhou** com o coordenador, e o painel mostra "N de M compartilharam".

## Visualização
- Gráficos com Chart.js; **paleta categórica validada para daltonismo** (azul, laranja, verde-água e amarelo, nessa ordem fixa). A cor segue a pessoa, nunca a posição no ranking.
- Toda série tem **legenda** e **"Ver em tabela"** (os dois tons mais claros têm contraste abaixo de 3:1 e precisam desse apoio).
- Barras de "quem carrega" com o rótulo direto (%); valores fora da faixa marcados com cor **e** texto, nunca só pela cor.
