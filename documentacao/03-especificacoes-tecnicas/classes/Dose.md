---
tipo: classe
camada: model
arquivo: codigo/src/main/java/br/com/cuidaquemcuida/model/Dose.java
tags: [classe, model]
---

# Dose

**Classe** da camada **Modelo do domínio** · `codigo/src/main/java/br/com/cuidaquemcuida/model/Dose.java`

## Para que serve
Uma dose prevista de um remédio e o que aconteceu com ela. Tabela `dose`.

Faz parte do [[Módulo Medicação]].

## Campos principais
| Campo | Tipo |
|---|---|
| `id` | `Long` |
| `medicamentoId` | `long` |
| `previstoPara` | `LocalDateTime` |
| `dadaEm` | `LocalDateTime` |
| `dadaPor` | `Long` |
| `status` | `StatusDose` |
| `observacao` | `String` |

## Métodos
| Método | O que faz |
|---|---|
| `Dose(Long id, long medicamentoId, LocalDateTime previstoPara, StatusDose status)` |  |

## Usa
[[StatusDose]]

## É usada por
[[AlertaService]], [[DoseDao]], [[HojeService]], [[MedicacaoService]]

---
Ver também: [[Mapa do Código]] · [[Diagrama de Classes]] · [[Arquitetura]]
