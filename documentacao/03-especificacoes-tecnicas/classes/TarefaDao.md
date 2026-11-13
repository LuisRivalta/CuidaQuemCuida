---
tipo: classe
camada: dao
arquivo: codigo/src/main/java/br/com/cuidaquemcuida/dao/TarefaDao.java
tags: [classe, dao]
---

# TarefaDao

**Classe** da camada **Acesso a dados (JDBC)** · `codigo/src/main/java/br/com/cuidaquemcuida/dao/TarefaDao.java`

## Para que serve
Protocolo de cuidado (tabelas `tarefa_cuidado` e `execucao_tarefa`).

Faz parte do [[Módulo Protocolo de Cuidado]].

## Métodos
| Método | O que faz |
|---|---|
| `doPaciente(long pacienteId) → estático List<TarefaCuidado>` |  |
| `porId(long id) → estático Optional<TarefaCuidado>` |  |
| `inserir(TarefaCuidado t) → estático long` |  |
| `atualizar(TarefaCuidado t) → estático void` |  |
| `apagar(long id) → estático void` |  |
| `garantirExecucoes(long tarefaId, List<LocalDateTime> horarios) → estático void` | Cria as execuções previstas que ainda não existem (UNIQUE impede duplicar). |
| `execucoesNoDia(long pacienteId, LocalDate dia) → estático List<ExecucaoTarefa>` |  |
| `execucaoPorId(long id) → estático Optional<ExecucaoTarefa>` |  |
| `marcarFeita(long id, long pessoaId, LocalDateTime quando) → estático int` | Marca como feita só se ainda não foi. Devolve 0 se outra pessoa marcou antes. |
| `apagarFuturasNaoFeitas(long tarefaId, LocalDateTime aPartirDe) → estático void` | Ao mudar a tarefa, as execuções futuras ainda não feitas são refeitas pela regra nova. |

## Usa
[[ExecucaoTarefa]], [[Sql]], [[TarefaCuidado]], [[TipoSinal]]

## É usada por
[[AlertaService]], [[HojeService]], [[TarefaService]]

---
Ver também: [[Mapa do Código]] · [[Diagrama de Classes]] · [[Arquitetura]]
