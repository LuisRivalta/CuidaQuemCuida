---
tipo: classe
camada: dao
arquivo: codigo/src/main/java/br/com/cuidaquemcuida/dao/TurnoDao.java
tags: [classe, dao]
---

# TurnoDao

**Classe** da camada **Acesso a dados (JDBC)** · `codigo/src/main/java/br/com/cuidaquemcuida/dao/TurnoDao.java`

## Para que serve
Escala de revezamento (tabela `turno`).

Faz parte do [[Módulo Escala]].

## Métodos
| Método | O que faz |
|---|---|
| `queComecamEntre(long pacienteId, LocalDateTime de, LocalDateTime ate) → estático List<Turno>` | Turnos do paciente que começam entre [de, ate). |
| `doPaciente(long pacienteId, LocalDateTime de, LocalDateTime ate) → estático List<Turno>` | Turnos do paciente que encostam em [de, ate) (inclusive os que começaram antes). |
| `daPessoa(long pessoaId, LocalDateTime de, LocalDateTime ate) → estático List<Turno>` | Turnos da pessoa em todas as redes que encostam em [de, ate). É a carga dela. |
| `porId(long id) → estático Optional<Turno>` |  |
| `inserir(Turno t) → estático long` |  |
| `atualizar(Turno t) → estático void` |  |
| `assumir(long id, long pessoaId) → estático int` | Assume um turno vago. Devolve 0 se alguém assumiu antes (a condição "pessoa_id IS NULL" evita os dois ao mesmo tempo). |
| `apagar(long id) → estático void` |  |

## Usa
[[Sql]], [[StatusTurno]], [[Turno]]

## É usada por
[[AlertaService]], [[EscalaService]], [[EstatisticaService]], [[HojeService]]

---
Ver também: [[Mapa do Código]] · [[Diagrama de Classes]] · [[Arquitetura]]
