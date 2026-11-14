---
titulo: Registro de Decisões
tags: [engenharia, decisoes]
---

# Registro de Decisões

Cada decisão importante, com data e motivo. Quando o código mudar em relação ao planejado, ela entra aqui. Ver [[Design da Solução]] (seção 19) e [[Diário de Desafios]].

## Sprint 0 — Planejamento (13/11/2026)
| # | Decisão | Por quê |
|---|---|---|
| D01 | Tema: **CuidaQuemCuida** (no lugar da Xepa Solidária) | Público invisível, ligação forte com os ODS 3, 5 e 10 e maior impacto |
| D02 | Escopo completo: 7 módulos | Objetivo de nota máxima e competição de ideias |
| D03 | Java 21 + JAX-RS (**Jersey + Grizzly**) | Conteúdo da Fase 5 (Cap 7); servidor sobe pelo `main` |
| D04 | **PostgreSQL no Supabase** (em vez do Oracle da FIAP) | Acesso da dupla de qualquer lugar; painel web mostra os dados no vídeo; dados no Brasil. Os conceitos de JDBC, modelagem e SQL do curso valem igual |
| D05 | Acesso ao banco **só pelo Java, via JDBC**; RLS ligado sem política | O vídeo técnico mostra o Java fazendo as requisições; fecha a API automática do Supabase |
| D06 | Telas em HTML, CSS e JS puros, **celular primeiro** | Fase 4 (front-end não integrado); a maioria usa no celular |
| D07 | **Web responsiva, não app de loja** | Custo (US$ 99/ano na Apple, US$ 25 na Google), prazo e o edital exige Java; a API já serve um app futuro |
| D08 | **ZBI-12** a cada 14 dias + 2 perguntas de sono | Validada no Brasil e rápida no celular |
| D09 | Zarit **privada** com dois consentimentos (compartilhar e pedir ajuda) | Dado de saúde mental (LGPD art. 11) |
| D10 | Limites: folga de 11 h; atenção > 44 h/24 h; alerta > 60 h/36 h; dose atrasada > 30 min; não dada > 2 h; z > 2 com 7 medições | Referências da CLT e decisões da equipe; ficam na classe `Limites` |
| D11 | Login próprio por pessoa; perfis coordenador e membro; entrada por código de convite | Saber quem fez o quê; cada um aceita o próprio termo |
| D12 | Consentimento do paciente declarado pelo coordenador, com o nome do responsável legal | O paciente não usa o sistema |
| D13 | Registro permitido fora do turno; Hoje sem turno mostra o próximo turno e as pendências | Na vida real o remédio às vezes sai depois do fim do turno |
| D14 | Alertas calculados quando a tela abre, com chave única | Não precisa de rotina em segundo plano |
| D15 | Exclusão de conta por anonimização; a Zarit é apagada de verdade | Mantém o histórico de cuidado da família sem identificar a pessoa |
| D16 | Diagramas em Mermaid nas notas do Obsidian; DER final pelo DBeaver | Documentação viva, versionada com o código |
| D17 | Faixas da Zarit: baixa ≤ 10, moderada 11 a 20, alta > 20 | Só a faixa alta tem fonte (formulário ZBI-12); as outras são do protótipo |

## Sprint 1 — Construção das telas, do banco e do Java (13/11/2026)
| # | Decisão | Por quê |
|---|---|---|
| D18 | Telas com **modo demonstração** (contrato da API em memória) | Construir e testar as telas num computador sem Java ([[Diário de Desafios]] nº 3) |
| D19 | Membro pode criar turno **só para si mesmo** | Sem isso, "Posso cobrir" um período vago não teria como funcionar (vago = ausência de turno) |
| D20 | Medições como **tarefas com tipo de sinal** ("Medir pressão") | A tela Hoje precisa saber quando medir; evita uma tabela nova |
| D21 | Horários das tarefas **dão a volta no relógio** (módulo 24 h) | A pessoa acamada também precisa mudar de posição de madrugada |
| D22 | Dose em horário sem ninguém na escala vira "não dada" nos dados de demonstração | Reforça a história do turno vago |
| D23 | Conflitos com **fila de prioridade** em vez de "maior fim" | A primeira ideia perdia pares ([[Diário de Desafios]] nº 1) |
| D24 | **Pool mínimo de conexões** em vez de abrir uma por comando | Abrir conexão segura até o Supabase a cada SQL deixaria as telas lentas |
| D25 | Todas as rotas `/pacientes/**` numa só classe de recurso | O JAX-RS escolhe um único recurso raiz por caminho ([[Diário de Desafios]] nº 7) |
| D26 | Datas no JSON sempre `AAAA-MM-DDTHH:MM:SS`; valor indefinido = `null` | O JSON não aceita NaN; as telas tratam `null` como "Dados insuficientes" |
| D27 | "Dados coletados" em cartões, não em tabela | A tabela de 4 colunas não cabia no celular |
| D28 | Perguntas da Zarit marcadas como "não conferidas" | Fontes inacessíveis na rede usada; conferir antes de gravar ([[Diário de Desafios]] nº 8) |
| D29 | Notas de classe geradas a partir do próprio código | A documentação fica sempre igual ao implementado |

## Revisão de código da Sprint 1 (14/11/2026)
| # | Decisão | Por quê |
|---|---|---|
| D30 | Alertas calculados que deixaram de valer são marcados como lidos automaticamente | Sem isso, "remédio daqui a pouco" continuava no topo depois de dado |
| D31 | Doses e tarefas do dia: ler antes e inserir só o que falta | Cada tela aberta mandava dezenas de INSERTs para o banco |
| D32 | Conexão só é testada (`isValid`) se ficou parada mais de 30 s | Testar sempre era uma ida extra ao banco por comando |
| D33 | A tela Hoje usa os alertas que vêm no `/hoje` | Evita recalcular tudo numa segunda chamada |

## Redesenho visual das telas (14/11/2026)
| # | Decisão | Por quê |
|---|---|---|
| D34 | Novo visual "acolhedor e calmo": céu que muda com a hora (madrugada, manhã, tarde, noite), morros, azul-noite, pêssego e verde-sálvia; fundo pêssego bem claro (`#fff4ec`) | O visual anterior era frio e genérico; quem usa está cansado e usa muito de madrugada |
| D35 | Fontes Young Serif (títulos) e Lexend (texto); movimento com GSAP (por CDN); ícones desenhados em SVG, sem emoji | A Lexend foi criada para facilitar a leitura; emoji muda de aparelho para aparelho |
| D36 | Marca fixa: dois corações (coral e sálvia), o nome CuidaQuemCuida e a frase "Quem cuida também precisa de cuidado." | Uma identidade só para telas, vídeos e documentação |
| D37 | Tema noturno automático: de 18h às 6h ou com o celular em modo escuro | Não ofuscar quem cuida de madrugada |
| D38 | Tratamento de gênero pelo campo `genero` do cadastro; texto neutro quando não houver; mensagens sobre outra pessoa sempre neutras | A maioria de quem cuida é mulher, mas a rede tem homens; a mensagem de pedido de ajuda (`AlertaPedidoAjuda`) fica neutra na Parte B |
| D39 | Tela Hoje: o item em destaque segue uma prioridade (remédio dentro do prazo, item da hora, atrasado mais recente, próximo); tarefas superadas vão para "Ficou para trás" | Antes o destaque podia ser uma tarefa de 12 h atrás e esconder um antibiótico na hora certa |
| D40 | Registro com "Desfazer" (15 s para remédio, 8 s para o resto), guardado no navegador até o servidor confirmar, numa fila por pessoa | Medo de apertar errado; internet instável; a API não tem rota de correção ([[Diário de Desafios]] nº 10) |
| D41 | A tela Hoje se atualiza a cada minuto e ao voltar ao app, sem voltar ao topo, e fica travada até a versão nova chegar | Tela parada leva a remédio em dobro |
| D42 | "Quem deu e quando" e "quem está cuidando agora" vêm de rotas que já existiam (`GET /pacientes/{id}/doses` e `/turnos`), sem mudar o `/hoje` | Correções mínimas: o contrato da API não muda |
| D43 | Fora do turno, o destaque é só remédio atrasado, com "antes de dar, confirme com quem está no turno"; no resto, um cartão calmo dizendo quem está cuidando | Evita dose em dobro e mostra a cada membro só o necessário |
| D44 | "Sem registro" separado de "Não dado" | O sistema marca a dose como não dada depois de 120 min sem registro, o que não quer dizer que não foi dada |
| D45 | "Não foi dado" com motivos em botões (no lugar da caixa do navegador) e aviso no "Estava dormindo" ("Vou dar quando acordar") | Rápido no celular; evita registrar "não dado" quando o remédio vai ser dado depois |
| D46 | Medição com unidade, vírgula aceita, conferência de valor impossível e aviso fixo fora da faixa, com botão para ligar para o SAMU (192) | Um erro de digitação viraria alarme para a rede; o sistema não manda notificação |
| D47 | Quando a sobrecarga é de quem está vendo, o aviso fala com a pessoa e fica no topo; quem está sobrecarregado não recebe "Posso cobrir" | "Cuidar de quem cuida" é o diferencial do produto |
| D48 | Login com o céu, a marca e, no modo demonstração, botões para entrar como cada pessoa da família de exemplo | Facilita a apresentação e a gravação dos vídeos |
| D49 | Alvos de toque de 48 px em tudo e letra relativa (112,5%) | Persona João; respeitar a letra escolhida no navegador |
| D50 | Login com opção "Continuar conectado neste aparelho", pré-marcada. Mensagem de erro no formulário, orientação para convite e contexto da família de exemplo | A pessoa pode limitar a sessão à aba. A tela usa as rotas de cadastro e login já existentes |
| D51 | Bem-estar com pausa opcional antes da avaliação | A pessoa pode fazer uma pausa ou iniciar as perguntas imediatamente |

## Compilação e integração (14/11/2026)

| # | Decisão | Por quê |
|---|---|---|
| D52 | Testar a API com PostgreSQL local isolado e dados fictícios | Permitiu validar os scripts e o acesso JDBC antes da conexão no Supabase |
| D53 | Usar o item 22 como última pergunta da ZBI-12, com opções de intensidade | A seleção corresponde ao estudo brasileiro de 2019. Referências em [[Escala Zarit]] |
| D54 | Tornar a versão web instalável por manifesto e ícone da marca | Cumpre a etapa PWA do roadmap. Os dados de cuidado continuam acessados pela API quando há conexão |
