---
target: tela Hoje
total_score: 29
max_score: 40
na_heuristics: 
p0_count: 0
p1_count: 1
target_identity: "file:C:\\CuidaQuemCuida\\codigo\\src\\main\\resources\\web\\js\\telas\\hoje.js"
target_fingerprint: "sha256:7ba8c56bc3f48db4d2faf6ca5b5f1b3fc7d79ed63bd110287afda73ae4b4813a"
target_path: "C:\\CuidaQuemCuida\\codigo\\src\\main\\resources\\web\\js\\telas\\hoje.js"
timestamp: 2026-11-14T14-09-15Z
slug: codigo-src-main-resources-web-js-telas-hoje-js
---
Método: duas avaliações separadas (A: revisão de design · B: detector nos arquivos e em três telas renderizadas: celular claro, celular escuro e computador)

# Critique da tela Hoje, 3ª rodada (14/11/2026)

## Nota de saúde do design
| # | Heurística | Nota | Problema principal |
|---|---|---|---|
| 1 | Visibilidade do estado | 3 | Remédio e tarefa sem fechamento depois dos 8 s; erro do servidor some em 5 s |
| 2 | Mundo real | 3 | "Estava dormindo" fecha a dose para sempre; "88 h sem folga" no presente quando a pessoa está de folga |
| 3 | Controle e liberdade | 3 | Sem desfazer no "Não foi dado" |
| 4 | Consistência | 3 | "Atrasado" em duas cores; fechamento só na medição |
| 5 | Prevenção de erros | 3 | Dose atrasada vista fora do turno, sem "pergunte antes de dar" |
| 6 | Reconhecer em vez de lembrar | 3 | "Por Marta às" escondido no grupo "Já registrados" |
| 7 | Flexibilidade | 2 | Sem ação em lote; entrada a cada abertura |
| 8 | Estética e minimalismo | 3 | Céu com ~55% da primeira tela; 16 linhas fora do turno |
| 9 | Recuperação de erros | 3 | Erro do servidor some em 5 s |
| 10 | Ajuda | 3 | Falta orientação no estado de maior risco |
| **Total** | | **29/40** | **Bom** |

## Veredito de especificidade
Revisão: reconhecível (céu da hora, lua crescente, arco do turno, caminho do dia); avisos abaixo do cartão com padrão comum. Detector: 0 achados nos arquivos e nas três telas, sem aviso leve; só o `cream-palette` aprovado fica escondido pela configuração. Camada visual: não disponível. As fotos 02 e 07 não mostraram "Não foi dado" nem "Desfazer" (o destaque era uma medição); esses estados foram avaliados pelo código.

## O que funciona
1. Interação com remédio pensada para segurança (dentro e fora do turno, "conferido às", "Por Marta às", registro otimista com desfazer e fila sem internet).
2. Tema noturno de verdade.
3. Voz e acessibilidade estruturais.

## Problemas prioritários
- [P1] Dose atrasada vista fora do turno, sem "pergunte antes de dar" (risco de dose em dobro). Correção: "Ainda sem registro no app. Quem está com a Lurdes é o Paulo: antes de dar, confirme com ele." Comando: /impeccable clarify
- [P2] `ajustarArco` liga o modo apertado sempre (limite de 0,55 baixo demais); o botão principal desce. Correção: ajustar o limite, céu menor em telas curtas, uma linha só com letra grande. Comando: /impeccable layout
- [P2] Formulário de medição embaixo do menu flutuante. Correção: `scroll-padding-bottom`. Comando: /impeccable adapt
- [P2] Fora do turno, lista do dia inteiro (16 linhas). Correção: agrupar por turno (agora · seu turno · mais tarde, recolhido). Comando: /impeccable distill
- [P2] "Não foi dado" definitivo e sem desfazer; "Estava dormindo" fecha a dose. Correção: desfazer de 8 s e aviso para "Estava dormindo". Comando: /impeccable harden

## Alertas por persona
Marta: resposta ao "já dei?" escondida; destaque do turno do Paulo às 23h; "88 h" no presente. Paulo: 16 linhas; sem "Dado por você" visível depois dos 8 s. João: botão fora da primeira tela com letra grande; 8 s pouco. Sam: hora fora do summary; erro some; foco atrás do menu. Riley: fila do localStorage não separada por pessoa nem apagada ao sair. Casey: erro do envio feito ao bloquear o celular some.

## Observações menores
Erros deveriam persistir; fechamento só na medição; link "Ver onde dá para ajudar" com menos de 48 px; saudação maior que o título da tarefa; computador (morros cortados, menu vazio); ícone sozinho no turno vago a 150%.

## Perguntas para pensar
1. Fora do turno, o destaque deveria ser quem está com a pessoa?
2. O arco poderia virar o cabeçalho do cartão "Agora"?
3. Como corrigir um "Dei o remédio" depois dos 8 s?
4. "Último remédio: ..., dado por você às ..." sempre à vista?
