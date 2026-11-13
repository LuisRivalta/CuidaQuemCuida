---
tipo: classe
camada: resource
arquivo: codigo/src/main/java/br/com/cuidaquemcuida/resource/PessoaResource.java
tags: [classe, resource]
---

# PessoaResource

**Classe** da camada **API REST (JAX-RS)** · `codigo/src/main/java/br/com/cuidaquemcuida/resource/PessoaResource.java`

## Para que serve
Cadastro, meus dados e exclusão de conta.

Faz parte do [[Módulo Cadastros e Rede]].

Declaração: `class PessoaResource extends RecursoBase`

## Métodos
| Método | O que faz |
|---|---|
| `cadastrar(CadastroEntrada dados) → Response` | POST /api/pessoas (público) |
| `meusDados() → PessoaDto` | GET /api/pessoas/eu |
| `excluir() → void` | DELETE /api/pessoas/eu |

## Usa
[[ContaService]], [[Dtos]], [[RecursoBase]]

---
Ver também: [[Mapa do Código]] · [[Diagrama de Classes]] · [[Arquitetura]]
