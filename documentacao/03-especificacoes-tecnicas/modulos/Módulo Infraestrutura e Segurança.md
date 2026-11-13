---
tipo: modulo
tags: [modulo, infraestrutura, seguranca]
---

# Módulo Infraestrutura e Segurança

**Para que serve:** a base técnica de todos os módulos: servidor, conexão com o banco, transações, log de SQL ("Banco ao vivo"), login, permissões, senhas, erros e JSON. Ver [[Arquitetura]] e [[LGPD, Segurança e Acessibilidade]].

| Peça | Classe | O que faz |
|---|---|---|
| Servidor | [[App]] | Sobe o Grizzly com Jersey em `/api` e as telas em `/`; testa a conexão com o banco ao iniciar |
| Configuração | [[Config]] | Lê `config.properties` (fora do Git) ou as variáveis de ambiente |
| Conexão | [[Conexao]] | Reaproveita conexões JDBC; explica o erro em português |
| SQL | [[Sql]] | `listar`, `um`, `executar`, `inserir`, `transacao`: sempre `PreparedStatement`; traduz erros do banco (23505 → 409, 23503/23514 → 400) |
| Banco ao vivo | [[LogSql]] | Guarda os últimos 50 comandos (com `?` no lugar dos valores) para a tela de demonstração; rota `/api/demo/sql` ([[DemoResource]]) |
| Login | [[AuthFilter]], [[SessaoDao]] | Confere o token `Bearer` antes de cada rota; só saúde, login e cadastro são públicos; sessão de 7 dias |
| Permissão | [[Autorizacao]] | `exigirMembro` (403 se não é da rede) e `exigirCoordenador` |
| Senhas | [[Senha]] | [[hash da senha]] PBKDF2 com salt; token aleatório de 32 bytes |
| Erros | [[ErroMapper]], [[ApiException]] | Todo erro sai como `{"erro": "..."}` com o código HTTP certo |
| JSON | [[JsonConfig]] | Datas no formato do contrato; campos desconhecidos ignorados |
| Base dos recursos | [[RecursoBase]] | `eu()` (quem está logado), `corpo()` (exige JSON), `data()` (lê datas com segurança) |
| Formatos | [[Dtos]] | Records de entrada e saída da API |

Testes: `SenhaTest` (6), `LogSqlTest` (3), `AutorizacaoTest` (3).
