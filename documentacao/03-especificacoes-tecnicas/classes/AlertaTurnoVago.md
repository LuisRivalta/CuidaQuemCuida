---
tipo: classe
camada: model
arquivo: codigo/src/main/java/br/com/cuidaquemcuida/model/alerta/AlertaTurnoVago.java
tags: [classe, model]
---

# AlertaTurnoVago

**Classe** da camada **Modelo do domínio (alertas)** · `codigo/src/main/java/br/com/cuidaquemcuida/model/alerta/AlertaTurnoVago.java`

## Para que serve
Período sem ninguém na escala (paciente que precisa de acompanhamento 24 h).

Faz parte do [[Módulo Hoje e Alertas]].

Declaração: `class AlertaTurnoVago extends Alerta`

## Campos principais
| Campo | Tipo |
|---|---|
| `inicio` | `LocalDateTime` |
| `fim` | `LocalDateTime` |

## Métodos
| Método | O que faz |
|---|---|
| `AlertaTurnoVago(long pacienteId, long destinatarioId, LocalDateTime inicio, LocalDateTime fim)` |  |
| `mensagem() → String` |  |

## Usa
[[Alerta]], [[TipoAlerta]]

## É usada por
[[AlertaService]]

---
Ver também: [[Mapa do Código]] · [[Diagrama de Classes]] · [[Arquitetura]]
