---
tipo: classe
camada: resource
arquivo: codigo/src/main/java/br/com/cuidaquemcuida/resource/DemoResource.java
tags: [classe, resource]
---

# DemoResource

**Classe** da camada **API REST (JAX-RS)** · `codigo/src/main/java/br/com/cuidaquemcuida/resource/DemoResource.java`

## Para que serve
GET /api/demo/sql: os últimos comandos SQL, para a tela "Banco ao vivo" (exige login).

Declaração: `class DemoResource extends RecursoBase`

## Métodos
| Método | O que faz |
|---|---|
| `sql() → List<LogSql.EntradaSql>` |  |

## Usa
[[LogSql]], [[RecursoBase]]

---
Ver também: [[Mapa do Código]] · [[Diagrama de Classes]] · [[Arquitetura]]
