---
titulo: Sprint 1 — Construção
data: 2026-11-13
tags: [agil, sprint]
---

# Sprint 1 — Construção (13/11/2026)

Ver [[Métodos Ágeis]] · [[Kanban]] · [[Backlog]] · [[Sprint 0 - Planejamento]].

## Objetivo
Ter **tudo que não depende de Java rodando e testado** (telas, banco e documentação) e **todo o Java escrito com testes**, pronto para compilar na Sprint 2.

## Planejamento
Escolhidas do backlog as histórias de prioridade 1 e 2 (H01 a H21), quebradas nas tarefas A1 a A13 do [[Kanban]].

## O que foi entregue
| Tarefa | Entrega |
|---|---|
| A1 | Estrutura do projeto, README, mapa da documentação, Kanban |
| A2 | Contrato da API: todas as rotas, com exemplos de JSON ([[API]]) |
| A3 | Banco: 17 tabelas, RLS, dados de demonstração da família Souza ([[Diagrama do Banco]]) |
| A4–A6 | **Telas completas** em modo demonstração: login, cadastro, Hoje, Escala, Bem-estar, Mais, painel, dados coletados, banco ao vivo |
| A7 | Java: modelo do domínio e regras de negócio, **testes escritos antes** |
| A8 | Java: servidor, conexão, transações, log de SQL, senhas, login e permissões |
| A9 | Java: DAOs, serviços e todas as rotas da API |
| A10 | Diagramas v1 (arquitetura, classes, casos de uso, fluxos) e wireframes |
| A11 | Notas técnicas: 89 classes, 18 funções, 9 módulos |
| A12 | Materiais de produto, ágil, validação e roteiros dos vídeos |

## Verificação
- Telas: sintaxe, roteiro automático do contrato e fotos das 16 telas no celular e no computador → **0 erros**.
- Java: 64 testes escritos; conferência estática dos imports e das chamadas → 0 problemas. A **execução dos testes fica para a Sprint 2** (o computador desta sprint não tem Java).
- **Revisão de código independente** (14/11): nenhum erro de compilação encontrado; os valores esperados dos testes conferem com a implementação. Dois problemas importantes foram corrigidos na hora: (1) alertas já resolvidos continuavam aparecendo, e agora saem da lista sozinhos; (2) cada tela fazia idas demais ao banco, e agora as doses e tarefas do dia só são inseridas quando faltam, a conexão só é conferida se ficou parada, e a tela Hoje reaproveita os alertas que já recebeu.

## Daily (resumo)
- **13/11:** construção das telas e do banco; o computador não tem Java, então as telas ganharam um modo demonstração; Java escrito com testes primeiro; documentação gerada junto.

## Revisão
O PO testou as telas no modo demonstração (fotos em [[Wireframes]]). Pendências levadas para a Sprint 2: compilar e rodar os testes, criar o banco no Supabase, conferir o texto da Zarit, validação com pessoas.

## Retrospectiva
- **Bom:** o contrato da API escrito antes deixou telas e Java independentes; fotografar as telas automaticamente achou defeitos que passariam despercebidos ([[Diário de Desafios]] nº 5).
- **A melhorar:** escrever Java sem compilar é arriscado; a primeira coisa da Sprint 2 é compilar.
- **Ação:** na Sprint 2, registrar no [[Diário de Desafios]] cada erro de compilação ou teste que aparecer.
