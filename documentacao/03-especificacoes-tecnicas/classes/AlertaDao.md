---
tipo: classe
camada: dao
arquivo: codigo/src/main/java/br/com/cuidaquemcuida/dao/AlertaDao.java
tags: [classe, dao]
---

# AlertaDao

**Classe** da camada **Acesso a dados (JDBC)** · `codigo/src/main/java/br/com/cuidaquemcuida/dao/AlertaDao.java`

## Para que serve
Alertas por destinatário (tabela `alerta`).

Faz parte do [[Módulo Hoje e Alertas]].

## Métodos
| Método | O que faz |
|---|---|
| `gravar(Alerta a) → estático int` | Grava o alerta; se o mesmo (tipo, referência, destinatário) já existe, não faz nada. Devolve 1 se gravou. |
| `naoLidos(long pessoaId, long pacienteId) → estático List<AlertaDto>` |  |
| `marcarResolvidos(long pessoaId, long pacienteId, List<String> chavesAtivas) → estático void` | Alertas calculados (dose, tarefa, turno vago, conflito, sobrecarga) que não valem mais (a dose foi dada, alguém cobriu o turno...) saem da lista: são marcados como lidos. Os gravados na hora do fato (sinal vital e pedido de ajuda) só saem quando a pessoa toca em "Ok". |
| `marcarLido(long id, long pessoaId) → estático int` |  |

## Usa
[[Alerta]], [[Dtos]], [[Sql]], [[TipoAlerta]]

## É usada por
[[AlertaService]], [[SinalVitalService]], [[ZaritService]]

---
Ver também: [[Mapa do Código]] · [[Diagrama de Classes]] · [[Arquitetura]]
