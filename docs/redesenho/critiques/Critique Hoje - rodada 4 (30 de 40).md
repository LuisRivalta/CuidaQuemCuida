---
target: tela Hoje
total_score: 30
max_score: 40
na_heuristics: 
p0_count: 0
p1_count: 1
target_identity: "file:C:\\CuidaQuemCuida\\codigo\\src\\main\\resources\\web\\js\\telas\\hoje.js"
target_fingerprint: "sha256:7620b17051a57c8c259e36671d883f6a9e28ebe089fa0527395569d83d0ebe58"
target_path: "C:\\CuidaQuemCuida\\codigo\\src\\main\\resources\\web\\js\\telas\\hoje.js"
timestamp: 2026-11-14T14-32-49Z
slug: codigo-src-main-resources-web-js-telas-hoje-js
---
Método: duas avaliações separadas (A: revisão de design · B: detector nos arquivos e em três telas renderizadas)

# Critique da tela Hoje, 4ª rodada (14/11/2026)

## Nota de saúde do design
| # | Heurística | Nota | Problema principal |
|---|---|---|---|
| 1 | Visibilidade do estado | 3 | Tempo do "Desfazer" invisível; erro em segundo plano sem dizer o item |
| 2 | Mundo real | 4 | Só "fica como sem registro" soa como termo de sistema |
| 3 | Controle e liberdade | 3 | Sem correção depois dos 8 s |
| 4 | Consistência | 3 | Medição sem desfazer nem fila; "Atrasado" ao lado de "Registrado"; "registrado" × "salvo" |
| 5 | Prevenção de erros | 3 | "Estava dormindo" com "Confirmar" como botão principal; tela antiga tocável ao voltar |
| 6 | Reconhecer em vez de lembrar | 3 | "Último remédio dado" mostra um só |
| 7 | Flexibilidade | 2 | Sem marcar várias de uma vez |
| 8 | Estética e minimalismo | 3 | Pilha de caixas pastel; página longa fora do turno |
| 9 | Recuperação de erros | 3 | Erro em segundo plano sem contexto |
| 10 | Ajuda | 3 | "Como fazer" do destaque fecha a cada minuto |
| **Total** | | **30/40** | **Bom** |

## Veredito de especificidade
Revisão: feita para o produto (céu da hora, arco do turno, voz de cuidador); da metade para baixo, kit comum de caixas pastel. Detector: 0 achados nos 7 arquivos e nas 3 telas, pela 3ª vez seguida. Camada visual: não disponível.

## O que funciona
1. Proteção contra dose em dobro no texto e nos estados.
2. Destaque e linha do tempo que aguentam celular pequeno e letra grande.
3. Ciclo de registro bem pensado (desfazer com foco, fila por pessoa, foco no próximo título).

## Problemas prioritários
- [P1] A atualização em segundo plano atropela: tela antiga tocável ao voltar, destaque trocando debaixo do dedo, "Como fazer" fechando, foco perdido. Correção: `inert`/`aria-busy` ao ficar oculta até montar; não redesenhar com registro esperando o desfazer; bloquear o cartão quando o destaque mudar; `data-chave` no "Como fazer"; devolver o foco. Comando: /impeccable harden
- [P2] "Estava dormindo" com "Confirmar" como botão principal. Correção: o principal vira "Vou dar quando acordar"; o secundário, "Registrar como não dado mesmo assim". Comando: /impeccable clarify
- [P2] Sem correção depois dos 8 s e janela invisível. Correção: contagem visível, 15 s para remédio, "Registrou errado? Avise quem coordena"; rota de correção vai para o Registro de Decisões. Comando: /impeccable harden
- [P2] Fora do turno, a tela é do turno dos outros (e a lista de remédios expõe o diagnóstico ao vizinho). Correção: destaque só para remédio atrasado; cartão calmo para tarefa alheia; "Seu turno" primeiro; recolher o resto. Comando: /impeccable distill
- [P2] Erros em segundo plano sem contexto; falha da medição escondida; fila do modo demonstração disparando erro no vídeo. Correção: título e horário no registro; conferir o resultado do PUT; limpar a fila no login da demonstração. Comando: /impeccable harden

## Alertas por persona
Marta: destaque do Paulo às 23h × "descanse"; último remédio incompleto. Paulo: destaque alheio fora do turno; armadilha do "Estava dormindo". João: "Como fazer" fecha; 8 s pouco; vê todos os remédios. Casey: envio imediato ao sair; tela velha tocável. Sam: foco volta ao topo. Riley: erro sem contexto; medição em dois envios; dose dupla dentro dos 8 s.

## Observações menores
"Atrasado" ao lado de "Registrado" na lista; botões do aviso de sobrecarga desalinhados; vocabulário; medição sem fila; "Atrasado" 4 vezes; botão pêssego claro de madrugada; foto 02 igual à 01.

## Perguntas para pensar
1. Às 23h, chamar a Marta ou deixá-la dormir?
2. Os 8 s são regra de segurança ou de interface?
3. A contagem consola ou cobra?
4. O que é "o necessário para o turno" do João?
