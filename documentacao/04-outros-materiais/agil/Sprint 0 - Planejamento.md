---
titulo: Sprint 0 — Planejamento
data: 2026-11-13
tags: [agil, sprint]
---

# Sprint 0 — Planejamento (13/11/2026)

Ver [[Métodos Ágeis]] · [[Kanban]] · [[Backlog]].

## Antes da sprint: descoberta (~09/11 a 12/11, data aproximada)
A dupla levantou e comparou ideias para o tema CitizenTech. As duas finalistas foram:

| Ideia | Ponto forte | Ponto fraco |
|---|---|---|
| **Xepa Solidária** (sobras de feira livre para instituições) | Domínio simples, validação fácil numa feira | Público menos invisibilizado; já existem iniciativas de coleta |
| **CuidaQuemCuida** (revezamento e apoio a cuidadores familiares) | Público invisível, forte ligação com ODS 3, 5 e 10, impacto emocional | Mais complexo (dados de saúde, LGPD, regras de escala) |

**Decisão:** CuidaQuemCuida, com escopo completo e foco total no edital.

## Objetivo da sprint
Sair com o problema entendido, a solução especificada e o plano de construção aprovado.

## O que foi feito
- **Leitura do edital** e montagem do checklist item a item ([[Edital GS 2026]]).
- **Pesquisa de concorrentes** (Lotsa Helping Hands, App Cuidar, Alzheimer.App, O Cuidador, Saúde da Pessoa Idosa, Humanis) e definição do diferencial ([[Concorrentes]]).
- **Evidências:** dados do IBGE (PNAD Contínua 2022) e escolha da Escala Zarit, validada no Brasil ([[Problema e Evidências]], [[Escala Zarit]]).
- **Decisões de tecnologia**, a partir dos conteúdos do ano: Java com JAX-RS (Jersey + Grizzly), JDBC, PostgreSQL no Supabase, telas em HTML, CSS e JS ([[Design da Solução]], seção 7).
- **Esboços das telas**, com a direção "celular primeiro" aprovada (telas Hoje, Escala, Bem-estar e Mais) ([[Wireframes]]).
- **Documento de design** escrito, revisado e aprovado ([[Design da Solução]]).
- **Plano de construção** em tarefas, com a divisão entre o que é feito no PC sem Java e o que é feito em casa.

## Revisão da sprint
Design e plano aprovados pelo Product Owner (Luis) em 13/11.

## Retrospectiva
- **Bom:** decidir cedo o que é obrigatório pelo edital evitou retrabalho; a pesquisa de concorrentes deu um diferencial claro.
- **A melhorar:** o prazo é curto (6 dias). Por isso a construção foi organizada para ter algo funcionando ao fim de cada etapa.
- **Restrição descoberta:** um dos computadores da equipe não tem Java e não pode instalar. As telas foram planejadas com um **modo demonstração**, para serem construídas e testadas sem a API (ver [[Diário de Desafios]]).
