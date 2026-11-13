---
tipo: classe
camada: model
arquivo: codigo/src/main/java/br/com/cuidaquemcuida/model/AvaliacaoZarit.java
tags: [classe, model]
---

# AvaliacaoZarit

**Classe** da camada **Modelo do domínio** · `codigo/src/main/java/br/com/cuidaquemcuida/model/AvaliacaoZarit.java`

## Para que serve
Uma resposta à Escala Zarit (ZBI-12) de um cuidador. Dado de saúde privado. Tabelas `avaliacao_zarit` e `resposta_zarit`.

Faz parte do [[Módulo Bem-estar]].

## Campos principais
| Campo | Tipo |
|---|---|
| `id` | `Long` |
| `pessoaId` | `long` |
| `respondidaEm` | `LocalDateTime` |
| `respostas` | `int[]` |
| `pontuacao` | `int` |
| `faixa` | `FaixaZarit` |
| `horasSono` | `Double` |
| `qualidadeSono` | `Integer` |

## Métodos
| Método | O que faz |
|---|---|
| `AvaliacaoZarit(Long id, long pessoaId, LocalDateTime respondidaEm, int[] respostas, int pontuacao, FaixaZarit faixa, Double horasSono, Integer qualidadeSono)` |  |

## Usa
[[FaixaZarit]]

## É usada por
[[EstatisticaService]], [[ZaritDao]], [[ZaritService]]

---
Ver também: [[Mapa do Código]] · [[Diagrama de Classes]] · [[Arquitetura]]
