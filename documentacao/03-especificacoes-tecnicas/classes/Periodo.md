---
tipo: enum
camada: model
arquivo: codigo/src/main/java/br/com/cuidaquemcuida/model/Periodo.java
tags: [classe, model]
---

# Periodo

**Enum** da camada **Modelo do domínio** · `codigo/src/main/java/br/com/cuidaquemcuida/model/Periodo.java`

## Para que serve
Períodos do dia usados nas estatísticas de adesão.

Faz parte do [[Módulo Painel Estatístico]].

## Métodos
| Método | O que faz |
|---|---|
| `de(LocalTime hora) → estático Periodo` | 00:00–05:59 madrugada, 06:00–11:59 manhã, 12:00–17:59 tarde, 18:00–23:59 noite. |

## É usada por
[[Dtos]], [[EstatisticaService]]

## Testes
`PeriodoTest` (JUnit 5) em `codigo/src/test/java/`. Ver [[Testes e Validação]].

## Conceito do curso
Enum com método estático de classificação

---
Ver também: [[Mapa do Código]] · [[Diagrama de Classes]] · [[Arquitetura]]
