---
tipo: classe abstrata
camada: model
arquivo: codigo/src/main/java/br/com/cuidaquemcuida/model/alerta/Alerta.java
tags: [classe, model]
---

# Alerta

**Classe abstrata** da camada **Modelo do domínio (alertas)** · `codigo/src/main/java/br/com/cuidaquemcuida/model/alerta/Alerta.java`

## Para que serve
Um aviso para uma pessoa da rede. Cada tipo de alerta é uma subclasse que monta a própria mensagem (polimorfismo, Fase 3). A `referencia` identifica o fato (ex.: "dose:301") e, junto com o tipo e o destinatário, impede gravar o mesmo alerta duas vezes.

Faz parte do [[Módulo Hoje e Alertas]].

## Campos principais
| Campo | Tipo |
|---|---|
| `tipo` | `TipoAlerta` |
| `pacienteId` | `long` |
| `destinatarioId` | `long` |
| `referencia` | `String` |

## Métodos
| Método | O que faz |
|---|---|
| `Alerta(TipoAlerta tipo, long pacienteId, long destinatarioId, String referencia)` |  |
| `prioridade() → int` |  |
| `hora(LocalDateTime instante) → estático String` | "14h" ou "14h30". |
| `diaDaSemana(LocalDateTime instante) → estático String` | "Domingo". |
| `numero(double valor) → estático String` | Remove casas decimais desnecessárias: 175.0 -> "175". |
| `mensagem() → String (abstrato)` | Texto em português simples que aparece na tela. |

## Usa
[[TipoAlerta]]

## É usada por
[[AlertaConflito]], [[AlertaDao]], [[AlertaMedicacao]], [[AlertaPedidoAjuda]], [[AlertaService]], [[AlertaSinalVital]], [[AlertaSobrecarga]], [[AlertaTarefa]], [[AlertaTurnoVago]]

## Conceito do curso
Classe abstrata; cada subclasse implementa mensagem() (polimorfismo, Fase 3)

---
Ver também: [[Mapa do Código]] · [[Diagrama de Classes]] · [[Arquitetura]]
