---
tipo: classe
camada: model
arquivo: codigo/src/main/java/br/com/cuidaquemcuida/model/Medicamento.java
tags: [classe, model]
---

# Medicamento

**Classe** da camada **Modelo do domínio** · `codigo/src/main/java/br/com/cuidaquemcuida/model/Medicamento.java`

## Para que serve
Remédio do paciente, com a sua regra de horário. Tabelas `medicamento` e `regra_horario`.

Faz parte do [[Módulo Medicação]].

## Campos principais
| Campo | Tipo |
|---|---|
| `id` | `Long` |
| `pacienteId` | `long` |
| `nome` | `String` |
| `dosagem` | `String` |
| `via` | `String` |
| `instrucoes` | `String` |
| `ativo` | `boolean` |
| `regra` | `RegraHorario` |

## Métodos
| Método | O que faz |
|---|---|
| `Medicamento(Long id, long pacienteId, String nome, RegraHorario regra)` |  |
| `horariosEntre(LocalDateTime de, LocalDateTime ate) → List<LocalDateTime>` | Horários previstos das doses no período (delegado à regra: polimorfismo). Remédio suspenso não tem doses. |

## Usa
[[RegraHorario]]

## É usada por
[[AlertaService]], [[HojeService]], [[MedicacaoService]], [[MedicamentoDao]]

---
Ver também: [[Mapa do Código]] · [[Diagrama de Classes]] · [[Arquitetura]]
