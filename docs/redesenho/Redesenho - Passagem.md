---
titulo: Redesenho das telas — passagem
data: 2026-11-14
tags: [redesenho, passagem, estado]
---

# Redesenho das telas — passagem (comece por aqui)

> **Navegação em 14/11/2026:** o cadastro e a entrada com código estão em Mais → Pacientes, também para quem já tem rede. A ficha do paciente oferece os links para a escala, as pessoas da rede e outro cadastro. Escala permite filtrar os turnos da própria pessoa no paciente selecionado e mantém o filtro entre as semanas. O retorno do formulário segue a tela de origem.

> **Revisão de UX em 14/11/2026:** a Escala abre com os dias que têm turnos ou vagas. Dias vazios ficam agrupados; uma semana vazia tem uma mensagem única. O resumo de sobrecarga permanece visível e abre os detalhes. Ações de gestão ficam em “Opções”, e “Posso cobrir” continua na linha da vaga. O fim de um turno em outro dia mostra a data. Bem-estar, Painel, Mais e cadastros usam cabeçalhos simples e cartões com bordas discretas. Os avisos do topo fora da tela Hoje ficam em um painel com prévia do primeiro aviso. A Escala foi conferida em celular e computador com dados fictícios.

![[escala-revisao-noite.png]]

![[escala-revisao-celular.png|390]]

![[bem-estar-revisao-celular.png|390]]

> **Estado atualizado em 14/11/2026, à noite:** login corrigido e revisado (34/40), sistema visual formalizado, telas internas redesenhadas e 18 rotas verificadas em celular e computador no modo demonstração. Os 64 testes Java passaram e a API foi verificada com PostgreSQL local. A aprovação visual final da dupla, a instância do Supabase, o teste em celular físico, a validação com cuidadores, os vídeos e a submissão estão pendentes. A seção abaixo guarda o histórico da sessão anterior.

> Nota de passagem para quem continuar o redesenho do front do CuidaQuemCuida, seja o Luis em outra máquina ou outra pessoa. Fica em `docs/`, **fora do .zip de entrega**. O prompt pronto para retomar está em [[PROMPT-PARA-CONTINUAR]].

## Resumo em 10 linhas
1. Em 14/11/2026 o Luis achou o front da Parte A "péssimo, feio demais" e pediu um redesenho completo, mantendo as funções.
2. **Direção aprovada:** "acolhedor e calmo", com referência Headspace/Calm. Céu que muda com a hora, morros, azul-noite, pêssego e verde-sálvia. Stack: HTML/CSS/JS puros + GSAP por CDN.
3. As ferramentas de design usadas foram o plugin **Impeccable** (com motor instalado) e o **UI/UX Pro Max**. Ver [[Redesenho - Ferramentas e Verificação]].
4. **Plano do redesenho**, com fases e checkboxes: [[2026-11-14-redesenho-telas]]. Segue o fluxo da Impeccable: init → critique → document → tela por tela → passada final → documentação.
5. **Fase 0 (fundo) e Fase 1 (`PRODUCT.md`) concluídas.** A Fase 2 tem a **tela Hoje fechada**, com 4 rodadas de critique (26 → 27 → 29 → 30/40). Ver [[Redesenho - Tela Hoje]].
6. A **tela de login** foi redesenhada e teve 1 critique (26/40). **As correções estão paradas esperando 3 decisões do Luis.** Ver [[Redesenho - Tela Login]].
7. As outras **16 telas funcionam**, mas ainda têm o layout da Parte A. Só herdaram as cores, as letras e o tema noturno novos.
8. O **sistema visual** (cores, letras, componentes, movimento) está descrito em [[Redesenho - Sistema Visual]]. O `DESIGN.md` formal é a Fase 3.
9. **Prazo do redesenho: 15/11/2026.** De 16 a 19/11 é a Parte B: Java, Supabase, vídeos e entrega até **19/11/2026** ([[2026-11-13-cuidaquemcuida]]).
10. O registro de cada passo e decisão do dia está em [[Redesenho - Diário da Sessão 14-11]].

## Onde exatamente parou
- **Última ação:** o critique da tela de login terminou (26/40, 2 P1 e 3 P2; relatório em [[Critique Login - rodada 1 (26 de 40)]]). As 3 perguntas abaixo foram feitas ao Luis, e ele encerrou a sessão antes de responder.
- **Perguntas em aberto (fazer de novo antes de mexer no login):**
  1. **Escopo das correções do login:**
     - os 5 problemas;
     - só os 2 P1;
     - os 2 P1 + a família de exemplo contando a história no pitch.
  2. **Login lembrado** (hoje fechar a aba pede login de novo, embora a sessão do servidor dure 7 dias):
     - caixa "Continuar conectado", marcada por padrão;
     - sempre lembrar;
     - deixar como está.
  3. **Senha esquecida** (a API não tem recuperação):
     - texto honesto, sem rota;
     - não mostrar nada;
     - criar a rota na Parte B, mudando o contrato.
- **Todo o código está commitado e enviado** ao repositório privado (ver [[#Estado do Git]]).

## Próximos passos, em ordem
1. **Login (Fase 2):**
   1. refazer as 3 perguntas acima;
   2. aplicar as correções escolhidas;
   3. fotografar;
   4. rodar o detector;
   5. mostrar ao Luis.
   Meta: nota ≥ 28/40, sem P1 e com o ok do Luis.
2. **Fase 3:** `/impeccable:impeccable document`, que grava o `DESIGN.md` e o `.impeccable/design.json` a partir das telas Hoje e login. Use [[Redesenho - Sistema Visual]] como base.
3. **Fase 4:** redesenhar uma tela por vez, na ordem:
   1. Escala
   2. Bem-estar e Zarit (com a tela de respiração)
   3. Painel
   4. Mais
   5. Paciente
   6. Pessoas
   7. Sinais
   8. Tarefas
   9. Dados, Banco e Conta
   10. Cadastros

   Cada tela segue o ciclo do plano: sorteio de estruturas na página de decisão da Impeccable → construção → fotos → detector → revisor final → ok do Luis.
4. **Fase 5:** `audit`, `harden`, `adapt`, `polish` e o detector no app inteiro.
5. **Fase 6:** documentação. É preciso:
   - refazer os wireframes e as fotos;
   - atualizar as notas de módulo e o `Mapa do Código` (arquivos novos `js/icones.js` e `js/ceu.js`);
   - conferir os roteiros dos vídeos e o README;
   - atualizar Kanban e `AGENTS.md`;
   - fazer o commit.
6. **Ponto de controle de 15/11 à tarde:** se ainda faltarem telas pequenas (4.5 a 4.10), elas vão pelo "caminho rápido" do plano: aplicar o sistema visual direto, sem sorteio.

## Como ver as telas
1. Na raiz do projeto, suba um servidor estático da pasta das telas, por exemplo:
   `python -m http.server 8000 --bind 127.0.0.1 --directory codigo/src/main/resources/web`
2. Abra `http://127.0.0.1:8000`. Fora da porta 8080 as telas rodam no **modo demonstração**, com dados em memória (`js/demo.js`). Na porta 8080, com o Java rodando, elas usam a API real.
3. Para entrar, toque em "Entrar como Marta" (ou Paulo, Ana, João). A senha de todos é `demo1234`.
4. **Sempre aperte Ctrl+F5 depois de atualizar o código.** O navegador guarda os módulos JS antigos, e uma mistura de arquivos novos e velhos deixa a tela em branco ([[Diário de Desafios]] nº 9).
5. **Tema noturno:** liga de 18h às 6h ou quando o sistema está em modo escuro. Para ver o modo claro de dia num Windows em modo escuro, use as ferramentas do navegador: "Rendering → prefers-color-scheme: light".
6. **Internet:** as fontes (Google Fonts) e o GSAP (cdnjs) vêm de CDN. Sem internet, a tela funciona com as fontes de reserva e sem animação.

## Arquivos do redesenho
| Arquivo | O que é |
|---|---|
| `codigo/src/main/resources/web/index.html` | Fontes Young Serif e Lexend, GSAP 3.12.5, favicon e marca em SVG (os dois corações), menu com ícones SVG |
| `.../css/estilo.css` | Tudo do visual: tokens claro e noturno, céu, Hoje, login, menu, avisos. Ver [[Redesenho - Sistema Visual]] |
| `.../js/icones.js` (novo) | `icone(nome, classe)`: sol, calendario, folha, mais, sino, check, pilula, pulso, coracao, menos, seta |
| `.../js/ceu.js` (novo) | `periodoDoDia`, `ehNoite`, `semMovimento`, `estrelas()`, `morros()` |
| `.../js/ui.js` | + `deHtml`; `mostrarAviso(texto, acao)` com botão; `mostrarErro` fica até "Fechar"; um aviso não apaga um erro aberto |
| `.../js/rotas.js` | `cartoesAlerta(alertas, aoLer, { anunciar })` com "Entendi" e nome acessível com a mensagem |
| `.../js/app.js` | `aplicarTema()` (`data-periodo`, `data-tema`, `theme-color`); `body.sem-menu`; topo escondido no login; limpa a fila de registros no modo demonstração |
| `.../js/telas/hoje.js` | Tela Hoje reescrita. Ver [[Redesenho - Tela Hoje]] |
| `.../js/telas/login.js` | Login reescrito. Ver [[Redesenho - Tela Login]] |
| `PRODUCT.md` (raiz) | Contexto do produto para a Impeccable: usuários, propósito, marca, acessibilidade. Ver [[PRODUCT]] |
| `.impeccable/config.json` | Exceções aprovadas do detector (fundo pêssego; folha de wireframes) |
| `docs/superpowers/plans/2026-11-14-redesenho-telas.md` | O plano com o andamento detalhado |
| `docs/redesenho/` | Estas notas, as fotos (`imagens/`) e os relatórios de critique (`critiques/`) |
| `ferramentas/*.mjs` | Scripts de fotos e de tela aberta para o detector. Ver [[Redesenho - Ferramentas e Verificação]] |

**Nada do contrato da API, do `demo.js` nem do Java mudou** no redesenho. As telas só fazem chamadas que já existiam.

## Fotos do estado atual (14/11/2026)
- **Hoje, celular, de dia, Marta no turno:**
  ![[hoje-celular-dia-no-turno.png|300]]
- **Hoje, noite, Marta fora do turno:**
  ![[hoje-celular-noite-fora-do-turno.png|300]]
- **Hoje, Paulo fora do turno:**
  ![[hoje-celular-paulo-fora-do-turno.png|300]]
- **Login, celular:**
  ![[login-celular.png|300]]
- **Login, noite:**
  ![[login-celular-noite.png|300]]
- **Login, computador:**
  ![[login-computador.png|600]]

Mais fotos em `docs/redesenho/imagens/`: modo escuro de dia, desfazer, letra a 150%, 360×640, computador e o turno da noite do Paulo.

## Regras que continuam valendo
Resumo; a versão completa está em [[AGENTS]].
- **Nada de mencionar IA nos entregáveis** (`documentacao/`, `videos/`, `README.md`, `codigo/`, `banco/`). Commits sem linha de coautoria.
- **Datas reais e desafios reais** ([[Diário de Desafios]]).
- **Correções mínimas:** manter o contrato da API; mudança inevitável vai para o [[Registro de Decisões]].
- **Uma tela por vez:** mostrar ao Luis e esperar o ok antes da próxima. Ele quer ver e decidir; não construir sem mostrar.
- **Marca fixa:** os dois corações (coral `#ef8a62` e sálvia `#7aa98a`), o nome e a frase "Quem cuida também precisa de cuidado.".
- **Tratamento de gênero:** pelo `genero` do cadastro (`GET /api/pessoas/eu`); neutro quando não houver.
- **O texto das perguntas da Zarit não muda** (validado; conferência pendente na Parte B).
- **Senha do banco nunca em arquivo versionado.**

## Estado do Git
- O repositório privado `github.com/LuisRivalta/CuidaQuemCuida`, branch `main`, recebeu os commits do redesenho em 14/11 (ver `git log`).
- O filtro local `semcarimbo` (`.git/config` + `.git/info/attributes`) tira dos commits o bloco de comentário `[CLAUDE-CODE-AUDIT]` dos `.js`, `.mjs`, `.py` e `.ps1`. **Ele só existe na máquina do Luis.** Numa máquina nova o clone já vem limpo, e não é preciso configurar nada.
- **Não entram no .zip de entrega:** `docs/`, `AGENTS.md`, `PRODUCT.md`, `PROMPT-PARA-CONTINUAR.md`, `ferramentas/` e `.impeccable/` (passo 4 da Tarefa B7).

## Notas desta pasta
- [[Redesenho - Sistema Visual]]: cores, letras, componentes, movimento e tema noturno.
- [[Redesenho - Tela Hoje]]: comportamento completo, mapa do código e histórico dos critiques.
- [[Redesenho - Tela Login]]: o que foi feito, o critique e as decisões pendentes.
- [[Redesenho - Ferramentas e Verificação]]: Impeccable, motor, detector, critique, scripts de fotos.
- [[Redesenho - Diário da Sessão 14-11]]: tudo o que aconteceu em 14/11, na ordem, com as decisões do Luis.
- Relatórios completos dos critiques:
  - [[Critique Hoje - rodada 1 (26 de 40)]]
  - [[Critique Hoje - rodada 2 (27 de 40)]]
  - [[Critique Hoje - rodada 3 (29 de 40)]]
  - [[Critique Hoje - rodada 4 (30 de 40)]]
  - [[Critique Login - rodada 1 (26 de 40)]]
