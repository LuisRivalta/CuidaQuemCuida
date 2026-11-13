---
tipo: classe
camada: model
arquivo: codigo/src/main/java/br/com/cuidaquemcuida/model/ExecucaoTarefa.java
tags: [classe, model]
---

# ExecucaoTarefa

**Classe** da camada **Modelo do domínio** · `codigo/src/main/java/br/com/cuidaquemcuida/model/ExecucaoTarefa.java`

## Para que serve
Uma ocorrência prevista de uma tarefa de cuidado e quem a fez. Tabela `execucao_tarefa`.

Faz parte do [[Módulo Protocolo de Cuidado]].

## Campos principais
| Campo | Tipo |
|---|---|
| `id` | `Long` |
| `tarefaId` | `long` |
| `previstaPara` | `LocalDateTime` |
| `feitaEm` | `LocalDateTime` |
| `feitaPor` | `Long` |

## Métodos
| Método | O que faz |
|---|---|
| `ExecucaoTarefa(Long id, long tarefaId, LocalDateTime previstaPara, LocalDateTime feitaEm, Long feitaPor)` |  |
| `feita() → boolean` |  |

## É usada por
[[AlertaService]], [[HojeService]], [[TarefaDao]], [[TarefaService]]

---
Ver também: [[Mapa do Código]] · [[Diagrama de Classes]] · [[Arquitetura]]
