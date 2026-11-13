---
tipo: classe
camada: model
arquivo: codigo/src/main/java/br/com/cuidaquemcuida/model/SinalVital.java
tags: [classe, model]
---

# SinalVital

**Classe** da camada **Modelo do domínio** · `codigo/src/main/java/br/com/cuidaquemcuida/model/SinalVital.java`

## Para que serve
Uma medição de sinal vital. Na pressão, `valor` é a máxima e `valor2` a mínima. Tabela `sinal_vital`.

Faz parte do [[Módulo Sinais Vitais]].

## Campos principais
| Campo | Tipo |
|---|---|
| `id` | `Long` |
| `pacienteId` | `long` |
| `tipo` | `TipoSinal` |
| `valor` | `double` |
| `valor2` | `Double` |
| `medidoEm` | `LocalDateTime` |
| `medidoPor` | `Long` |

## Métodos
| Método | O que faz |
|---|---|
| `SinalVital(Long id, long pacienteId, TipoSinal tipo, double valor, Double valor2, LocalDateTime medidoEm, Long medidoPor)` |  |

## Usa
[[TipoSinal]]

## É usada por
[[SinalVitalDao]], [[SinalVitalService]]

---
Ver também: [[Mapa do Código]] · [[Diagrama de Classes]] · [[Arquitetura]]
