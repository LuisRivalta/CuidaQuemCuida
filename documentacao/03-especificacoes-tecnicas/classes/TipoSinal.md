---
tipo: enum
camada: model
arquivo: codigo/src/main/java/br/com/cuidaquemcuida/model/TipoSinal.java
tags: [classe, model]
---

# TipoSinal

**Enum** da camada **Modelo do domínio** · `codigo/src/main/java/br/com/cuidaquemcuida/model/TipoSinal.java`

## Para que serve
Sinais vitais acompanhados. Na pressão, o valor principal é a máxima (sistólica) e o segundo, a mínima.

Faz parte do [[Módulo Sinais Vitais]].

## Campos principais
| Campo | Tipo |
|---|---|
| `nome` | `String` |
| `unidade` | `String` |

## Métodos
| Método | O que faz |
|---|---|
| `nome() → String` |  |
| `unidade() → String` |  |

## É usada por
[[AlertaSinalVital]], [[Dtos]], [[FaixaSinal]], [[PacienteResource]], [[SinalVital]], [[SinalVitalDao]], [[SinalVitalService]], [[TarefaCuidado]], [[TarefaDao]]

## Conceito do curso
Enum com dados (nome e unidade)

---
Ver também: [[Mapa do Código]] · [[Diagrama de Classes]] · [[Arquitetura]]
