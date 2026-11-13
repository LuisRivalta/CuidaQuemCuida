---
tipo: classe
camada: model
arquivo: codigo/src/main/java/br/com/cuidaquemcuida/model/alerta/AlertaSobrecarga.java
tags: [classe, model]
---

# AlertaSobrecarga

**Classe** da camada **Modelo do domínio (alertas)** · `codigo/src/main/java/br/com/cuidaquemcuida/model/alerta/AlertaSobrecarga.java`

## Para que serve
Pessoa com horas demais na semana ou sem folga. Referência por pessoa e dia, para avisar no máximo uma vez por dia.

Faz parte do [[Módulo Hoje e Alertas]].

Declaração: `class AlertaSobrecarga extends Alerta`

## Campos principais
| Campo | Tipo |
|---|---|
| `nomePessoa` | `String` |
| `horas7d` | `double` |
| `horasSeguidas` | `double` |

## Métodos
| Método | O que faz |
|---|---|
| `AlertaSobrecarga(long pacienteId, long destinatarioId, long pessoaId, String nomePessoa, double horas7d, double horasSeguidas, LocalDate dia)` |  |
| `mensagem() → String` |  |

## Usa
[[Alerta]], [[TipoAlerta]]

## É usada por
[[AlertaService]]

---
Ver também: [[Mapa do Código]] · [[Diagrama de Classes]] · [[Arquitetura]]
