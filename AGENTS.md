# AGENTS.md — leia antes de mexer no projeto

> Arquivo de passagem para qualquer pessoa ou IA que continue o projeto. **Fica fora do .zip de entrega.**

## Contexto
- **Projeto:** CuidaQuemCuida, uma rede de apoio e revezamento para cuidadores familiares (escala de turnos, medicação, sinais vitais, tarefas de cuidado, sobrecarga do cuidador pela Escala Zarit e painel estatístico).
- **Para quê:** Global Solution 2º semestre/2026 da FIAP (tema CitizenTech), turma 2SIOA, Sistemas de Informação.
- **Prazo:** entrega na plataforma FIAP ON até **19/11/2026**. Não existe entrega atrasada.
- **Equipe:** Luis (Product Owner) e Gabriel Vilela (Scrum Master e validação).
- **Entregáveis do edital:** vídeo pitch (até 3 min), vídeo técnico (até 3 min, mostra o sistema Java, o banco, os conteúdos do curso e os desafios) e a documentação (diagramas, wireframes, especificações e outros materiais), num .zip com os links dos vídeos em .txt.

## Regras invioláveis
1. **Não citar IA, Claude, ChatGPT ou qualquer ferramenta de IA nos arquivos entregáveis** (`documentacao/`, `videos/`, `README.md`, `codigo/`, `banco/`). Commits sem linha de coautoria.
2. **Datas sempre reais** em sprints, Kanban, commits e diário.
3. **Desafios técnicos só os que aconteceram de verdade.** Anote cada um em `documentacao/04-outros-materiais/Diário de Desafios.md` (problema, o que tentou, decisão, data).
4. **A senha do banco nunca vai para arquivo versionado.** Só em `codigo/config.properties`, que está no `.gitignore`.
5. **Correções mínimas**, mantendo os nomes e as assinaturas do plano e do contrato da API. Se uma mudança for inevitável, registre em `documentacao/04-outros-materiais/Registro de Decisões.md`.
6. **Documentação em Markdown no Obsidian** (o vault é a pasta raiz), com `[[links]]` entre as notas. Uma nota por módulo, classe e função com regra de negócio.

## Onde está cada coisa
| O quê | Onde |
|---|---|
| Plano de construção (passo a passo, com checkboxes) | `docs/superpowers/plans/2026-11-13-cuidaquemcuida.md` |
| Especificação (design aprovado) | `documentacao/03-especificacoes-tecnicas/Design da Solução.md` |
| Contrato da API | `documentacao/03-especificacoes-tecnicas/API.md` |
| Edital | `documentacao/04-outros-materiais/Edital GS 2026.md` |
| Código Java (Maven) | `codigo/` |
| Telas (HTML, CSS, JS) | `codigo/src/main/resources/web/` |
| Scripts do banco | `banco/` |
| Índice da documentação | `documentacao/Mapa do Projeto.md` |
| Roteiros e links dos vídeos | `videos/` |

## Como continuar
1. Abra o plano e ache o primeiro passo não marcado (`- [ ]`).
2. Faça uma tarefa por vez, marque `- [x]` ao concluir e atualize a seção "Estado atual" abaixo.
3. Quando um passo depender de uma pessoa (instalar programa, clicar no Supabase, gravar vídeo), explique o que fazer e espere a confirmação.

### Prompt pronto para a Parte B (em casa)
```
Você vai continuar o projeto CuidaQuemCuida (trabalho da faculdade, entrega 19/11/2026).
Leia, nesta ordem: AGENTS.md (na raiz), docs/superpowers/plans/2026-11-13-cuidaquemcuida.md,
documentacao/03-especificacoes-tecnicas/Design da Solução.md e documentacao/03-especificacoes-tecnicas/API.md.
A Parte A já foi feita. Siga a Parte B a partir do primeiro passo não marcado ([ ]), uma tarefa
por vez, marcando [x] ao concluir e atualizando a seção "Estado atual" do AGENTS.md.
Regras: não citar IA nos arquivos entregáveis; datas sempre reais; desafios técnicos só os que
acontecerem de verdade (anote no Diário de Desafios); correções mínimas, mantendo as assinaturas
do plano; nunca colocar a senha do banco em arquivo versionado.
Quando um passo depender de mim (instalar, clicar no Supabase, gravar vídeo), explique o que
fazer e espere eu confirmar.
```

## Estado atual
- **13/11/2026:** design aprovado; plano aprovado; Parte A (PC sem Java) em andamento.
