---
target: tela de login
total_score: 26
max_score: 40
na_heuristics: 
p0_count: 0
p1_count: 2
target_identity: "file:C:\\CuidaQuemCuida\\codigo\\src\\main\\resources\\web\\js\\telas\\login.js"
target_fingerprint: "sha256:30a32d810a94dced733099a92f292b52a8b186ccaf6faf7c1042f0a6e57d5f92"
target_path: "C:\\CuidaQuemCuida\\codigo\\src\\main\\resources\\web\\js\\telas\\login.js"
timestamp: 2026-11-14T14-52-39Z
slug: codigo-src-main-resources-web-js-telas-login-js
---
Método: duas avaliações separadas (A: revisão de design · B: detector nos arquivos e na tela renderizada: celular, computador e modo escuro)

# Critique da tela de login, 1ª rodada (14/11/2026)

## Nota de saúde do design
| # | Heurística | Nota | Problema principal |
|---|---|---|---|
| 1 | Visibilidade do estado | 3 | Erro no rodapé, longe dos campos |
| 2 | Mundo real | 3 | Papéis sem referência; sem caminho do convite |
| 3 | Controle e liberdade | 2 | Sem "Esqueci minha senha" |
| 4 | Consistência | 3 | Pulso infinito; "Mostrar"/"Ocultar" × nome acessível |
| 5 | Prevenção de erros | 3 | Botões da família ativos durante o envio |
| 6 | Reconhecer em vez de lembrar | 3 | Código do convite guardado por 3 telas |
| 7 | Flexibilidade | 2 | Token em sessionStorage: entrar de novo a cada aba fechada |
| 8 | Estética e minimalismo | 3 | Pontas dos morros; título repetido; "demo1234" |
| 9 | Recuperação de erros | 2 | Erro sem próximo passo nem foco no campo |
| 10 | Ajuda | 2 | Nada sobre senha esquecida ou convite |
| **Total** | | **26/40** | **Aceitável** |

## Veredito de especificidade
Revisão: marca própria (corações, frase, céu da hora com tema noturno); estrutura de login padrão; no celular, o cartão cobre o céu. Detector: arquivos limpos; renderizado com 1 `icon-tile-stack` (quadrado de 108 px da marca acima do h1), provável falso positivo, mas a revisão concorda que o quadrado puxa para o genérico. Achado extra: no CSS da Hoje, o bloco `@media (max-height: 760px)` vem antes das regras-base de `.morros` e `.agora` (não valem).

## O que funciona
1. Marca e voz coerentes. 2. Céu da hora com tema noturno, contraste e reduzir movimento. 3. Formulário sólido (rótulos, 52 px, autocomplete, atalhos da família).

## Problemas prioritários
- [P1] Nome cortado com letra grande ou zoom (h1 numa palavra, `overflow: hidden`); "Ocultar" cobre a senha. Correção: container query no tamanho do h1; espaço do botão em `em`. Comando: /impeccable adapt
- [P1] Entrar de novo a cada aba fechada (sessionStorage com sessão de 7 dias no servidor). Correção: localStorage ou "Continuar conectado neste aparelho". Comando: /impeccable harden
- [P2] Erro sem caminho: no rodapé, sem foco no campo; sem recuperação de senha (a API não tem). Comando: /impeccable harden
- [P2] Sem caminho para quem tem convite. Correção: linha explicando + `?convite=`. Comando: /impeccable onboard
- [P2] A família de exemplo não conta a história no pitch. Correção: contexto da Dona Lurdes; papéis com o que cada um vê; tirar "demo1234". Comando: /impeccable clarify

## Alertas por persona
João: nome cortado, "Ocultar" sobre a senha, link de ~28 px, sem lugar para o código. Marta: senha esquecida é beco; entrar de novo de madrugada. Paulo: 1,5 s de animação; entrar sempre. Sam: erro sem ligação; nome acessível divergente; pulso infinito; halo de foco fraco. Jordan: convite sem caminho. Avaliadores: cartões não contam a família.

## Observações menores
Pulso limitado; lista desligada durante o envio; pontas dos morros; altura no computador; aviso reservando menu; quadrado acinzentado à noite; troca de fonte na primeira carga.

## Perguntas para pensar
1. Quantas vezes a Marta vê esta tela de madrugada? 2. Onde o João cola o código? 3. O céu como assunto no celular? 4. "App bonito" ou "família dividindo o cuidado"?
