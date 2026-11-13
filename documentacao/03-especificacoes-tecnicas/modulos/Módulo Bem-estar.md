---
tipo: modulo
tags: [modulo, bem-estar, zarit]
---

# Módulo Bem-estar

**Para que serve:** medir a **sobrecarga de quem cuida** com a [[Escala Zarit]] (versão de 12 itens), com privacidade total, e oferecer ajuda quando a sobrecarga é alta. É o coração do diferencial: "cuida também de quem cuida". Caso de uso: UC15 ([[Casos de Uso]]). Fluxo: [[Fluxo - Bem-estar e Pedido de Ajuda]].

| Camada | Onde |
|---|---|
| Telas | `web/js/telas/bem-estar.js` (uma pergunta por vez, resultado, CVV, pedir ajuda, privacidade); perguntas em `web/dados/zarit-perguntas.json` |
| Rotas | `POST /api/zarit`, `GET /api/zarit/minhas`, `DELETE /api/zarit/{id}`, `POST /api/zarit/{id}/pedir-ajuda`, `PUT /api/pacientes/{id}/compartilhar-zarit` |
| Recursos | [[ZaritResource]], [[PacienteResource]] |
| Serviço | [[ZaritService]] |
| Regras | [[ZaritCalculadora]] ([[pontuar Zarit]]) |
| Acesso a dados | [[ZaritDao]], [[AlertaDao]] |
| Modelo | [[AvaliacaoZarit]], [[FaixaZarit]], [[AlertaPedidoAjuda]] |
| Tabelas | `avaliacao_zarit`, `resposta_zarit` (12 linhas por avaliação), `membro_rede.compartilha_zarit` |

## Regras
- 12 respostas de 0 a 4, somando de 0 a 48: **BAIXA** até 10, **MODERADA** de 11 a 20, **ALTA** acima de 20.
- 2 perguntas de sono, fora da pontuação.
- **Privado por padrão.** Entra no painel só com consentimento, por rede.
- **Pedir ajuda** avisa os membros **sem mostrar a pontuação**.
- A auditoria registra que houve uma avaliação, mas **não a pontuação** (dado de saúde).
- Sugerida a cada 14 dias.

Testes: `ZaritCalculadoraTest` (4).
