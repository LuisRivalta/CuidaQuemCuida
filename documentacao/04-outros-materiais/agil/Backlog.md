---
titulo: Product Backlog
tags: [agil, backlog, historias]
---

# Product Backlog

Histórias de usuário no formato **"Como ..., quero ..., para ..."**, com critério de aceite. Prioridade: **1 = núcleo** (sem isso não há vídeo técnico), **2 = completo**, **3 = acabamento**. Ver [[Métodos Ágeis]], [[Kanban]], [[Personas]] e [[Testes e Validação]] (cenários de aceite).

| # | História | Critério de aceite | Prior. | Status |
|---|---|---|---|---|
| H01 | Como **cuidadora**, quero **criar minha conta aceitando um termo claro**, para saber o que acontece com meus dados | Sem aceite não cadastra; senha ≥ 8; e-mail único | 1 | Feito (telas e API) |
| H02 | Como **cuidadora principal**, quero **cadastrar minha mãe e informar o responsável legal**, para organizar o cuidado dela | Grava paciente, rede e consentimento; mostra código de convite | 1 | Feito |
| H03 | Como **coordenadora**, quero **convidar meus irmãos e o vizinho por um código**, para que entrem na rede sem eu criar a conta deles | Código de 6 caracteres; "gerar novo"; entrar com código vira membro | 1 | Feito |
| H04 | Como **coordenadora**, quero **montar a escala da semana**, para dividir o cuidado | Criar turno (inclusive 22h–6h); recusa conflito com 409 e mostra qual | 1 | Feito |
| H05 | Como **coordenadora**, quero **ver quem está sobrecarregado e quem pode ajudar**, para redistribuir os turnos | Aviso com horas em 7 dias e horas seguidas; sugestão do menos carregado | 2 | Feito |
| H06 | Como **neta**, quero **me oferecer para um turno vago**, para ajudar quando posso | "Posso cobrir" cria o turno para mim; recusa se eu já tenho turno | 2 | Feito |
| H07 | Como **coordenadora**, quero **cadastrar remédios com horários complicados**, para ninguém precisar fazer conta | De N em N horas, horários fixos e dia sim, dia não; doses geradas sozinhas, sem duplicar | 1 | Feito |
| H08 | Como **filho que chega para o turno**, quero **ver o que fazer agora e marcar "Dei o remédio"**, para não esquecer nem dar em dobro | Linha do tempo do turno; um toque; segunda pessoa recebe "já registrado por ..." | 1 | Feito |
| H09 | Como **cuidador**, quero **registrar que o remédio não foi dado e por quê**, para a família saber | Motivo obrigatório; status "não dado" | 2 | Feito |
| H10 | Como **vizinho**, quero **ver como fazer cada tarefa** (ex.: mudar de posição), para cuidar direito mesmo sem experiência | "Como fazer" em cada tarefa; "Feito" grava quem e quando | 2 | Feito |
| H11 | Como **cuidador**, quero **registrar a pressão e ser avisado se estiver estranha**, para agir cedo | Alerta fora da faixa e fora da curva (z > 2) | 2 | Feito |
| H12 | Como **coordenadora**, quero **configurar as faixas de cada sinal vital**, para os alertas fazerem sentido para minha mãe | Mínimo e máximo por tipo | 2 | Feito |
| H13 | Como **cuidadora esgotada**, quero **responder como estou, sem ninguém ver**, para perceber minha sobrecarga | ZBI-12, uma pergunta por vez; resultado privado; histórico | 1 | Feito |
| H14 | Como **cuidadora com sobrecarga alta**, quero **pedir ajuda à rede sem expor minha pontuação**, para não carregar sozinha | CVV 188, UBS e CAPS; alerta para todos sem a pontuação | 2 | Feito |
| H15 | Como **coordenadora**, quero **ver o painel da rede** (adesão, quem carrega, noites × sobrecarga), para enxergar o que está acontecendo | Gráficos com interpretação; "dados insuficientes" quando faltar | 2 | Feito |
| H16 | Como **membro**, quero **ver os alertas no topo de todas as telas**, para não perder nada importante | Prioridade; marcar como lido; sem repetir | 2 | Feito |
| H17 | Como **qualquer pessoa**, quero **saber quais dados são coletados e excluir minha conta**, para ter controle sobre meus dados (LGPD) | Tela "Dados coletados"; excluir anonimiza e apaga a Zarit | 2 | Feito |
| H18 | Como **avaliador do projeto**, quero **ver as requisições ao banco acontecendo**, para entender como o sistema grava e consulta | Tela "Banco ao vivo" com os últimos 50 comandos SQL | 1 | Feito |
| H19 | Como **equipe**, queremos **dados de demonstração realistas e resetáveis**, para gravar os vídeos sempre do mesmo ponto | Scripts 00 a 03; família fictícia; datas relativas a hoje | 1 | Feito (falta rodar no Supabase) |
| H20 | Como **coordenadora**, quero **mudar papéis e remover alguém da rede**, para manter a rede organizada | Rede nunca fica sem coordenador | 3 | Feito |
| H21 | Como **cuidadora com duas famílias**, quero **trocar de paciente no topo**, para ajudar as duas redes | Seletor de paciente quando há mais de uma rede | 3 | Feito |
| H22 | Como **equipe**, queremos **validar com cuidadores reais**, para ter evidência do problema | Formulário aplicado a 2 ou 3 pessoas; resultados registrados | 2 | A fazer (B4) |
| H23 | Como **cuidadora**, quero **um app nas lojas com notificação no celular** | — | roadmap | Não nesta versão (web responsiva; ver Design, seção 17) |
| H24 | Como **família**, queremos que **uma pulseira envie os sinais vitais sozinha** | — | roadmap | Não nesta versão (IoT) |
