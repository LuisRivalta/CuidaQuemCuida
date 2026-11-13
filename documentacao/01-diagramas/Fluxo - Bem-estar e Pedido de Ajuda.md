---
titulo: Fluxo — Bem-estar e pedido de ajuda
versao: 1 (planejada)
data: 2026-11-13
tags: [diagrama, fluxo, zarit, bem-estar]
---

# Fluxo — Bem-estar e pedido de ajuda

> **Versão 1 (planejada) — 13/11/2026.** Ver [[Casos de Uso]] (UC15), [[Escala Zarit]] e [[LGPD, Segurança e Acessibilidade]].

```mermaid
flowchart TD
    A([Abre Bem-estar]) --> B[Vê a última avaliação<br/>e a próxima data sugerida<br/>a cada 14 dias]
    B --> C[Responder agora]
    C --> D[12 perguntas, uma por vez<br/>Nunca 0 ... Sempre 4]
    D --> E[2 perguntas de sono<br/>horas e qualidade 1 a 5]
    E --> F[Sistema soma: 0 a 48]
    F --> G{Faixa}
    G -- "0 a 10" --> G1[Baixa]
    G -- "11 a 20" --> G2[Moderada]
    G -- "21 a 48" --> G3[Alta]
    G1 --> H[Mostra o resultado<br/>só a pessoa vê]
    G2 --> H
    G3 --> I[Mostra CVV 188, UBS e CAPS]
    I --> J{Pedir ajuda à rede?}
    J -- sim --> K[Alerta para todos da rede<br/>sem mostrar a pontuação]
    J -- não --> H
    K --> H
    H --> L{Compartilha com<br/>o coordenador?}
    L -- sim --> M[Entra nas estatísticas<br/>do painel da rede]
    L -- não --> N([Fica privado])
```

## Privacidade
- O resultado é **privado por padrão**.
- **Consentimento 1:** compartilhar a pontuação com o coordenador, por rede. Só assim entra no painel.
- **Consentimento 2:** pedir ajuda, que gera um alerta sem a pontuação.
- A pessoa pode **apagar** qualquer avaliação. Ao excluir a conta, as avaliações são apagadas de verdade.
