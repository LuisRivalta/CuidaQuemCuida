---
tipo: classe
camada: service
arquivo: codigo/src/main/java/br/com/cuidaquemcuida/service/SinalVitalRegras.java
tags: [classe, service]
---

# SinalVitalRegras

**Classe** da camada **Serviços e regras de negócio** · `codigo/src/main/java/br/com/cuidaquemcuida/service/SinalVitalRegras.java`

## Para que serve
Regras de alerta dos sinais vitais.

Faz parte do [[Módulo Sinais Vitais]].

## Métodos
| Método | O que faz |
|---|---|
| `foraDaFaixa(double valor, FaixaSinal faixa) → estático boolean` | Fora do mínimo ou do máximo configurado para o paciente. Sem faixa configurada, nunca. |
| `foraDaCurva(double valor, List<Double> historico) → estático boolean` → [[foraDaCurva]] | "Fora da curva" (Fase 5): /z/ > 2 em relação às medições anteriores do mesmo paciente, com pelo menos 7 delas. |

## Usa
[[Estatistica]], [[FaixaSinal]], [[Limites]]

## É usada por
[[SinalVitalService]]

## Testes
`SinalVitalRegrasTest` (JUnit 5) em `codigo/src/test/java/`. Ver [[Testes e Validação]].

## Conceito do curso
"É fora da curva!" (Fase 5): z-score

---
Ver também: [[Mapa do Código]] · [[Diagrama de Classes]] · [[Arquitetura]]
