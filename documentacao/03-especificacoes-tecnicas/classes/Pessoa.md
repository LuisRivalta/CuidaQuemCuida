---
tipo: classe abstrata
camada: model
arquivo: codigo/src/main/java/br/com/cuidaquemcuida/model/Pessoa.java
tags: [classe, model]
---

# Pessoa

**Classe abstrata** da camada **Modelo do domínio** · `codigo/src/main/java/br/com/cuidaquemcuida/model/Pessoa.java`

## Para que serve
Base de quem aparece no sistema: quem cuida (`Cuidador`) e quem é cuidado (`Paciente`). Classe abstrata: só existem pessoas concretas (herança, Fase 3).

Faz parte do [[Módulo Cadastros e Rede]].

## Campos principais
| Campo | Tipo |
|---|---|
| `id` | `Long` |
| `nome` | `String` |
| `dataNascimento` | `LocalDate` |

## Métodos
| Método | O que faz |
|---|---|
| `Pessoa(Long id, String nome, LocalDate dataNascimento)` |  |
| `idade(LocalDate hoje) → Integer` | Idade em anos completos na data informada, ou null se a data de nascimento não for conhecida. |
| `descricao() → String (abstrato)` | Como a pessoa aparece em textos do sistema (polimorfismo: cada tipo descreve a si mesmo). |

## É usada por
[[ContaService]], [[Cuidador]], [[Paciente]], [[RedeService]]

## Conceito do curso
Classe abstrata e herança (Fase 3: "Herança em classes? Polimorfismo em objetos?"); encapsulamento com validação no setter (Fase 3: "Escondendo com classe!")

---
Ver também: [[Mapa do Código]] · [[Diagrama de Classes]] · [[Arquitetura]]
