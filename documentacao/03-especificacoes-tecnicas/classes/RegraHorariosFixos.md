---
tipo: classe
camada: model
arquivo: codigo/src/main/java/br/com/cuidaquemcuida/model/RegraHorariosFixos.java
tags: [classe, model]
---

# RegraHorariosFixos

**Classe** da camada **Modelo do domínio** · `codigo/src/main/java/br/com/cuidaquemcuida/model/RegraHorariosFixos.java`

## Para que serve
"Todo dia às 8h e às 20h".

Faz parte do [[Módulo Medicação]].

Declaração: `class RegraHorariosFixos extends RegraHorario`

## Campos principais
| Campo | Tipo |
|---|---|
| `horarios` | `List<LocalTime>` |

## Métodos
| Método | O que faz |
|---|---|
| `RegraHorariosFixos(LocalDate inicio, LocalDate fim, List<LocalTime> horarios)` |  |
| `horariosEntre(LocalDateTime de, LocalDateTime ate) → List<LocalDateTime>` → [[horariosEntre]] |  |
| `valeNoDia(LocalDate dia) → boolean` | Ponto de extensão: a regra de dias alternados troca só esta decisão. |
| `tipo() → TipoRegra` |  |

## Usa
[[RegraHorario]], [[TipoRegra]]

## É usada por
[[RegraDiasAlternados]], [[RegraHorario]]

## Conceito do curso
Polimorfismo e método gancho valeNoDia() (Fase 3)

---
Ver também: [[Mapa do Código]] · [[Diagrama de Classes]] · [[Arquitetura]]
