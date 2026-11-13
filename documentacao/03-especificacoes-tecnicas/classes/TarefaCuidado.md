---
tipo: classe
camada: model
arquivo: codigo/src/main/java/br/com/cuidaquemcuida/model/TarefaCuidado.java
tags: [classe, model]
---

# TarefaCuidado

**Classe** da camada **Modelo do domínio** · `codigo/src/main/java/br/com/cuidaquemcuida/model/TarefaCuidado.java`

## Para que serve
Tarefa do protocolo de cuidado (ex.: mudar de posição a cada 2 h para evitar escara). Com `tipoSinal` preenchido, a tarefa é uma medição (ex.: "Medir pressão"). Tabela `tarefa_cuidado`.

Faz parte do [[Módulo Protocolo de Cuidado]].

## Campos principais
| Campo | Tipo |
|---|---|
| `id` | `Long` |
| `pacienteId` | `long` |
| `titulo` | `String` |
| `orientacao` | `String` |
| `recorrenciaHoras` | `int` |
| `primeiraVez` | `LocalTime` |
| `tipoSinal` | `TipoSinal` |
| `ativa` | `boolean` |

## Métodos
| Método | O que faz |
|---|---|
| `TarefaCuidado(Long id, long pacienteId, String titulo, String orientacao, int recorrenciaHoras, LocalTime primeiraVez, TipoSinal tipoSinal, boolean ativa)` |  |
| `horariosDoDia(LocalDate dia) → List<LocalDateTime>` | Horários da tarefa num dia: primeira vez + k × recorrência, dando a volta no relógio (módulo 24 h). Assim, "a cada 2 h a partir das 6h" também acontece de madrugada, no turno da noite. |
| `medicao() → boolean` |  |

## Usa
[[TipoSinal]]

## É usada por
[[AlertaService]], [[HojeService]], [[TarefaDao]], [[TarefaService]]

## Testes
`TarefaCuidadoTest` (JUnit 5) em `codigo/src/test/java/`. Ver [[Testes e Validação]].

---
Ver também: [[Mapa do Código]] · [[Diagrama de Classes]] · [[Arquitetura]]
