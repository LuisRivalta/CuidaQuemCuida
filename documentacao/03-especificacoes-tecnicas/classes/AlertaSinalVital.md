---
tipo: classe
camada: model
arquivo: codigo/src/main/java/br/com/cuidaquemcuida/model/alerta/AlertaSinalVital.java
tags: [classe, model]
---

# AlertaSinalVital

**Classe** da camada **Modelo do domínio (alertas)** · `codigo/src/main/java/br/com/cuidaquemcuida/model/alerta/AlertaSinalVital.java`

## Para que serve
Sinal vital fora da faixa combinada ou fora do padrão do próprio paciente.

Faz parte do [[Módulo Hoje e Alertas]].

Declaração: `class AlertaSinalVital extends Alerta`

## Campos principais
| Campo | Tipo |
|---|---|
| `tipoSinal` | `TipoSinal` |
| `valor` | `double` |
| `valor2` | `Double` |
| `nomePaciente` | `String` |

## Métodos
| Método | O que faz |
|---|---|
| `AlertaSinalVital(TipoAlerta tipo, long pacienteId, long destinatarioId, long sinalId, TipoSinal tipoSinal, double valor, Double valor2, String nomePaciente)` |  |
| `mensagem() → String` |  |

## Usa
[[Alerta]], [[TipoAlerta]], [[TipoSinal]]

## É usada por
[[SinalVitalService]]

---
Ver também: [[Mapa do Código]] · [[Diagrama de Classes]] · [[Arquitetura]]
