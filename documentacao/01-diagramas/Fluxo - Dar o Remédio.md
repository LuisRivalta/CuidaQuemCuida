---
titulo: Fluxo — Dar o remédio
versao: 1 (planejada)
data: 2026-11-13
tags: [diagrama, fluxo, medicacao]
---

# Fluxo — Dar o remédio

> **Versão 1 (planejada) — 13/11/2026.** Diagrama de atividades (Fase 2: "Diagramas para simplificar fluxos"). Ver [[Casos de Uso]] (UC10 e UC11), [[Regras de Negócio]] e [[Arquitetura]] (sequência detalhada).

```mermaid
flowchart TD
    A([Abre a tela Hoje]) --> B[Sistema gera as doses do dia<br/>pela regra de cada remédio<br/>sem duplicar]
    B --> C{Passou mais de 2 h<br/>sem registro?}
    C -- sim --> C1[Dose vira NÃO DADA<br/>e avisa coordenador e turno]
    C -- não --> D[Mostra a dose na linha do tempo]
    D --> E{O que a pessoa faz?}
    E -- "Dei o remédio" --> F{Ainda está pendente?}
    E -- "Não foi dado" --> G[Pede o motivo]
    G --> F
    F -- não --> H[409: Essa dose já foi<br/>registrada por fulano]
    F -- sim --> I{Mais de 30 min<br/>depois do horário?}
    I -- não --> J[Grava DADA<br/>quem e quando]
    I -- sim --> K[Grava ATRASADA<br/>quem e quando]
    J --> L[Grava auditoria]
    K --> L
    G -. motivo .-> M[Grava NÃO DADA<br/>com o motivo]
    M --> L
    L --> N([Atualiza a tela e a adesão do painel])
    H --> N
```

## Regras envolvidas
| Regra | Valor |
|---|---|
| Dose no horário | Registrada até **30 min** depois do previsto |
| Dose atrasada | Registrada **mais de 30 min** depois |
| Dose não dada | Marcada como não dada, ou **sem registro 2 h** depois do previsto |
| Registro duplo | Só a primeira pessoa grava (`UPDATE ... WHERE status = 'PENDENTE'`) |
| Fora do turno | Qualquer membro pode registrar a qualquer hora |
