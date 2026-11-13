---
tipo: classe
camada: infra
arquivo: codigo/src/main/java/br/com/cuidaquemcuida/infra/LogSql.java
tags: [classe, infra]
---

# LogSql

**Classe** da camada **Infraestrutura** · `codigo/src/main/java/br/com/cuidaquemcuida/infra/LogSql.java`

## Para que serve
Guarda na memória os últimos 50 comandos SQL executados, para a tela "Banco ao vivo". Os valores não aparecem (ficam como "?"), porque vão separados do comando no PreparedStatement.

## Tipos internos
`record EntradaSql`

## Métodos
| Método | O que faz |
|---|---|
| `EntradaSql(LocalDateTime quando, String tipo, String sql, long ms) → record` |  |
| `registrar(String sql, long ms) → estático void` |  |
| `ultimos() → estático List<EntradaSql>` | Do mais novo para o mais antigo. |

## É usada por
[[DemoResource]], [[Sql]]

## Testes
`LogSqlTest` (JUnit 5) em `codigo/src/test/java/`. Ver [[Testes e Validação]].

## Conceito do curso
Demonstração das requisições ao banco (vídeo técnico)

---
Ver também: [[Mapa do Código]] · [[Diagrama de Classes]] · [[Arquitetura]]
