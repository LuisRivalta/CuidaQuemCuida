# Redesenho das telas com a Impeccable — plano de execução

> **Atualização de 14/11/2026, à noite:** login revisado (34/40), sistema visual documentado, 18 rotas abertas em celular e computador no modo demonstração e detector de arquivos limpo. A equipe autorizou avançar com a implementação. A aprovação visual no navegador e a confirmação do sistema visual seguem pendentes.

> **Passagem (14/11/2026):** a sessão foi encerrada no meio da Fase 2 (login). Antes de continuar, leia [[Redesenho - Passagem]], que tem o estado exato, as decisões pendentes e os próximos passos. O prompt para retomar está em [[PROMPT-PARA-CONTINUAR]].
>
> **Para quem executa:** siga as fases em ordem e marque `- [x]` ao concluir cada passo. Cada tela só é dada como pronta depois que o Luis aprova no navegador. Este plano complementa o plano principal ([[2026-11-13-cuidaquemcuida]]) e roda **antes** da Parte B.

**Objetivo:** deixar as 18 telas do CuidaQuemCuida com a direção visual aprovada ("acolhedor e calmo"), com nota alta no critique da Impeccable e coerentes entre si, sem mexer na lógica, no contrato da API nem no modo demonstração.

**Como:** o fluxo da Impeccable, nesta ordem: `init` (produto) → `critique` das 2 telas já redesenhadas → `document` (sistema visual) → redesenho tela por tela (sorteio de estruturas, construção, revisão, critique, aprovação) → passada final (`audit`, `harden`, `adapt`, `polish`) → documentação.

**Tecnologia:** HTML/CSS/JS puro (ES modules, sem build), GSAP 3.12.5 (cdnjs), Chart.js 4.4.1, fontes Young Serif + Lexend (Google Fonts). Motor da Impeccable 0.1.24 instalado em `C:\Users\luisgfr\.impeccable\bin\0.1.24\`.

**Base:** `documentacao/03-especificacoes-tecnicas/Design da Solução.md`, `documentacao/04-outros-materiais/Personas.md`; depois da Fase 1, `PRODUCT.md`; depois da Fase 3, `DESIGN.md`.

## Restrições globais
- Não mudar `js/api.js`, `js/demo.js`, o contrato da API (`API.md`) nem os nomes das rotas. Cada tela continua fazendo as mesmas chamadas.
- Celular primeiro (conferir em 390 px) e computador (1280 px). Texto base 18 px, alvos de toque de 44 px ou mais, contraste AA, foco visível, `prefers-reduced-motion` respeitado.
- Ícones só desenhados (`js/icones.js`), nunca emoji.
- **Tratamento de gênero** (decisão do Luis, 14/11): ao falar com a pessoa, usar o `genero` do cadastro (`GET /api/pessoas/eu`); sem informação, texto neutro. Aplicar nas telas com texto marcado ("sozinha(o)", "cuidador(a)"...) conforme forem redesenhadas. O texto das perguntas da Zarit não muda. A mensagem do pedido de ajuda (`AlertaPedidoAjuda.java` e `demo.js`) passa a ser neutra; a parte Java fica para a Parte B, com registro no Registro de Decisões.
- Direção aprovada pelo Luis: acolhedor e calmo (referência Headspace/Calm); céu que muda com a hora (`js/ceu.js`), morros, azul-noite, pêssego, verde-sálvia.
- **Uma tela por vez:** mostrar no navegador e esperar o ok do Luis antes da próxima.
- Entregáveis sem menção a IA; datas reais; desafios técnicos só os que acontecerem de verdade.
- Scripts auxiliares de verificação ficam na pasta temporária do Claude e passam pela auditoria; os arquivos entregáveis não recebem registro manual.
- **Prazo do redesenho: fim do dia 15/11/2026.** De 16/11 a 19/11 é a Parte B (Java, Supabase, vídeos, entrega). Se em 15/11 à tarde ainda faltar tela, as restantes vão pelo **caminho rápido** (Fase 4).

## Inventário das telas (estado em 14/11/2026)
"Redesenhada" = já tem o visual novo, mas ainda espera o critique e o ok do Luis. "Antiga" = funciona, mas só herdou as cores e as letras novas; o layout é o da Parte A.

| # | Rota | Arquivo | Estado | Fase |
|---|---|---|---|---|
| 1 | `/hoje` | `telas/hoje.js` | Redesenhada | 2 |
| 2 | `/login` | `telas/login.js` | Redesenhada | 2 |
| 3 | `/escala` | `telas/escala.js` | Antiga | 4.1 |
| 4 | `/bem-estar` | `telas/bem-estar.js` | Antiga | 4.2 |
| 5 | `/bem-estar/responder` (Zarit) | `telas/bem-estar.js` | Antiga | 4.2 |
| 6 | `/mais/painel` | `telas/painel.js` | Antiga | 4.3 |
| 7 | `/mais` (menu) | `telas/mais.js` | Antiga | 4.4 |
| 8 | `/mais/paciente` | `telas/mais.js` | Antiga | 4.5 |
| 9 | `/mais/pessoas` | `telas/mais.js` | Antiga | 4.6 |
| 10 | `/mais/sinais` | `telas/mais.js` | Antiga | 4.7 |
| 11 | `/mais/tarefas` | `telas/mais.js` | Antiga | 4.8 |
| 12 | `/mais/dados` | `telas/mais.js` | Antiga | 4.9 |
| 13 | `/mais/banco` | `telas/mais.js` | Antiga | 4.9 |
| 14 | `/mais/conta` | `telas/mais.js` | Antiga | 4.9 |
| 15 | `/cadastro` | `telas/cadastros.js` | Antiga | 4.10 |
| 16 | `/inicio-rede` | `telas/cadastros.js` | Antiga | 4.10 |
| 17 | `/novo-paciente` | `telas/cadastros.js` | Antiga | 4.10 |
| 18 | `/entrar-rede` | `telas/cadastros.js` | Antiga | 4.10 |

---

## Fase 0 — Fechar o que está aberto
- [x] **0.1 (Luis)** Decidir o fundo: manter o creme `#fbf6ef` ou trocar por um tom puxado do céu (pêssego ou sálvia bem claros). O detector da Impeccable marca o creme como padrão de tela gerada. **Decidido em 14/11: pêssego bem claro.**
- [x] **0.2 (Claude)** `--fundo: #fff4ec` em `css/estilo.css` e `theme-color` no `index.html`; o detector parou de acusar. Junto, os alvos de toque menores (botão pequeno, motivos, "Mostrar" senha, seletor de paciente, menu) subiram de 40–44 px para 48 px, a regra do projeto.

## Fase 1 — Contexto do produto (`init`)
**Comando (Luis):** `/impeccable:impeccable init`
- [x] **1.1 (Claude)** Ler o Design da Solução, as Personas, o Problema e Evidências, os Concorrentes e a nota de LGPD, e montar o rascunho.
- [x] **1.2 (Luis)** Responder a até 3 perguntas, só sobre o que os documentos não respondem. **Respondido em 14/11:** marca fixa (os dois corações, o nome e a frase "Quem cuida também precisa de cuidado"); tratamento de gênero pelo cadastro (neutro quando não informado).
- [x] **1.3 (Claude)** Gravar `PRODUCT.md` na raiz: plataforma web; usuários (Marta, Paulo, João, Ana); propósito; diferencial ("cuida também de quem cuida"); restrições (18 px, 48 px, "orienta, não diagnostica", LGPD); evidências reais e o que não pode ser inventado; princípios; acessibilidade.
- **Pronto quando:** `PRODUCT.md` existe e a Impeccable para de avisar `NO_PRODUCT_MD`.

## Fase 2 — Critique das telas redesenhadas
**Comandos (Luis), um de cada vez:**
```
/impeccable:impeccable critique codigo/src/main/resources/web/js/telas/hoje.js
/impeccable:impeccable critique codigo/src/main/resources/web/js/telas/login.js
```
Para cada tela:
- [x] **2.1 (Claude)** Rodar as duas avaliações separadas (A: revisão de design com as 10 heurísticas e as personas; B: detector e navegador), juntar no relatório e fazer as perguntas de prioridade. *(Hoje: 4 rodadas. Login: 1 rodada.)*
- [x] **2.2** Com a autorização para avançar, aplicar os cinco pontos, oferecer sessão lembrada opcional e deixar a recuperação de senha para evolução futura.
- [x] **2.3** Corrigir, fotografar e revisar. Ver [[Critique Login - rodada 2 (34 de 40)]].
- [ ] **2.4 (Luis)** Aprovar a tela no navegador (Ctrl+F5 antes). *(Hoje: fechada por decisão do Luis. Login: pendente.)*
- **Pronto quando:** cada tela tem nota de 28/40 ou mais ("Boa"), nenhum problema P0 ou P1 e o ok do Luis.

**Andamento:**
- **Hoje, 14/11:** 1º critique **26/40** (1 P0, 3 P1, 1 P2; relatório em `.impeccable/critique/`). Luis escolheu: começar por destaque e registro seguro, mexer nos 5, modo noturno pelo período e pelo modo escuro, "quem deu" buscando `GET /doses` à parte.
  - Correções feitas:
    - destaque por prioridade e o grupo "Ficou para trás";
    - "Desfazer" por 5 s;
    - atualização a cada minuto e ao voltar, no lugar;
    - "Por Marta às 08:05" e "Remédios já registrados hoje";
    - tema noturno em todo o app;
    - sobrecarga de quem vê no topo, falando com a pessoa;
    - "Entendi" no lugar de "Ok";
    - céu compacto e "Faltam 3 h 31 min";
    - medição com unidade, vírgula e erro junto do campo;
    - aviso de valor fora da faixa com SAMU 192;
    - aviso médico;
    - alvos de 48 px;
    - fonte em %.
  - **2º critique: 27/40** (0 P0, 3 P1 novos, 2 P2). Luis escolheu mexer nos 5, buscar a escala à parte e "Fui eu que dei" fora do turno.
  - Correções da 2ª rodada:
    - fora do turno, o cartão diz quem está com a pessoa e "ninguém registrou ainda", com ação secundária;
    - "Sem registro" separado de "Não dado", com orientação para não dar de novo;
    - aviso fora da faixa honesto e botão para ligar para o SAMU;
    - conferência de valores fora do possível;
    - fila de registros no navegador, com nova tentativa sem internet;
    - "Desfazer" no cartão, por 8 s, com o foco nele;
    - itens feitos recolhidos;
    - vermelho só para remédio no prazo;
    - medição esquecida vai para "Ficou para trás";
    - "Posso cobrir" com confirmação;
    - texto do arco sai de dentro dele quando a letra é grande;
    - menu cresce com a letra.
  - **3º critique: 29/40 ("Bom")**, 0 P0, 1 P1, 4 P2. Luis escolheu mexer nos 5 e nos consertos.
  - Correções da 3ª rodada:
    - fora do turno, remédio atrasado traz "antes de dar, confirme com <quem está no turno>";
    - "Não foi dado" com desfazer de 8 s e aviso no "Estava dormindo";
    - lista fora do turno agrupada (agora · seu turno · outros horários, recolhido);
    - "Último remédio dado: ..., por ... às ..." sempre à vista;
    - fila por pessoa;
    - erro fica até fechar;
    - fechamento "Remédio salvo" / "Tarefa salva";
    - "Atrasado" com uma cor só;
    - hora lida pelo leitor de tela;
    - sobrecarga no passado quando a pessoa está de folga;
    - céu compacto em tela baixa (botão visível em 360×640);
    - arco vira uma linha com letra grande;
    - espaço para o menu ao rolar até um campo;
    - link do céu com 48 px.
  - **4º critique: 30/40 ("Bom")**, 0 P0, 1 P1 novo (atualização em segundo plano atropelando o toque), 4 P2. Luis escolheu "os 5 e fecha" (sem 5º critique).
  - Correções da 4ª rodada:
    - tela travada (`inert`) até chegar a atualização ao voltar ao app;
    - não redesenha com "Desfazer" ou formulário aberto durante a espera;
    - botões do cartão seguram 700 ms quando o destaque muda;
    - "Como fazer" e foco preservados;
    - "Estava dormindo" com "Vou dar quando acordar" como botão principal;
    - "Desfazer (15 s)" para remédio e (8 s) para o resto, com contagem;
    - "Registrou errado? Avise quem coordena";
    - fora do turno, destaque só para remédio atrasado ("Nada para você agora" no resto), "Seu turno" primeiro e o resto recolhido, inclusive os remédios do dia;
    - erros dizem o item;
    - falha da medição avisada;
    - aviso não apaga erro;
    - fila da demonstração limpa a cada carga;
    - "Últimos remédios dados" junta os do mesmo minuto;
    - vocabulário "registrado".
  - **Hoje fechada em 14/11** (decisão do Luis). Achados menores restantes vão para o polish da Fase 5.
  - Fotos finais em `docs/redesenho/imagens/`; detalhes em [[Redesenho - Tela Hoje]]; relatórios copiados para `docs/redesenho/critiques/` (a pasta `.impeccable/critique/` não vai para o Git).
- **Login, 14/11:** 1º critique **26/40** (0 P0, 2 P1, 3 P2), em [[Critique Login - rodada 1 (26 de 40)]].
  - P1: nome cortado com letra grande ou zoom; login esquecido a cada aba fechada (`sessionStorage`).
  - P2: erro sem caminho nem recuperação de senha; convite sem caminho; família de exemplo sem história.
  - **Parado aqui:** as 3 perguntas ao Luis ficaram sem resposta (sessão encerrada):
    1. escopo (os 5, só os P1, ou os P1 + família);
    2. login lembrado ("Continuar conectado", sempre, ou como está);
    3. senha esquecida (texto honesto, nada, ou rota nova na Parte B).
  - **Próximo:**
    1. refazer as 3 perguntas;
    2. corrigir;
    3. fotografar com `ferramentas/fotografa-telas__Claude_Code_MS125_luisgfr.mjs ... login`;
    4. rodar o detector;
    5. mostrar ao Luis.
  - Detalhes em [[Redesenho - Tela Login]].
- **Extra corrigido no fim de 14/11:** o bloco `@media (max-height: 760px)` do CSS estava antes das regras de `.morros` e `.agora` e não valia; foi movido para depois delas.

## Fase 3 — Sistema visual (`document`)
**Comando (Luis):** `/impeccable:impeccable document`
- [x] **3.1** Gravar `DESIGN.md` e `.impeccable/design.json` com as decisões de cor, tipografia, medidas e componentes.
- [ ] **3.2 (Luis)** Ler e confirmar.
- **Pronto quando:** `DESIGN.md` existe com os tokens e a Impeccable o carrega no contexto.

## Fase 4 — Redesenho tela por tela

**Implementação de 14/11:** as dez etapas abaixo foram aplicadas ao sistema visual já usado em Hoje e no login. As capturas da demonstração cobrem as 18 rotas. Os itens assinalados registram a implementação. A conferência da dupla segue na etapa 5.6.
**Como pedir (Luis):** "redesenha a <tela>". Cada tela segue o **ciclo completo**:
1. **Sorteio:** a Impeccable sorteia 3 estruturas diferentes para a tela (`concept-seed --scope surface --mode operate`) e abre a página de decisão no navegador. O Luis escolhe uma.
2. **Contrato:** grava o resumo da tela (direção escolhida) em `.impeccable/surfaces/`.
3. **Construção:** no sistema do `DESIGN.md`, com GSAP só onde o movimento tem função.
4. **Fotos:** 390 px e 1280 px, mais os estados (vazio, erro, formulário aberto, noite), com o script de fotos.
5. **Detector:** `impeccable detect` nos arquivos mudados; corrigir o que for mecânico.
6. **Revisão final:** revisor separado (`impeccable-finish-reviewer`); aplicar as correções dele.
7. **Mostrar ao Luis** e esperar o ok.

**Caminho rápido** (só se o prazo de 15/11 apertar, e só nas telas 4.5 a 4.10): pula os passos 1, 2 e 6; aplica o `DESIGN.md` direto; mantém as fotos, o detector e o ok do Luis.

- [x] **4.1 Escala:** navegação semanal, turnos agrupados por dia e indicação de vaga e noite.
- [x] **4.2 Bem-estar e Zarit:** pausa opcional, perguntas, sono, resultado, histórico e privacidade.
- [x] **4.3 Painel:** hierarquia de carga, indicadores e gráficos com legenda, traços e valores em texto. O z-score permanece no módulo de sinais.
- [x] **4.4 Mais:** dois grupos de navegação e ícones SVG.
- [x] **4.5 Paciente e remédios:** dados e três regras de horário.
- [x] **4.6 Pessoas da rede:** membros, papéis e código de convite.
- [x] **4.7 Sinais vitais:** faixas, registro e avisos.
- [x] **4.8 Tarefas de cuidado:** lista, estado vazio e instruções.
- [x] **4.9 Dados coletados, Banco ao vivo e Minha conta:** organização das telas de leitura.
- [x] **4.10 Cadastros:** criar conta, início sem rede, cadastrar paciente e entrar com código.
- **Pronto quando:** as 18 telas têm o visual novo e o ok do Luis.

## Fase 5 — Passada final no app inteiro
- [ ] **5.1** Auditoria: axe sem violações automatizadas nas 18 rotas em 390 px (WCAG 2.0 A/AA e 2.1 AA). Conferências manuais adicionais de acessibilidade e desempenho seguem no checklist final.
- [ ] **5.2** `/impeccable:impeccable harden`: mensagens de erro, telas vazias, textos longos, sem internet (fontes e GSAP vêm de CDN).
- [ ] **5.3** `/impeccable:impeccable adapt`: versão de computador boa para gravar o vídeo técnico.
- [ ] **5.4** `/impeccable:impeccable polish`: o último acabamento.
- [x] **5.5** Detector limpo nos arquivos de interface e no login renderizado. As 18 rotas foram fotografadas em 390 e 1280 px com zero erro de console.
- [ ] **5.6 (Luis)** Ok final do visual.

## Fase 6 — Documentação e registro
- [x] **6.1** Atualizar wireframes, nota e capturas da implementação.
- [ ] **6.2** Atualizar `Mapa do Código.md`, `Arquitetura.md` e as notas de módulo que citam o front (Hoje e Alertas, Escala, Medicação, Sinais Vitais, Protocolo de Cuidado, Cadastros e Rede), incluindo os arquivos novos `js/icones.js` e `js/ceu.js`.
- [x] **6.3** Atualizar o Registro de Decisões (D34 a D53).
- [x] **6.4** Registrar os desafios confirmados no diário.
- [ ] **6.5** Conferir se os roteiros dos vídeos, o README e o `Conteúdos do Curso.md` ainda batem com as telas novas (por exemplo, o login agora tem botões da família em vez da lista de e-mails).
- [x] **6.6** Atualizar o estado do `AGENTS.md`.
- [x] **6.7** Atualizar o cartão do redesenho no Kanban.
- [x] **6.8** Commits locais por assunto. Push só com o ok do Luis.
- [x] **6.9** Conferir os links do Obsidian: 169 notas, zero links quebrados.

## Comandos de apoio (entram quando o critique ou a fase pedir)
Não são fases próprias: o critique indica qual usar em cada problema (Fases 2 e 4), e alguns têm lugar fixo.

| Comando | O que faz | Onde entra |
|---|---|---|
| `layout` | Espaçamento, ritmo e hierarquia | Fases 2 e 4, quando o critique apontar hierarquia ou espaço ruins |
| `typeset` | Letras: tamanhos, pesos, escala | Fases 2 e 4, quando o critique apontar tipografia fraca |
| `colorize` | Cor com papel definido | Fases 2 e 4, quando a tela ficar apagada ou a cor não ajudar a ler. Também na Fase 0, se o fundo creme for trocado |
| `clarify` | Textos, rótulos e mensagens de erro | Fases 2 e 4, sempre que o critique apontar texto confuso. Fixo na 4.2 (Zarit) e na 4.10 (cadastros e termo), que têm muito texto |
| `animate` | Movimento com função | Fixo na 4.2 (tela de respiração antes da Zarit). Nas outras telas, só se o critique apontar falta de retorno visual |
| `delight` | Toques de personalidade | Opcional, no fim da Fase 4, nos momentos que aparecem no vídeo pitch (login, check do "Dei o remédio", respiração) |
| `overdrive` | Passa dos limites do convencional | Opcional, só se sobrar tempo e só em 1 momento de impacto no pitch. Fica fora das telas de uso diário |
| `adapt` | Ajusta para cada tamanho de tela | Fixo na Fase 5 (5.3), com a versão de computador pronta para gravar o vídeo técnico |
| `optimize` | Desempenho (carregamento, animação, peso) | Fase 5, depois do `audit`, se ele apontar lentidão. Candidatos: fontes e GSAP vindos de CDN, Chart.js |
| `quieter`, `bolder`, `distill` | Mais calmo, mais ousado, mais enxuto | Fases 2 e 4, se o critique disser que a tela está agitada, sem graça ou cheia demais |

## Ponto de controle
- **15/11, à tarde:** quantas telas faltam? Se faltar alguma da 4.5 à 4.10, mudar para o caminho rápido. Se ainda faltar a 4.1, 4.2 ou 4.3, conversar com o Luis antes de continuar.
- **16/11:** começar a Parte B do plano principal (Tarefa B1), com o redesenho fechado ou no estado em que estiver, documentado.
