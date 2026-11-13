---
tipo: enum
camada: model
arquivo: codigo/src/main/java/br/com/cuidaquemcuida/model/alerta/TipoAlerta.java
tags: [classe, model]
---

# TipoAlerta

**Enum** da camada **Modelo do domínio (alertas)** · `codigo/src/main/java/br/com/cuidaquemcuida/model/alerta/TipoAlerta.java`

## Para que serve
Tipos de alerta e a prioridade de cada um (maior aparece primeiro).

Faz parte do [[Módulo Hoje e Alertas]].

## Campos principais
| Campo | Tipo |
|---|---|
| `prioridade` | `int` |

## Métodos
| Método | O que faz |
|---|---|
| `prioridade() → int` |  |

## É usada por
[[Alerta]], [[AlertaConflito]], [[AlertaDao]], [[AlertaMedicacao]], [[AlertaPedidoAjuda]], [[AlertaService]], [[AlertaSinalVital]], [[AlertaSobrecarga]], [[AlertaTarefa]], [[AlertaTurnoVago]], [[Dtos]], [[SinalVitalService]]

## Conceito do curso
Enum com dados (prioridade)

---
Ver também: [[Mapa do Código]] · [[Diagrama de Classes]] · [[Arquitetura]]
