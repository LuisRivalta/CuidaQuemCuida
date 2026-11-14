---
target: tela Hoje
total_score: 27
max_score: 40
na_heuristics: 
p0_count: 0
p1_count: 3
target_identity: "file:C:\\CuidaQuemCuida\\codigo\\src\\main\\resources\\web\\js\\telas\\hoje.js"
target_fingerprint: "sha256:ffc59fdbf618d54923c806641275f79876cda7eb24118a1cd87df55d7b1f3d08"
target_path: "C:\\CuidaQuemCuida\\codigo\\src\\main\\resources\\web\\js\\telas\\hoje.js"
timestamp: 2026-11-14T13-41-23Z
slug: codigo-src-main-resources-web-js-telas-hoje-js
---
Método: duas avaliações separadas (A: revisão de design · B: detector nos arquivos e em três telas renderizadas: celular claro, celular escuro e computador)

# Critique da tela Hoje, 2ª rodada (14/11/2026, depois das correções)

## Nota de saúde do design
| # | Heurística | Nota | Problema principal |
|---|---|---|---|
| 1 | Visibilidade do estado | 3 | "Registrado" nos 5 s sem envio, com o "Atrasado" ainda vermelho; o cartão não diz quem está no turno |
| 2 | Mundo real | 3 | "Cuidado" lido como alerta; "não dado" para dose só sem registro; horas em dois formatos |
| 3 | Controle e liberdade | 2 | Desfazer só em Feito e Dei o remédio, por 5 s; "Posso cobrir" sem volta |
| 4 | Consistência | 3 | "Atrasado" de três jeitos; "Entendi" ora link, ora pílula; tarefas sem "quem fez" |
| 5 | Prevenção de erros | 2 | Medição sem faixa de plausibilidade ("365 °C" passa); fora do turno recebe a ordem de agir |
| 6 | Reconhecer em vez de lembrar | 3 | "Por Marta às 08:06" ajuda; ações da lista escondidas até tocar |
| 7 | Flexibilidade | 2 | Sem ação em lote; entrada de 2 s repete a cada volta pelo menu |
| 8 | Estética e minimalismo | 3 | 9 itens feitos antes dos pendentes (~1.900 px até o primeiro) |
| 9 | Recuperação de erros | 3 | Falha de envio ao sair do app some sem ninguém ver |
| 10 | Ajuda | 3 | Falta orientar no "não sei se já deram" |
| **Total** | | **27/40** | **Aceitável** |

## Veredito de especificidade
Revisão: agora é deste produto (céu da hora com o arco, tema noturno pela hora, "Por Marta às", a voz de quem cuida); do cartão para baixo, componentes comuns de app de bem-estar; só o arco entende o turno.
Detector: 0 achados nos 7 arquivos e nas três telas renderizadas (claro, escuro, computador). Um aviso leve (advisory) no computador: "cuidado." sozinho na última linha do aviso de sobrecarga. O `cream-palette` só aparece com `--no-config` e é a exceção aprovada pelo Luis.
Camada visual: não disponível (só navegador sem janela).

## O que funciona
1. Céu da hora com o arco do turno; tema noturno pela hora.
2. Um toque para registrar e desfazer; "Não foi dado" com motivos; foco no próximo; atualização no lugar.
3. Voz e linguagem simples; "Ficou para trás" sem vermelho; sobrecarga sem "Posso cobrir".

## Problemas prioritários
- [P1] O cartão em destaque não sabe de quem é o turno: fora do turno dá ordem de agir (risco de dose em dobro). Correção: fora do turno, o cartão vira informação ("Com a Lurdes agora: Paulo, até 06:00", "ninguém registrou ainda (conferido às 22:31)", ação secundária "Fui eu que dei"); no turno, a dose também mostra "ninguém registrou ainda". Comando: /impeccable clarify
- [P1] "Não dado" para dose só sem registro (NAO_DADA automático). Correção: "Sem registro" em cor de atenção quando não há motivo; "Não dado · motivo · por" quando há; o cartão avisa "fica como sem registro"; orientação "Não sabe se já deram? Não dê de novo; pergunte a quem estava no turno". Comando: /impeccable clarify
- [P1] O aviso fora da faixa promete notificação que não existe; o 192 não é tocável; sem plausibilidade. Correção: "A rede vai ver o aviso quando abrir o app"; botão tel:192; faixas de plausibilidade com confirmação antes de salvar. Comando: /impeccable harden
- [P2] Desfazer frágil: falha silenciosa ao sair do app; um segundo registro tira o "Desfazer" do primeiro; difícil de alcançar pelo teclado. Correção: fila no localStorage com nova tentativa; aviso fixo quando falhar; "Desfazer" dentro do cartão, com foco, de 8 a 10 s; "Registrado às" enquanto espera. Comando: /impeccable harden
- [P2] O passado primeiro e o vermelho acumulado. Correção: feitos recolhidos ("9 feitos · ver"); sem etiqueta nos feitos; vermelho só para dose na janela de 2 h; medição vencida vai para "Ficou para trás". Comando: /impeccable distill

## Alertas por persona
Marta: "Cuidado · Atrasado" como primeira leitura; "não dado" errado à noite; "Dei o remédio" fora do turno. Paulo: ordem de agir fora do turno; o cartão não diz "ninguém registrou"; entrada repetida. João: 5 s é pouco; textos secundários de 14 a 16 px; centro do arco com letra a 150% (a conferir). Sam: foco perdido; "Desfazer" longe; Enter a mais registra o próximo. Riley: dois registros seguidos; "365"; "Posso cobrir" sem volta; desempate pela ordem da lista.

## Observações menores
Horas em dois formatos; "Cuidado" vira "Tarefa"; "No seu turno" duplicado; linhas desiguais em "já registrados"; animação contínua; Chart.js carregando na Hoje; computador (menu sem marca, coluna de 720 px); botão pêssego no escuro.

## Perguntas para pensar
1. Fora do turno, o destaque deveria ser "Quem está com a Lurdes agora"?
2. O passado se recolhe e as próximas 2 h ficam abertas?
3. Tarefa atrasada precisa de vermelho?
4. O desfazer deveria virar correção no servidor (muda a API)?
