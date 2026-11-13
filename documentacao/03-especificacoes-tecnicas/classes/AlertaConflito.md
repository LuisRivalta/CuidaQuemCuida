---
tipo: classe
camada: model
arquivo: codigo/src/main/java/br/com/cuidaquemcuida/model/alerta/AlertaConflito.java
tags: [classe, model]
---

# AlertaConflito

**Classe** da camada **Modelo do domínio (alertas)** · `codigo/src/main/java/br/com/cuidaquemcuida/model/alerta/AlertaConflito.java`

## Para que serve
Mesma pessoa com dois turnos ao mesmo tempo.

Faz parte do [[Módulo Hoje e Alertas]].

Declaração: `class AlertaConflito extends Alerta`

## Campos principais
| Campo | Tipo |
|---|---|
| `nomePessoa` | `String` |
| `a` | `Turno` |
| `b` | `Turno` |

## Métodos
| Método | O que faz |
|---|---|
| `AlertaConflito(long pacienteId, long destinatarioId, String nomePessoa, Turno a, Turno b)` |  |
| `mensagem() → String` |  |

## Usa
[[Alerta]], [[TipoAlerta]], [[Turno]]

## É usada por
[[AlertaService]]

---
Ver também: [[Mapa do Código]] · [[Diagrama de Classes]] · [[Arquitetura]]
