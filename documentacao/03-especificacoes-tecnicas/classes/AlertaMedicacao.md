---
tipo: classe
camada: model
arquivo: codigo/src/main/java/br/com/cuidaquemcuida/model/alerta/AlertaMedicacao.java
tags: [classe, model]
---

# AlertaMedicacao

**Classe** da camada **Modelo do domínio (alertas)** · `codigo/src/main/java/br/com/cuidaquemcuida/model/alerta/AlertaMedicacao.java`

## Para que serve
Dose próxima, atrasada ou não dada.

Faz parte do [[Módulo Hoje e Alertas]].

Declaração: `class AlertaMedicacao extends Alerta`

## Campos principais
| Campo | Tipo |
|---|---|
| `nomeRemedio` | `String` |
| `previsto` | `LocalDateTime` |

## Métodos
| Método | O que faz |
|---|---|
| `AlertaMedicacao(TipoAlerta tipo, long pacienteId, long destinatarioId, long doseId, String nomeRemedio, LocalDateTime previsto)` |  |
| `mensagem() → String` |  |

## Usa
[[Alerta]], [[TipoAlerta]]

## É usada por
[[AlertaService]]

---
Ver também: [[Mapa do Código]] · [[Diagrama de Classes]] · [[Arquitetura]]
