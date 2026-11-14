---
tipo: classe
camada: infra
arquivo: codigo/src/main/java/br/com/cuidaquemcuida/infra/Conexao.java
tags: [classe, infra]
---

# Conexao

**Classe** da camada **Infraestrutura** · `codigo/src/main/java/br/com/cuidaquemcuida/infra/Conexao.java`

## Para que serve
Conexões JDBC com o PostgreSQL (Supabase). Abrir uma conexão nova a cada comando custaria centenas de milissegundos (TLS até o servidor), então as conexões livres são reaproveitadas. Só se confere se a conexão ainda está viva quando ela ficou parada por mais de 30 s (conferir sempre seria uma ida extra ao banco por comando). ponytail: pool mínimo sem limite de espera; trocar por HikariCP se houver muitos acessos simultâneos.

## Métodos
| Método | O que faz |
|---|---|
| `pegar() → estático Connection` | Pega uma conexão (reaproveitada se ainda estiver boa). Devolva com `#devolver`. |
| `devolver(Connection conexao) → estático void` |  |
| `testar() → estático void` | Testa a conexão ao iniciar o sistema e explica o problema em português, se houver. |

## Usa
[[Config]]

## É usada por
[[App]], [[Sql]]

## Conceito do curso
JDBC (Fase 4); reaproveitamento de conexões

---
Ver também: [[Mapa do Código]] · [[Diagrama de Classes]] · [[Arquitetura]]
