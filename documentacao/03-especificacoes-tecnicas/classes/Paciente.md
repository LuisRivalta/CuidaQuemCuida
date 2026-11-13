---
tipo: classe
camada: model
arquivo: codigo/src/main/java/br/com/cuidaquemcuida/model/Paciente.java
tags: [classe, model]
---

# Paciente

**Classe** da camada **Modelo do domínio** · `codigo/src/main/java/br/com/cuidaquemcuida/model/Paciente.java`

## Para que serve
Pessoa cuidada. Não tem login: os dados de saúde são autorizados pelo responsável legal. Tabela `paciente`.

Faz parte do [[Módulo Cadastros e Rede]].

Declaração: `class Paciente extends Pessoa`

## Campos principais
| Campo | Tipo |
|---|---|
| `condicao` | `String` |
| `precisa24h` | `boolean` |
| `observacoes` | `String` |
| `responsavelNome` | `String` |
| `responsavelParentesco` | `String` |
| `codigoConvite` | `String` |

## Métodos
| Método | O que faz |
|---|---|
| `Paciente(Long id, String nome, LocalDate dataNascimento, String responsavelNome, String responsavelParentesco)` |  |
| `descricao() → String` |  |

## Usa
[[Pessoa]]

## É usada por
[[AlertaService]], [[EscalaService]], [[HojeService]], [[PacienteDao]], [[RedeService]], [[SinalVitalService]]

## Conceito do curso
Herança de Pessoa (Fase 3)

---
Ver também: [[Mapa do Código]] · [[Diagrama de Classes]] · [[Arquitetura]]
