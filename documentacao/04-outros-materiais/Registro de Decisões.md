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

## Sprint 2 — (a preencher com as decisões tomadas na compilação, nos testes e na integração)
