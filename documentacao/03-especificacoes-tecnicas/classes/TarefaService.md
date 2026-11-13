---
tipo: classe
camada: service
arquivo: codigo/src/main/java/br/com/cuidaquemcuida/service/TarefaService.java
tags: [classe, service]
---

# TarefaService

**Classe** da camada **Serviços e regras de negócio** · `codigo/src/main/java/br/com/cuidaquemcuida/service/TarefaService.java`

## Para que serve
Protocolo de cuidado: tarefas recorrentes e quem as fez.

Faz parte do [[Módulo Protocolo de Cuidado]].

## Métodos
| Método | O que faz |
|---|---|
| `dto(TarefaCuidado t) → estático TarefaDto` |  |
| `listar(long eu, long pacienteId) → estático List<TarefaDto>` |  |
| `criar(long eu, long pacienteId, TarefaDto dados) → estático TarefaDto` |  |
| `atualizar(long eu, long tarefaId, TarefaDto dados) → estático TarefaDto` |  |
| `apagar(long eu, long tarefaId) → estático void` |  |
| `garantirExecucoes(long pacienteId, LocalDate dia) → estático void` | Cria as execuções do dia que ainda não existem (não duplica). |
| `execucoes(long eu, long pacienteId, LocalDate dia) → estático List<ExecucaoDto>` |  |
| `feita(long eu, long execucaoId) → estático ExecucaoDto` |  |
| `dto(ExecucaoTarefa e, Map<Long, TarefaCuidado> tarefas, Map<Long, String> nomes) → estático ExecucaoDto` |  |
| `tarefasPorId(long pacienteId) → estático Map<Long, TarefaCuidado>` |  |

## Usa
[[ApiException]], [[AuditoriaDao]], [[Autorizacao]], [[Dtos]], [[ExecucaoTarefa]], [[PessoaDao]], [[Sql]], [[TarefaCuidado]], [[TarefaDao]]

## É usada por
[[AlertaService]], [[ExecucaoResource]], [[HojeService]], [[PacienteResource]], [[TarefaResource]]

---
Ver também: [[Mapa do Código]] · [[Diagrama de Classes]] · [[Arquitetura]]
