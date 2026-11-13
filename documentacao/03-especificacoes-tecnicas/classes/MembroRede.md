---
tipo: record
camada: model
arquivo: codigo/src/main/java/br/com/cuidaquemcuida/model/MembroRede.java
tags: [classe, model]
---

# MembroRede

**Record** da camada **Modelo do domínio** · `codigo/src/main/java/br/com/cuidaquemcuida/model/MembroRede.java`

## Para que serve
Participação de uma pessoa na rede de cuidado de um paciente (associativa N:N, tabela `membro_rede`). `compartilhaZarit`: consentimento para a pontuação Zarit entrar no painel do coordenador.

Faz parte do [[Módulo Cadastros e Rede]].

Declaração: `record MembroRede (long pessoaId, long pacienteId, Papel papel, Vinculo vinculo, boolean ativo, boolean compartilhaZarit)`

## Métodos
| Método | O que faz |
|---|---|
| `coordenador() → boolean` |  |

## Usa
[[Papel]], [[Vinculo]]

## É usada por
[[AlertaService]], [[Autorizacao]], [[ContaService]], [[EscalaService]], [[EstatisticaService]], [[MembroRedeDao]], [[RedeService]], [[ZaritService]]

## Conceito do curso
Record (dados imutáveis) da tabela associativa N:N (Fase 3: modelagem avançada)

---
Ver também: [[Mapa do Código]] · [[Diagrama de Classes]] · [[Arquitetura]]
