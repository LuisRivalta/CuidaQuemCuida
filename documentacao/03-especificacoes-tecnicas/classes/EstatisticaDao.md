---
tipo: classe
camada: dao
arquivo: codigo/src/main/java/br/com/cuidaquemcuida/dao/EstatisticaDao.java
tags: [classe, dao]
---

# EstatisticaDao

**Classe** da camada **Acesso a dados (JDBC)** · `codigo/src/main/java/br/com/cuidaquemcuida/dao/EstatisticaDao.java`

## Para que serve
Consultas do painel estatístico feitas no próprio banco (Fase 5 e 6: junções, agrupamentos, totais, subconsultas). As medidas que precisam de lógica (média móvel, Pearson, z-score) ficam no Java.

Faz parte do [[Módulo Painel Estatístico]].

## Tipos internos
`record Contagem`, `record HorasPorPessoa`, `record DoseResolvida`

## Métodos
| Método | O que faz |
|---|---|
| `Contagem(String chave, long acertos, long total) → record` | Quantas doses foram dadas no horário (`acertos`) de um total, agrupadas por uma chave. |
| `HorasPorPessoa(long pessoaId, String nome, double horas) → record` |  |
| `DoseResolvida(LocalDateTime previstoPara, StatusDose status) → record` |  |
| `adesaoPorMedicamento(long pacienteId, LocalDateTime de, LocalDateTime ate) → estático List<Contagem>` | Adesão por remédio: GROUP BY com contagem condicional (Fase 6). |
| `adesaoPorPeriodo(long pacienteId, LocalDateTime de, LocalDateTime ate) → estático List<Contagem>` | Adesão por período do dia: agrupa por uma expressão CASE. |
| `cargaPorPessoa(long pacienteId, LocalDateTime de, LocalDateTime ate) → estático List<HorasPorPessoa>` | Horas de cuidado de cada pessoa no período: JOIN turno × pessoa e soma recortada nas bordas. |
| `acimaDaMedia(long pacienteId, LocalDateTime de, LocalDateTime ate) → estático List<String>` | Quem fez mais horas que a média da rede: HAVING com subconsulta (Fase 6). |
| `horaComMaisAtrasos(long pacienteId, LocalDateTime de, LocalDateTime ate) → estático Optional<Integer>` | Hora do dia com mais doses atrasadas (a moda, calculada no SQL). |
| `dosesResolvidas(long pacienteId, LocalDateTime de, LocalDateTime ate) → estático List<DoseResolvida>` | Doses já resolvidas (dadas, atrasadas ou não dadas), para calcular a chance de atraso no Java. |

## Usa
[[Sql]], [[StatusDose]]

## É usada por
[[EstatisticaService]]

## Conceito do curso
SQL com GROUP BY, JOIN e subconsulta no HAVING (Fases 5 e 6)

---
Ver também: [[Mapa do Código]] · [[Diagrama de Classes]] · [[Arquitetura]]
