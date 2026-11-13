---
tipo: classe
camada: model
arquivo: codigo/src/main/java/br/com/cuidaquemcuida/model/Cuidador.java
tags: [classe, model]
---

# Cuidador

**Classe** da camada **Modelo do domínio** · `codigo/src/main/java/br/com/cuidaquemcuida/model/Cuidador.java`

## Para que serve
Pessoa com login: o cuidador principal, um familiar ou um vizinho voluntário. Tabela `pessoa`.

Faz parte do [[Módulo Cadastros e Rede]].

Declaração: `class Cuidador extends Pessoa`

## Campos principais
| Campo | Tipo |
|---|---|
| `email` | `String` |
| `telefone` | `String` |
| `senhaHash` | `String` |
| `senhaSalt` | `String` |
| `genero` | `String` |
| `ativo` | `boolean` |

## Métodos
| Método | O que faz |
|---|---|
| `Cuidador(Long id, String nome, String email, LocalDate dataNascimento)` |  |
| `descricao() → String` |  |
| `anonimizar() → void` | Exclusão de conta pela LGPD: apaga os dados pessoais e desativa o login, mas mantém o registro para os históricos de cuidado (dose "dada por", turnos) continuarem íntegros. |

## Usa
[[Pessoa]]

## É usada por
[[ContaService]], [[EscalaService]], [[PessoaDao]], [[ZaritService]]

## Conceito do curso
Herança de Pessoa; método anonimizar() aplica a LGPD (Fase 5)

---
Ver também: [[Mapa do Código]] · [[Diagrama de Classes]] · [[Arquitetura]]
