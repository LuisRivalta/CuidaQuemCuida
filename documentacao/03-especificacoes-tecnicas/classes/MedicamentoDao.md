---
tipo: classe
camada: dao
arquivo: codigo/src/main/java/br/com/cuidaquemcuida/dao/MedicamentoDao.java
tags: [classe, dao]
---

# MedicamentoDao

**Classe** da camada **Acesso a dados (JDBC)** · `codigo/src/main/java/br/com/cuidaquemcuida/dao/MedicamentoDao.java`

## Para que serve
Remédios e suas regras de horário (tabelas `medicamento` e `regra_horario`, 1:1).

Faz parte do [[Módulo Medicação]].

## Métodos
| Método | O que faz |
|---|---|
| `lerHorarios(String texto) → estático List<LocalTime>` | "08:00;20:00" -> [08:00, 20:00] |
| `gravarHorarios(List<LocalTime> horarios) → estático String` | [08:00, 20:00] -> "08:00;20:00" |
| `doPaciente(long pacienteId) → estático List<Medicamento>` |  |
| `porId(long id) → estático Optional<Medicamento>` |  |
| `inserir(Medicamento m) → estático long` | Grava o remédio e a regra juntos (chame dentro de Sql.transacao). |
| `atualizar(Medicamento m) → estático void` |  |
| `apagar(long id) → estático void` |  |

## Usa
[[Medicamento]], [[RegraHorario]], [[Sql]], [[TipoRegra]]

## É usada por
[[MedicacaoService]]

---
Ver também: [[Mapa do Código]] · [[Diagrama de Classes]] · [[Arquitetura]]
