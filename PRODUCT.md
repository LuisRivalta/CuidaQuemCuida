# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Cuidadora ou cuidador principal (quem coordena a rede).** Na maioria das vezes uma mulher de 45 a 65 anos que cuida de um familiar acamado, com Alzheimer ou com deficiência severa. Persona: Marta, 58 anos, mora com a mãe (Lurdes, 82, Alzheimer moderado), largou o emprego, faz a maior parte dos turnos, inclusive de madrugada. Usa Android e WhatsApp o dia todo e tem pouca paciência para app complicado. Dorme mal, esquece se já deu o remédio das 20h e sente culpa de pedir ajuda. Tarefa: montar a escala, garantir os remédios, dividir o cuidado sem cobrar todo mundo e enxergar o próprio cansaço.
- **Rede de apoio (membros).** Outros filhos, netos e vizinhos que ajudariam mais se soubessem quando e como.
  - Paulo, 54, o filho que trabalha: abre o app com pressa, quer ver "o que fazer agora" e marcar que fez; tem medo de dar o remédio em dobro.
  - João, 67, o vizinho voluntário: usa letra aumentada, tem medo de "apertar errado", entra na rede por código de convite e só precisa ver o necessário para o turno.
  - Ana, 24, a neta: é quem mais se oferece para cobrir turnos vagos.
- **Pessoa cuidada.** Não usa o app; é a razão dele existir. Sofre quando o remédio atrasa, quando ninguém a muda de posição e quando quem cuida esgota.
- **Quem avalia o projeto.** Professores e turma da FIAP que assistem ao vídeo pitch (competição) e ao vídeo técnico (nota). O modo demonstração e as telas "Banco ao vivo" e "Dados coletados" existem também para eles.
- **Situação de uso.** Celular na mão, muitas vezes à noite ou de madrugada, no escuro, com sono e sendo interrompida(o) pelo cuidado.

## Product Purpose

O CuidaQuemCuida é uma rede de apoio e revezamento para cuidadores familiares. Junta, num lugar só:
- a escala de turnos entre família e vizinhos;
- os remédios com horários complexos;
- os sinais vitais com alerta;
- as tarefas de cuidado com "como fazer";
- a medição privada da sobrecarga de quem cuida (Escala Zarit, versão ZBI-12);
- um painel que mostra quem carrega o cuidado.

Sucesso para quem usa: quem cuida dorme mais e não esquece remédio, a carga se divide de verdade e a sobrecarga aparece antes de a pessoa adoecer.

Sucesso do projeto: nota máxima e competitividade na Global Solution 2026 da FIAP (tema CitizenTech, turma 2SIOA), com entrega até 19/11/2026, seguindo o edital ao pé da letra.

## Positioning

"Os apps que existem cuidam do paciente. O CuidaQuemCuida cuida também de quem cuida."

Entre as soluções pesquisadas em 13/11/2026 (Lotsa Helping Hands, App Cuidar, Alzheimer.App, O Cuidador, Saúde da Pessoa Idosa, Humanis), é a única que junta quatro coisas:
1. revezamento entre família e vizinhos, com conflito, turno vago, sobrecarga e sugestão de quem pode ajudar;
2. rotina de cuidado (remédios complexos, sinais com alerta, tarefas);
3. medição da sobrecarga do próprio cuidador, privada, com pedido de ajuda à rede;
4. números que mostram quem carrega o peso do cuidado (ligação com o ODS 5).

Tudo em português, gratuito e no navegador.

## Operating Context

- **Entrada:** a tela Hoje mostra o que fazer agora no turno, com um botão por tarefa ("Dei o remédio", "Não foi dado", "Feito", "Registrar medição").
- **Turnos:** períodos madrugada (0h–5h59), manhã (6h–11h59), tarde (12h–17h59) e noite (18h–23h59). Turno noturno = 3 h ou mais entre 22h e 6h. Folga mínima de 11 h. Atenção acima de 44 h em 7 dias ou 24 h seguidas; alerta acima de 60 h ou 36 h.
- **Remédios:** dose atrasada depois de 30 min do horário; não dada depois de 120 min.
- **Zarit:** a cada 14 dias. Faixas: baixa até 10, moderada de 11 a 20, alta acima de 20. As respostas são privadas, e "Pedir ajuda à rede" avisa a rede sem mostrar a pontuação.
- **Alertas:** aparecem dentro do sistema; não há push, SMS nem WhatsApp.
- **Entrada na rede:** por código de convite (ex.: LURD26). Papéis: coordenador e membro.
- **Modo demonstração:** a família Souza, com dados sintéticos, usado para mostrar o sistema e gravar os vídeos.

## Capabilities and Constraints

- **Código existente:** Java 21 + JAX-RS (Jersey e Grizzly) + JDBC + PostgreSQL no Supabase (região São Paulo). As telas são HTML, CSS e JS puros (ES modules, sem build), com GSAP e Chart.js por CDN, servidas pelo próprio Java. Fora da porta 8080, as telas rodam no modo demonstração, com os dados em memória.
- **Contrato da API fixo** (`documentacao/03-especificacoes-tecnicas/API.md`). Correções mínimas; mudança inevitável vai para o Registro de Decisões.
- **Orienta e organiza, não diagnostica.** Aviso obrigatório: "O CuidaQuemCuida organiza e orienta. Não substitui orientação médica."
- **LGPD:**
  - consentimento específico e destacado para dado de saúde (art. 11), dado pelo usuário e, para o paciente, pelo responsável legal;
  - o membro vê só o necessário para o turno;
  - a Zarit é privada;
  - a tela "Dados coletados" mostra o prazo de guarda de cada dado;
  - a pessoa pode ver os próprios dados e excluir a conta, com anonimização.
- **Texto da Zarit:** itens conferidos em 14/11/2026 com Gratão et al. (2019) e Scazufca (2002). A interface usa redação adaptada para autoaplicação.
- **Fora do escopo** (roadmap):
  - app nas lojas, que fica para depois por custo, por isso o projeto é web;
  - notificação push, SMS ou WhatsApp;
  - acesso de profissional de saúde;
  - dispositivos IoT.
- **Nenhuma tela, texto ou material entregue cita ferramentas de IA.**

## Brand Commitments

Confirmados pelo Luis em 14/11/2026:
- **Nome:** CuidaQuemCuida, numa palavra só, com C, Q e C maiúsculos.
- **Símbolo:** dois corações sobrepostos, um grande coral (`#ef8a62`) e um pequeno verde-sálvia (`#7aa98a`): quem cuida e quem é cuidado. É fixo.
- **Frase de abertura:** "Quem cuida também precisa de cuidado." É fixa.
- **Frase de posicionamento** (pitch): "Os apps que existem cuidam do paciente. O CuidaQuemCuida cuida também de quem cuida."
- **Voz:** português do Brasil, frases curtas, "você", acolhedora sem pieguice. Os botões dizem a ação ("Dei o remédio", "Posso cobrir"). Sem jargão médico ou técnico; erro diz o que houve e como resolver.
- **Tratamento de gênero:**
  - Ao falar com a pessoa, segue o gênero que ela informou no cadastro (campo `genero`, lido em `GET /api/pessoas/eu`). Sem informação, `OUTRO` ou `NAO_INFORMAR`, o texto fica neutro.
  - Mensagens sobre outra pessoa (por exemplo, o aviso de pedido de ajuda) usam forma neutra.

## Evidence on Hand

- **IBGE, PNAD Contínua 2022:** mulheres dedicam 21,3 h por semana a afazeres domésticos e cuidado de pessoas; homens, 11,7 h.
- **Escala Zarit validada no Brasil:** Scazufca, 2002; estudo com a ZBI-12, 2019.
- **Pesquisa de concorrentes de 13/11/2026:** `documentacao/04-outros-materiais/Concorrentes.md`.
- **Dados de demonstração** da família Souza: sintéticos (`banco/03-dados-demo.sql`, `codigo/src/main/resources/web/js/demo.js`) e sempre identificados como exemplo.
- **Ainda não existem:** depoimentos de usuários reais, números de uso, parcerias e o resultado da validação com cuidadores (Tarefa B4, a fazer). Não inventar nada disso.

## Product Principles

1. **Uma coisa por vez.** A próxima ação aparece em destaque; o resto espera a vez.
2. **Cuidar de quem cuida.** O cansaço de quem cuida é dado de primeira classe, mas privado e sem culpa.
3. **Fácil para quem tem 67 anos e para quem está com pressa.** Letra grande, botão grande, palavra simples, sem medo de apertar errado.
4. **Dividir sem cobrar.** A rede enxerga o que falta (turno vago, "Posso cobrir") sem a coordenadora precisar pedir.
5. **Orientar, não diagnosticar.**

## Accessibility & Inclusion

- Texto base de 18 px e alvos de toque de 48 px ou mais (definidos a partir da persona João).
- Contraste AA, foco visível, ícone sempre acompanhado de texto e linguagem simples.
- Respeitar "reduzir movimento" do sistema.
- Uso frequente à noite e de madrugada: as telas não podem ofuscar nem exigir precisão de quem está com sono.
