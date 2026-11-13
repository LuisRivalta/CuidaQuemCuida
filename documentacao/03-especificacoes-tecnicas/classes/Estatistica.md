---
tipo: classe
camada: service
arquivo: codigo/src/main/java/br/com/cuidaquemcuida/service/Estatistica.java
tags: [classe, service]
---

# Estatistica

**Classe** da camada **Serviços e regras de negócio** · `codigo/src/main/java/br/com/cuidaquemcuida/service/Estatistica.java`

## Para que serve
Medidas estatísticas do painel (Fase 1: média e moda; Fase 2: dispersão e chance; Fase 5: fora da curva). Sem dados suficientes, devolve `Double.NaN`: quem chama transforma em "Dados insuficientes".

Faz parte do [[Módulo Painel Estatístico]].

## Métodos
| Método | O que faz |
|---|---|
| `media(List<Double> valores) → estático double` |  |
| `mediana(List<Double> valores) → estático double` |  |
| `moda(List<Double> valores) → estático double` | Valor mais frequente. No empate, o menor deles. |
| `desvioPadrao(List<Double> valores) → estático double` → [[desvioPadrao]] | Desvio padrão populacional (a rede inteira é a população, não uma amostra). |
| `coeficienteVariacao(List<Double> valores) → estático double` | Desvio padrão ÷ média: 0 = carga igual entre todos; quanto maior, mais desigual. |
| `mediaMovel(List<Double> serie, int janela) → estático List<Double>` → [[mediaMovel]] | Para cada posição, a média dos até `janela` últimos valores (inclusive o atual). |
| `pearson(double[] x, double[] y) → estático double` → [[pearson]] | Correlação de Pearson, de -1 a 1. Menos de 2 pontos ou variância zero: NaN. |
| `zScore(double valor, List<Double> historico) → estático double` → [[zScore]] | Quantos desvios padrão o valor está longe da média do histórico. |

## É usada por
[[EstatisticaService]], [[SinalVitalRegras]]

## Testes
`EstatisticaTest` (JUnit 5) em `codigo/src/test/java/`. Ver [[Testes e Validação]].

## Conceito do curso
Média e moda (Fase 1), dispersão (Fase 2: "Spreadable data"), fora da curva (Fase 5), correlação

---
Ver também: [[Mapa do Código]] · [[Diagrama de Classes]] · [[Arquitetura]]
