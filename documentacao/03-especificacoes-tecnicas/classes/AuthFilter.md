---
tipo: classe
camada: infra
arquivo: codigo/src/main/java/br/com/cuidaquemcuida/infra/AuthFilter.java
tags: [classe, infra]
---

# AuthFilter

**Classe** da camada **Infraestrutura** · `codigo/src/main/java/br/com/cuidaquemcuida/infra/AuthFilter.java`

## Para que serve
Antes de cada rota da API, confere o token de login (cabeçalho Authorization: Bearer ...). Só saúde, login e cadastro são públicos. Guarda o id de quem está logado para os recursos.

Declaração: `class AuthFilter implements ContainerRequestFilter`

## Métodos
| Método | O que faz |
|---|---|
| `filter(ContainerRequestContext requisicao) → void` |  |
| `publica(String metodo, String caminho) → estático boolean` | Rotas que não exigem login. O caminho vem sem o prefixo /api. |

## Usa
[[ApiException]], [[SessaoDao]]

## É usada por
[[RecursoBase]]

## Conceito do curso
Segurança: autenticação por token antes de cada rota

---
Ver também: [[Mapa do Código]] · [[Diagrama de Classes]] · [[Arquitetura]]
