---
tipo: classe
camada: dao
arquivo: codigo/src/main/java/br/com/cuidaquemcuida/dao/SinalVitalDao.java
tags: [classe, dao]
---

# SinalVitalDao

**Classe** da camada **Acesso a dados (JDBC)** · `codigo/src/main/java/br/com/cuidaquemcuida/dao/SinalVitalDao.java`

## Para que serve
Sinais vitais e faixas de alerta (tabelas `sinal_vital` e `faixa_sinal`).

Faz parte do [[Módulo Sinais Vitais]].

## Métodos
| Método | O que faz |
|---|---|
| `doPaciente(long pacienteId, TipoSinal tipo, LocalDateTime de, LocalDateTime ate) → estático List<SinalVital>` | Medições do período, de um tipo ou de todos (tipo nulo). |
| `valoresAnteriores(long pacienteId, TipoSinal tipo) → estático List<Double>` | Valores anteriores do mesmo tipo (para saber se o novo está "fora da curva"). |
| `inserir(SinalVital s) → estático long` |  |
| `faixas(long pacienteId) → estático List<FaixaSinal>` |  |
| `substituirFaixas(long pacienteId, List<FaixaSinal> faixas) → estático void` | Troca todas as faixas do paciente (chame dentro de Sql.transacao). |

## Usa
[[FaixaSinal]], [[SinalVital]], [[Sql]], [[TipoSinal]]

## É usada por
[[SinalVitalService]]

---
Ver também: [[Mapa do Código]] · [[Diagrama de Classes]] · [[Arquitetura]]
