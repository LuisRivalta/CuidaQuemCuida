---
tipo: classe
camada: model
arquivo: codigo/src/main/java/br/com/cuidaquemcuida/model/alerta/AlertaTarefa.java
tags: [classe, model]
---

# AlertaTarefa

**Classe** da camada **Modelo do domínio (alertas)** · `codigo/src/main/java/br/com/cuidaquemcuida/model/alerta/AlertaTarefa.java`

## Para que serve
Tarefa de cuidado atrasada (ex.: mudar de posição).

Faz parte do [[Módulo Hoje e Alertas]].

Declaração: `class AlertaTarefa extends Alerta`

## Campos principais
| Campo | Tipo |
|---|---|
| `titulo` | `String` |
| `prevista` | `LocalDateTime` |

## Métodos
| Método | O que faz |
|---|---|
| `AlertaTarefa(long pacienteId, long destinatarioId, long execucaoId, String titulo, LocalDateTime prevista)` |  |
| `mensagem() → String` |  |

## Usa
[[Alerta]], [[TipoAlerta]]

## É usada por
[[AlertaService]]

---
Ver também: [[Mapa do Código]] · [[Diagrama de Classes]] · [[Arquitetura]]
