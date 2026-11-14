---
titulo: Redesenho — tela de login
data: 2026-11-14
tags: [redesenho, tela, login]
---

# Tela de login (redesenhada; correções do critique pendentes)

Arquivo: `codigo/src/main/resources/web/js/telas/login.js`, com os estilos na seção "Login" do `css/estilo.css` e no bloco `@media (min-width: 900px)`. Voltar para [[Redesenho - Passagem]].

**Estado:** redesenhada em 14/11. O 1º critique deu **26/40**, com 2 P1 e 3 P2 ([[Critique Login - rodada 1 (26 de 40)]]). **As correções ainda não foram feitas:** dependem de 3 decisões do Luis, listadas no fim.

## Fotos
- Celular, de dia: ![[login-celular.png|280]]
- Celular, de noite: ![[login-celular-noite.png|280]]
- Computador: ![[login-computador.png|600]]

## Por que foi refeito
O Luis disse: "não gostei da tela de login, você só mudou a cor e a fonte, quero que redesenhe ela". A versão antiga era um formulário simples com uma lista de e-mails de demonstração.

## O que a tela tem hoje
1. **Céu da hora,** o mesmo da tela Hoje (classe `ceu entrada-ceu`, com `data-periodo`), com estrelas à noite e morros.
2. **Marca em destaque:** os dois corações numa base arredondada, que lembra ícone de app.
   - Animação GSAP: o coração grande chega, e o pequeno vem se aninhar ao lado dele.
   - Depois, o pequeno "respira" (CSS `pulsar`, **infinito**). Limitar está pendente.
3. **Texto:** o nome em Young Serif, a frase "Quem cuida também precisa de cuidado." e a linha "Escala de revezamento, remédios e bem-estar da família, num lugar só."
4. **Formulário** num cartão sobre os morros:
   - título "Entrar";
   - E-mail (`type=email`, `inputmode=email`, `autocomplete=email`);
   - Senha (`autocomplete=current-password`) com o botão **"Mostrar"/"Ocultar"** (`aria-pressed`);
   - o botão "Entrar" vira "Entrando..." enquanto envia.
5. **"Primeira vez aqui? Criar minha conta"**, que leva a `#/cadastro`.
6. **Só no modo demonstração:** "Experimente com a família Souza", com 4 botões grandes que preenchem o formulário e entram com um toque:
   - "Entrar como Marta · Filha · coordena o cuidado"
   - "… Paulo · Filho"
   - "… Ana · Neta"
   - "… João · Vizinho"

   Cada botão tem um avatar com a inicial colorida.
7. **No computador** (≥ 900 px): o céu ocupa um painel arredondado à esquerda e o formulário fica à direita. O topo e o menu não aparecem no login: o `app.js` esconde o topo nas rotas públicas e o `body.sem-menu` tira as margens.
8. **Tema noturno:** de 18h às 6h ou com o celular em modo escuro.

## Critique 1 (26/40) — problemas encontrados
| Sev. | Problema | Correção sugerida | Comando |
|---|---|---|---|
| **P1** | Com letra a 150% ou zoom, o nome "CuidaQuemCuida" (uma palavra só, `clamp(2.1rem, 9vw, 2.8rem)`, céu com `overflow: hidden`) passa da largura e é cortado. O "Ocultar" também cobre os pontos da senha (`padding-right: 108px` em px) | container query no `.entrada-ceu` (`container-type: inline-size`; h1 com `min(2.8rem, 11cqi)`); espaço do botão em `em`; conferir em 360 px e a 150% | adapt |
| **P1** | O token fica em `sessionStorage` (`js/estado.js`): fechou a aba, entra de novo, embora a sessão do servidor dure 7 dias | `localStorage`, ou a caixa "Continuar conectado neste aparelho", marcada por padrão (sem mudar a API) | harden |
| P2 | O erro aparece no rodapé, longe dos campos, sem foco no campo e sem caminho para senha esquecida (a API não tem recuperação) | mensagem dentro do formulário com `role=alert`, `aria-invalid` e foco no campo; senha esquecida: ver as decisões abaixo | harden |
| P2 | Quem chega com código de convite (Paulo, Ana, João) não vê caminho | linha "Recebeu um código de convite? Crie sua conta e digite o código em seguida."; melhor ainda, aceitar `#/cadastro?convite=LURD26` | onboard |
| P2 | A família de exemplo não conta a história no pitch ("Filha" de quem?) | contexto "A família Souza cuida de Dona Lurdes, 82 anos, com Alzheimer."; papéis dizendo o que cada um vê ("João · vizinho: vê só o turno dele"); tirar a linha "demo1234" | clarify |

**Observações menores:**
- limitar o pulso do coração a 3 ou 4 vezes;
- desligar a lista da família durante o "Entrando...", porque dois toques disparam dois logins;
- no celular, o cartão (`margin -38px`) esconde os morros e deixa pontas verdes soltas;
- no computador, a coluna direita passa da altura de um notebook 1366×768;
- o aviso do rodapé reserva lugar para um menu que não existe no login;
- no tema noturno, a base do ícone fica acinzentada;
- o nome acessível "Mostrar a senha" não muda quando o botão mostra "Ocultar" (WCAG 2.5.3);
- o link "Criar minha conta" tem uns 28 px de altura (o padrão é 48 px);
- de dia, o halo de foco dos campos (`#e8eaf1` sobre branco) quase não aparece.

**Detector:** arquivos limpos. Nas telas renderizadas, um aviso `icon-tile-stack`: a base de 108 px da marca acima do `h1`. É provável falso positivo, porque é o logo. Mas a revisão concorda que a base em quadrado puxa para o visual de "app genérico". Pensar em tirar o quadrado e deixar os corações soltos, maiores.

## Decisões pendentes do Luis (perguntar antes de mexer)
1. **Escopo:**
   - os 5 problemas;
   - só os 2 P1;
   - os 2 P1 + a família contando a história, que pesa no vídeo.
2. **Login lembrado:**
   - caixa "Continuar conectado", marcada por padrão;
   - sempre lembrar (7 dias, "Sair" em Minha conta encerra);
   - deixar como está.
3. **Senha esquecida:**
   - texto honesto, sem rota ("a recuperação por e-mail está no roadmap");
   - não mostrar nada (fica só na documentação, como roadmap);
   - criar a rota na Parte B (muda o contrato e o Java; vai ao [[Registro de Decisões]]).

## Depois das correções
1. Fotografar o login com `node ferramentas/fotografa-telas__Claude_Code_MS125_luisgfr.mjs http://127.0.0.1:8000 <pasta> login`.
2. Rodar o detector.
3. Opcionalmente, um 2º critique.
4. Mostrar ao Luis.
5. Se for aprovado, a Fase 2 está fechada e vem a Fase 3 (`document`).
