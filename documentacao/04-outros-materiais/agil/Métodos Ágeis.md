---
titulo: Métodos Ágeis
tags: [agil, scrum]
---

# Métodos Ágeis — como o projeto foi conduzido

Critério do edital: "Apresentação dos conceitos de métodos ágeis usados para desenvolver a solução de forma **iterativa**". Usamos um **Scrum enxuto**, adaptado a um prazo de 6 dias e a uma dupla. Conteúdo do curso: Fase 1, "Framework ágil: Scrum na prática".

## Papéis
| Papel | Quem | Responsabilidade |
|---|---|---|
| **Product Owner** | Luis | Dono do backlog: prioriza as histórias, aceita cada entrega, valida com cuidadores reais, faz o vídeo pitch |
| **Scrum Master** | Gabriel Vilela | Conduz os eventos, remove impedimentos, testa no celular, faz o vídeo técnico |
| **Time de desenvolvimento** | Luis e Gabriel | Constroem o incremento |

## Artefatos
| Artefato | Onde |
|---|---|
| **Product Backlog** | [[Backlog]]: histórias de usuário com critério de aceite e prioridade |
| **Sprint Backlog e quadro** | [[Kanban]]: A fazer → Fazendo → Feito, com responsável e quem aprovou |
| **Incremento** | O sistema que roda ao fim de cada sprint (telas em modo demonstração na Sprint 1; sistema integrado na Sprint 2) |
| **Definição de Pronto** | Código + teste (quando há regra) + nota técnica no Obsidian + aceito pelo PO |
| **Histórico** | Commits do Git (datas reais) e as notas de cada sprint |

## Eventos
| Evento | Como fizemos |
|---|---|
| **Sprint Planning** | No começo de cada sprint: escolher do backlog o que cabe, quebrar em tarefas no Kanban |
| **Daily** | Mensagem curta no grupo (o que fiz, o que vou fazer, o que me impede), registrada na nota da sprint |
| **Sprint Review** | O PO testa o incremento e aceita ou devolve cada história |
| **Retrospectiva** | Bom / a melhorar / ação, registrada na nota da sprint |

## Linha do tempo (datas reais)
| Fase | Datas | Resultado |
|---|---|---|
| Descoberta | ~09/11 a 12/11 (aproximado) | Comparação de ideias; escolha do CuidaQuemCuida |
| [[Sprint 0 - Planejamento]] | 13/11 | Documento de design, pesquisa de concorrentes, esboços, backlog, plano |
| [[Sprint 1 - Construção]] | 13/11 | Contrato da API, banco, telas completas (modo demonstração), Java com testes, diagramas, documentação |
| Sprint 2 — Integração | _a preencher_ | Compilar e testar o Java, ligar ao Supabase, teste de ponta a ponta, validação com pessoas |
| Sprint 3 — Entrega | _a preencher_ | Diagramas finais, vídeos, empacotamento |
| Entrega | até 19/11 | `.zip` na FIAP ON |

## Por que isso é iterativo
- **Planejar antes de construir**, mas **ajustar no caminho:** cada mudança em relação ao plano entrou no [[Registro de Decisões]], com a data e o motivo (29 decisões só nas Sprints 0 e 1).
- **Entregas que funcionam a cada etapa:** ao fim da Sprint 1 as telas já rodavam e foram testadas; a Sprint 2 liga ao banco de verdade.
- **Feedback rápido:** testes automáticos e fotos das telas apontaram defeitos que foram corrigidos na mesma sprint ([[Diário de Desafios]]).
- **Diagramas evoluem:** versão 1 (planejada) e versão final (implementada) lado a lado ([[Diagrama do Banco]], [[Arquitetura]]).
