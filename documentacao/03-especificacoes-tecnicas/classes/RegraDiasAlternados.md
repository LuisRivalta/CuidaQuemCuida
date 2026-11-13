---
tipo: classe
camada: model
arquivo: codigo/src/main/java/br/com/cuidaquemcuida/model/RegraDiasAlternados.java
tags: [classe, model]
---

# RegraDiasAlternados

**Classe** da camada **Modelo do domínio** · `codigo/src/main/java/br/com/cuidaquemcuida/model/RegraDiasAlternados.java`

## Para que serve
"Dia sim, dia não": os mesmos horários fixos, só nos dias pares contados a partir do início.

Faz parte do [[Módulo Medicação]].

Declaração: `class RegraDiasAlternados extends RegraHorariosFixos`

## Métodos
| Método | O que faz |
|---|---|
| `RegraDiasAlternados(LocalDate inicio, LocalDate fim, List<LocalTime> horarios)` |  |
| `valeNoDia(LocalDate dia) → boolean` |  |
| `tipo() → TipoRegra` |  |

## Usa
[[RegraHorariosFixos]], [[TipoRegra]]

## É usada por
[[RegraHorario]]

## Conceito do curso
Herança em dois níveis: só troca valeNoDia() (Fase 3)

---
Ver também: [[Mapa do Código]] · [[Diagrama de Classes]] · [[Arquitetura]]
