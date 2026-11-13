---
tipo: classe
camada: model
arquivo: codigo/src/main/java/br/com/cuidaquemcuida/model/RegraIntervalo.java
tags: [classe, model]
---

# RegraIntervalo

**Classe** da camada **Modelo do domínio** · `codigo/src/main/java/br/com/cuidaquemcuida/model/RegraIntervalo.java`

## Para que serve
"De 8 em 8 horas, a partir das 6h": conta a partir do primeiro dia da regra, atravessando os dias.

Faz parte do [[Módulo Medicação]].

Declaração: `class RegraIntervalo extends RegraHorario`

## Campos principais
| Campo | Tipo |
|---|---|
| `intervaloHoras` | `int` |
| `primeiraDose` | `LocalTime` |

## Métodos
| Método | O que faz |
|---|---|
| `RegraIntervalo(LocalDate inicio, LocalDate fim, int intervaloHoras, LocalTime primeiraDose)` |  |
| `horariosEntre(LocalDateTime de, LocalDateTime ate) → List<LocalDateTime>` → [[horariosEntre]] |  |
| `tipo() → TipoRegra` |  |

## Usa
[[RegraHorario]], [[TipoRegra]]

## É usada por
[[RegraHorario]]

## Conceito do curso
Polimorfismo: sobrescreve horariosEntre() (Fase 3)

---
Ver também: [[Mapa do Código]] · [[Diagrama de Classes]] · [[Arquitetura]]
