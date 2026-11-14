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
| Plano do redesenho das telas (roda antes da Parte B) | `docs/superpowers/plans/2026-11-14-redesenho-telas.md` |
| **Passagem do redesenho (comece por aqui)** | `docs/redesenho/Redesenho - Passagem.md` (e as outras notas, fotos e critiques da pasta) |
| **Prompt para continuar** | `PROMPT-PARA-CONTINUAR.md` (raiz) |
| Contexto do produto (usado pela Impeccable) | `PRODUCT.md` (raiz) |
| Exceções aprovadas do detector da Impeccable | `.impeccable/config.json` |
| Scripts de fotos e de tela aberta para o detector | `ferramentas/` |
| Especificação (design aprovado) | `documentacao/03-especificacoes-tecnicas/Design da Solução.md` |
| Contrato da API | `documentacao/03-especificacoes-tecnicas/API.md` |
| Edital | `documentacao/04-outros-materiais/Edital GS 2026.md` |
| Código Java (Maven) | `codigo/` |
| Telas (HTML, CSS, JS) | `codigo/src/main/resources/web/` |
| Scripts do banco | `banco/` |
| Índice da documentação | `documentacao/Mapa do Projeto.md` |
| Roteiros e links dos vídeos | `videos/` |

## Como continuar
0. **Em andamento: o redesenho das telas.** Leia `docs/redesenho/Redesenho - Passagem.md` e cole o prompt de `PROMPT-PARA-CONTINUAR.md`. O redesenho vem antes da Parte B.
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
- **14/11/2026: Parte A concluída (A1 a A13).** Tudo commitado no Git (branch `main`) e enviado ao repositório **privado** `github.com/LuisRivalta/CuidaQuemCuida` (só para transporte e trabalho da dupla; **não compartilhar o link com a faculdade**: a entrega é o `.zip` limpo da B7). Em casa: `git clone https://github.com/LuisRivalta/CuidaQuemCuida.git C:\CuidaQuemCuida`. **Próximo passo: Tarefa B1** do plano.
  - **Telas:** completas e testadas no modo demonstração (16 telas, celular e computador, 0 erros).
  - **Java:** completo, com 64 testes JUnit **escritos, mas nunca compilados nem executados** (o PC da Parte A não tinha JDK). Uma revisão independente leu tudo e não achou erro de compilação; mesmo assim, espere ajustes na B2.
  - **Banco:** scripts prontos, **nunca executados** (o projeto Supabase ainda não existe; ver B3).
  - **Documentação:** 152 notas, 0 links quebrados, 11 diagramas Mermaid validados.
- **14/11/2026 (tarde): redesenho visual das telas em andamento**, pedido do Luis depois de ver o front. É feito antes da Parte B e tem plano próprio (`docs/superpowers/plans/2026-11-14-redesenho-telas.md`). **Leia `docs/redesenho/Redesenho - Passagem.md` e use o `PROMPT-PARA-CONTINUAR.md`.**
  - **Direção aprovada:** "acolhedor e calmo" (Headspace/Calm). HTML/CSS/JS + GSAP; céu que muda com a hora; tema noturno; fundo pêssego `#fff4ec`; fontes Young Serif e Lexend; ícones SVG.
  - **Concluído:** Fase 0 (fundo); Fase 1 (`PRODUCT.md`); **tela Hoje fechada** (4 rodadas de critique da Impeccable: 26 → 27 → 29 → 30/40).
  - **Parado em:** login redesenhado, com 1º critique de 26/40. **As correções esperam 3 decisões do Luis:** escopo, login lembrado e senha esquecida.
  - **Falta:** login; Fase 3 (`DESIGN.md`); Fase 4 (16 telas, uma por vez); Fases 5 e 6. Prazo do redesenho: **15/11**. A Parte B começa em **16/11**.
  - **Nada do contrato da API, do `demo.js` nem do Java mudou** no redesenho.

## Pendências conhecidas (para a Parte B)
Achadas na revisão de código e deixadas para depois por serem pequenas. Corrija se der tempo; nenhuma impede a demonstração.
1. **Texto da Zarit não conferido** (`web/dados/zarit-perguntas.json`, `"conferido": false`): conferir com a fonte antes de gravar (B4, passo 4). **Obrigatório.**
2. **Jackson:** se aparecer `NoSuchMethodError` vindo de `org.glassfish.jersey.jackson` ao subir, alinhar a versão do `jackson-bom` no `pom.xml` com a do Jersey (`mvn dependency:tree`) ou tirar o BOM.
3. **Rodar sempre com `mvn compile exec:java`** (o `exec:java` sozinho não recompila; no IntelliJ o botão ▶ já compila).
4. **Resetar o banco no dia da gravação** (`banco/00` a `03`): a escala de demonstração vai até 7 dias à frente; nos dias seguintes aparecem "turnos vagos" falsos no fim da semana.
5. Dados de demonstração: doses e tarefas de agora há pouco já entram como feitas; para mostrar uma dose atrasada no vídeo, basta não marcar a próxima dose prevista.
6. O modo API das telas só liga quando a página é servida pela porta 8080 (`js/api.js`). Mudou a porta? Abra com `?modo=api`.
7. Pequenas, se sobrar tempo: texto maior que a coluna (`SQLState 22001`) vira 500 em `infra/Sql.java`; o `SELECT` de sessão feito a cada 2 s pela tela Banco ao vivo enche a lista de 50 comandos (pode-se não registrar esse `SELECT` no `LogSql`); "Posso cobrir" tocado por duas pessoas ao mesmo tempo cria dois turnos.
8. **Depois de atualizar as telas, recarregar com Ctrl+F5.** O navegador guarda módulos JS antigos e a tela pode ficar em branco ([[Diário de Desafios]] nº 9). Antes de gravar o vídeo, abrir a página uma vez (as fontes trocam na primeira carga).
9. **As fontes (Google Fonts) e o GSAP (cdnjs) vêm da internet.** Sem internet, as telas funcionam com fontes de reserva e sem animação.
10. **Mensagem do pedido de ajuda com gênero neutro** (decisão D38): `AlertaPedidoAjuda.java` e `demo.js` ainda dizem "sobrecarregada(o)". Trocar por uma frase neutra na Parte B.
11. **Tema noturno:** liga de 18h às 6h ou com o sistema em modo escuro. Para gravar o visual de dia num Windows em modo escuro, ajuste o modo do sistema ou use as ferramentas do navegador ("prefers-color-scheme: light").
