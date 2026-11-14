---
titulo: Redesenho — sistema visual
data: 2026-11-14
tags: [redesenho, design, tokens]
---

# Sistema visual do redesenho

Base para o `DESIGN.md` da Fase 3 ([[2026-11-14-redesenho-telas]]). Tudo vem do código em `codigo/src/main/resources/web/css/estilo.css`. Se o CSS mudar, esta nota precisa mudar junto. Voltar para [[Redesenho - Passagem]].

## Direção
- **"Acolhedor e calmo"**, com referência Headspace/Calm. Escolha do Luis em 14/11/2026.
- **Ideia central:** um **céu que muda com a hora do dia**, com morros embaixo e um **arco do turno**. O arco vai do início ao fim do turno, e um sol (ou uma lua crescente) marca a hora de agora. O chão da página continua a cor do céu.
- **Quem usa:** cuidadores cansados, muitas vezes de madrugada. Por isso existem o tema noturno automático, a letra grande, os alvos de 48 px e a ideia de "uma coisa por vez" ([[PRODUCT]]).

## Marca (fixa, decisão do Luis)
- **Símbolo:** dois corações sobrepostos, um grande coral (`#ef8a62`) e um pequeno verde-sálvia (`#7aa98a`). Representam quem cuida e quem é cuidado. O SVG está no `index.html` (favicon e topo) e em `telas/login.js` (constante `MARCA`).
- **Nome:** CuidaQuemCuida, numa palavra, com C, Q e C maiúsculos.
- **Frase de abertura:** "Quem cuida também precisa de cuidado."

## Letras
| Uso | Fonte | Onde |
|---|---|---|
| Títulos (`h1`, `h2`), números do arco, avatar | **Young Serif** (400) | `--fonte-titulo` |
| Texto, botões, rótulos | **Lexend** (300 a 700), criada para facilitar a leitura | `--fonte` |
- As duas vêm do Google Fonts (`index.html`). As fontes de reserva são Georgia e system-ui.
- `html { font-size: 112.5% }`, ou seja 18 px por padrão, **respeitando a letra escolhida no navegador**.
- Tamanhos principais:
  - `h1` 2rem (no céu: `clamp(1.8rem, 7.5vw, 2.4rem)`);
  - `h2` 1.4rem;
  - título do cartão "Agora": 1.65rem;
  - número do arco: 1.6rem;
  - etiquetas: 0.85rem.
- `text-wrap: balance` nos títulos e `pretty` nos parágrafos.
- A UI/UX Pro Max sugeriu Lora + Raleway. A Impeccable aponta a Lora como fonte "padrão de IA", e por isso a escolha final foi Young Serif + Lexend.

## Cores — tema claro (`:root`)
| Token | Valor | Uso |
|---|---|---|
| `--fundo` | `#fff4ec` | chão da página (pêssego bem claro; decisão do Luis no lugar do creme) |
| `--superficie` | `#ffffff` | cartões |
| `--superficie-2` | `#f4ece1` | grupos recolhidos, etiqueta neutra |
| `--borda` | `#e8dfd2` | divisórias |
| `--borda-forte` | `#8f8474` | borda de campo (3,6:1) |
| `--texto` | `#1e2a47` | azul-noite |
| `--texto-suave` | `#586179` | texto de apoio (5,7:1) |
| `--creme` | `#fbf4ea` | texto sobre o céu escuro |
| `--principal` / `--principal-hover` | `#1e2a47` / `#2d3c63` | botão principal |
| `--principal-claro` | `#e8eaf1` | hover do secundário, halo de foco |
| `--sobre-principal` | `#fbf4ea` | texto do botão principal |
| `--pessego` / `--pessego-claro` | `#ffc4a3` / `#ffe9dc` | aba ativa do menu, ícone do cartão, etiqueta "foco" |
| `--coral` | `#ef8a62` | detalhes (marcador do `summary`, aro do item em foco) |
| `--salvia` / `--salvia-clara` / `--salvia-escura` | `#7aa98a` / `#e3efe5` / `#2f6b4f` | feito, confirmação, "último remédio" |
| `--perigo` / `--perigo-fundo` | `#a8321e` / `#fde6df` | remédio atrasado no prazo, erro, "não dado" |
| `--atencao` / `--atencao-fundo` | `#8a4b00` / `#ffecd2` | tarefa atrasada, sem registro, turno vago, orientação |
| `--foco` | `#1e2a47` | contorno de foco (3 px, afastado 3 px) |
| `--linha` | `#cfc3b2` | traço do caminho do dia |
| `--vidro` | `rgba(255,255,255,.88)` | menu flutuante (com `backdrop-filter`) |
| `--aviso-fundo` / `--aviso-texto` | `#1e2a47` / `#fbf4ea` | aviso do rodapé (toast) |

## Cores — tema noturno (`body[data-tema="noite"]`)
- **Quando liga:** de 18h às 6h, ou quando o celular está em modo escuro. Quem decide é `aplicarTema()` em `js/app.js`, que também troca o `theme-color`.
- **Valores:**
  - `--fundo` `#121830`, `--superficie` `#1c2340`, `--superficie-2` `#252d4d`;
  - `--borda` `#313a5e`, `--borda-forte` `#7c85a6`;
  - `--texto` `#f3ecdf`, `--texto-suave` `#b8bed3`;
  - `--principal` `#ffd2b8` (o botão vira pêssego com texto azul-noite), `--principal-hover` `#ffe2d1`;
  - `--pessego` `#ffb48c`, `--pessego-claro` `#3a2f4d`;
  - `--salvia-clara` `#1f3a33`, `--salvia-escura` `#9fd3b2`;
  - `--perigo` `#ff9c86` sobre `#3d2026`, `--atencao` `#ffc976` sobre `#3a2e18`;
  - `--linha` `#4a5378`, `--vidro` `rgba(28,35,64,.9)`;
  - aviso do rodapé creme com texto azul-noite;
  - sombras mais escuras;
  - `color-scheme: dark`.

## Céu por período (`.ceu[data-periodo]`)
| Período | Céu (topo → base) | Morro de trás / da frente | Astro | Texto |
|---|---|---|---|---|
| manhã (6h–11h59) | `#ffd9bd` → `#fff0e4` | `#f7bc98` / `#a9cbb0` | sol `#ffd36b` | azul-noite |
| tarde (12h–17h59) | `#ffc9a6` → `#ffe9da` | `#f3ac86` / `#a3c4a6` | sol | azul-noite |
| noite (18h–23h59) | `#29295a` → `#514a87` | `#34306a` / `#23474a` | lua `#f6ead2` + estrelas | creme |
| madrugada (0h–5h59) | `#121a35` → `#2b3766` | `#1b2348` / `#17363b` | lua + estrelas | creme |
| dia com o celular em modo escuro | `#2f2a52` → `#6b4f78` (entardecer) | `#4a3b66` / `#2c4a4a` | sol `#ffc78a` | creme |
- O terceiro morro (`.m3`) usa `--fundo`, para o céu "encostar" no chão.
- A lua é um círculo com máscara SVG (crescente). As estrelas são 10 círculos que piscam 4 vezes.

## Medidas
- `--raio` 20px, `--raio-grande` 28px, `--espaco` 20px (margem lateral), `--toque` 52px (botões e campos), `--largura-max` 720px, `--altura-topo` 64px, `--altura-menu` 68px.
- **Alvos de toque de 48 px ou mais em tudo:** botão `.pequeno`, motivos, "Mostrar", seletor de paciente, menu, `summary` dos itens e o link "Ver onde dá para ajudar".
- **Sombras:** `--sombra` (suave, 8 px) e `--sombra-alta` (cartão "Agora", menu, toast).
- **Curva de movimento:** `--curva: cubic-bezier(0.16, 1, 0.3, 1)`.
- **Tela baixa** (`@media (max-height: 760px)`): céu, arco, morros e cartão encolhem para o botão principal aparecer sem rolar num 360×640. O bloco tem de ficar **depois** das regras-base de `.morros` e `.agora`; foi corrigido em 14/11.

## Componentes (classes do CSS)
- **Estrutura:**
  - `.topo`: transparente; `.marca` com o SVG dos corações; seletor de paciente em pílula.
  - `.menu`: barra flutuante de vidro embaixo, com ícone SVG em pílula pêssego na aba ativa. A partir de 900 px vira barra lateral.
  - `.mensagem`: aviso do rodapé (toast). Pode ter botão (ex.: "Fechar"); o erro fica até fechar.
- **Céu e arco:**
  - `.ceu`, `.ceu-texto`, `.ceu-proximo`, `.estrelas`, `.morros`;
  - `.arco`, `.arco-trilha`, `.arco-feito`, `.astro`, `.arco-centro`, `.arco-hora`;
  - `.arco.apertado`: com letra grande, o arco vira uma linha só (`.arco-ate`).
- **Cartão "Agora":**
  - `.agora`, com as variações `.calmo`, `.fora` e `.confirmado`;
  - `.agora-topo`, `.agora-icone`, `.agora-rotulo`, `.agora-quando` (`.ruim` ou `.meio`), `.agora-nota`, `.agora-quem`;
  - `.desfazer`, `button.confirmado` e `.traco-check` (o check desenhado).
- **Formulários:** `.form-inline`, `.opcoes-motivo` (chips de rádio), `.erro-campo`, `[aria-invalid]`, `.aviso-sinal` (fora da faixa, com o botão `tel:192`).
- **Avisos:**
  - `.aviso-voce`: sobrecarga de quem está vendo;
  - `.avisos` + `.alerta`: um painel único com uma linha por aviso; `.alerta.atencao`;
  - `.aviso-fila`: registros sem internet;
  - `.confirmar-cobrir`, `.orientacao`, `.aviso-medico`.
- **Caminho do dia:**
  - `.caminho`; `li` com as classes `.feito`, `.pulado`, `.sem-registro`, `.atrasado`, `.atencao`, `.em-foco`; `.caminho-hora`, `.caminho-marco`, `.marco`;
  - `details.caminho-corpo`: o item pendente abre com um toque;
  - `.grupo-caminho`: recolhidos, como "Já registrados", "Ficou para trás", "Agora, com…", "Outros horários" e "Remédios já registrados hoje";
  - `.grupo-titulo`, `.ultimo-remedio`.
- **Etiquetas:** `.etiqueta` com as variações `.ok`, `.ruim`, `.meio` e `.foco`.
- **Login:**
  - `.entrada`, `.entrada-ceu`, `.entrada-icone`, `.entrada-marca` (com `.coracao-grande` e `.coracao-pequeno`), `.entrada-lema`, `.entrada-sobre`;
  - `.entrada-form`, `.campo-senha`, `.mostrar-senha`, `.entrada-criar`;
  - `.entrada-demo`, `.pessoas-demo`, `.pessoa-demo`, `.avatar` (`.pessego`, `.salvia`, `.lilas`, `.azul`).

## Ícones
- Desenhados em SVG, com traço 2 e cantos redondos (`js/icones.js`). **Nunca emoji.**
- **Disponíveis:** sol, calendario, folha, mais, sino, check, pilula, pulso, coracao, menos, seta. Os ícones do menu estão escritos direto no `index.html`.
- **Emojis que ainda existem nas telas antigas** e saem no redesenho de cada uma:
  - Mais: 📊 💊 👥 ❤️ 📋 🔒 🗄️ 👤;
  - Escala: 🌙;
  - Bem-estar: 🔒;
  - Sinais: ⚠.

## Movimento
- **GSAP 3.12.5** vem por CDN (cdnjs). Tudo checa `semMovimento()` (`js/ceu.js`): com "reduzir movimento" ligado ou sem o GSAP, nada anima e o conteúdo aparece direto.
- **Tela Hoje:**
  - o texto do céu sobe, os morros sobem, o arco se desenha e o astro caminha até a hora atual em 2 s;
  - o cartão e a lista entram em cascata;
  - ao registrar, o check se desenha e o cartão fica sálvia;
  - só na entrada da rota; as atualizações não repetem a animação.
- **Login:** o coração grande chega e o pequeno se aninha ao lado. Depois, o pequeno "respira" (CSS, infinito). **Pendente:** limitar a 3 ou 4 vezes, achado do critique.
- **Contínuos:** o brilho do sol respira 6 vezes e as estrelas piscam 4 vezes, para não animar sem parar.

## O que a Impeccable aponta como armadilha (evitar)
- creme + serifa + terracota (o "padrão de IA");
- emoji como ícone;
- texto com degradê;
- borda colorida grossa num lado só;
- sombra dura deslocada;
- *eyebrow* (rótulo pequeno acima do título);
- cartões iguais de ícone + título + texto como estrutura de página.

O detector roda sozinho depois de cada edição (hook) e pelo comando `impeccable detect`.
