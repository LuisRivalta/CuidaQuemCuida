---
tipo: classe
camada: dao
arquivo: codigo/src/main/java/br/com/cuidaquemcuida/dao/DoseDao.java
tags: [classe, dao]
---

# DoseDao

**Classe** da camada **Acesso a dados (JDBC)** · `codigo/src/main/java/br/com/cuidaquemcuida/dao/DoseDao.java`

## Para que serve
Doses previstas e registradas (tabela `dose`).

Faz parte do [[Módulo Medicação]].

## Métodos
| Método | O que faz |
|---|---|
| `garantir(long medicamentoId, List<LocalDateTime> horarios) → estático void` | Cria as doses previstas que ainda não existem. A UNIQUE (medicamento_id, previsto_para) impede duplicar. |
| `doPacienteNoDia(long pacienteId, LocalDate dia) → estático List<Dose>` |  |
| `porId(long id) → estático Optional<Dose>` |  |
| `registrar(long id, StatusDose status, LocalDateTime dadaEm, long pessoaId, String observacao) → estático int` → [[registrar dose]] | Registra a dose só se ainda estiver pendente. Devolve 0 se outra pessoa registrou antes: assim duas pessoas tocando "Dei o remédio" ao mesmo tempo não sobrescrevem uma à outra. |
| `marcarNaoDadaPorTempo(long id) → estático void` | Passaram 2 h sem registro: a dose vira não dada. |
| `apagarPendentesFuturas(long medicamentoId, LocalDateTime aPartirDe) → estático void` | Ao mudar a regra do remédio, as doses futuras ainda pendentes são refeitas pela regra nova. |

## Usa
[[Dose]], [[Sql]], [[StatusDose]]

## É usada por
[[MedicacaoService]]

---
Ver também: [[Mapa do Código]] · [[Diagrama de Classes]] · [[Arquitetura]]
