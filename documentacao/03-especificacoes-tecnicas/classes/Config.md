---
tipo: classe
camada: infra
arquivo: codigo/src/main/java/br/com/cuidaquemcuida/infra/Config.java
tags: [classe, infra]
---

# Config

**Classe** da camada **Infraestrutura** · `codigo/src/main/java/br/com/cuidaquemcuida/infra/Config.java`

## Para que serve
Configuração do sistema. Lê o arquivo `config.properties` da pasta onde o sistema roda (fora do Git, porque tem a senha do banco). Se uma chave faltar, usa a variável de ambiente equivalente: db.url -> DB_URL, db.usuario -> DB_USUARIO, db.senha -> DB_SENHA, porta -> PORTA.

## Métodos
| Método | O que faz |
|---|---|
| `obrigatorio(String chave) → estático String` |  |

## É usada por
[[App]], [[Conexao]]

---
Ver também: [[Mapa do Código]] · [[Diagrama de Classes]] · [[Arquitetura]]
