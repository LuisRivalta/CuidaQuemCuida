---
tipo: classe
camada: dao
arquivo: codigo/src/main/java/br/com/cuidaquemcuida/dao/SessaoDao.java
tags: [classe, dao]
---

# SessaoDao

**Classe** da camada **Acesso a dados (JDBC)** · `codigo/src/main/java/br/com/cuidaquemcuida/dao/SessaoDao.java`

## Para que serve
Sessões de login (tabela `sessao`).

## Métodos
| Método | O que faz |
|---|---|
| `criar(String token, long pessoaId) → estático void` |  |
| `pessoaDoToken(String token) → estático Optional<Long>` | Dono do token, se a sessão existe, não expirou e a conta está ativa. |
| `apagar(String token) → estático void` |  |
| `apagarDaPessoa(long pessoaId) → estático void` |  |

## Usa
[[Limites]], [[Sql]]

## É usada por
[[AuthFilter]], [[ContaService]]

---
Ver também: [[Mapa do Código]] · [[Diagrama de Classes]] · [[Arquitetura]]
