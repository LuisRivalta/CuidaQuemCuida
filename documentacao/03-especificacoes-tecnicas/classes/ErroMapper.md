---
tipo: classe
camada: infra
arquivo: codigo/src/main/java/br/com/cuidaquemcuida/infra/ErroMapper.java
tags: [classe, infra]
---

# ErroMapper

**Classe** da camada **Infraestrutura** · `codigo/src/main/java/br/com/cuidaquemcuida/infra/ErroMapper.java`

## Para que serve
Todo erro sai no formato do contrato: {"erro": "mensagem em português"} com o código HTTP certo.

Declaração: `class ErroMapper implements ExceptionMapper<Throwable>`

## Métodos
| Método | O que faz |
|---|---|
| `toResponse(Throwable erro) → Response` |  |

## Usa
[[ApiException]]

---
Ver também: [[Mapa do Código]] · [[Diagrama de Classes]] · [[Arquitetura]]
