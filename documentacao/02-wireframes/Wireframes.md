---
titulo: Wireframes
versao: 1 (planejada)
data: 2026-11-13
tags: [wireframes, design, telas]
---

# Wireframes

> **Versão 1 (planejada) — 13/11/2026.** Esboços em baixa fidelidade feitos a partir da direção aprovada na Sprint 0: **celular primeiro**. Arquivo navegável: `wireframes.html` (abra no navegador). Ver [[Design da Solução]] (seção 10), [[Casos de Uso]] e [[LGPD, Segurança e Acessibilidade]].

![[imagens/wireframes.png]]

## Como chegamos aqui
Na Sprint 0, comparamos três jeitos de organizar a tela inicial:

| Opção | Como era | Decisão |
|---|---|---|
| A. Painel com menu lateral | Cartões com a visão geral | Bom no computador, apertado no celular |
| B. "O que fazer agora" | Lista do turno em ordem de horário, um botão por tarefa | **Escolhida como conteúdo** |
| C. Atalhos grandes | Quatro botões enormes e barra inferior | **Escolhida como formato no celular** |

**Resultado:** o conteúdo do B, no formato do C (botões grandes e barra inferior). No computador, a barra vira o menu lateral do A. O motivo é que a maioria vai usar no celular, em pé, ao lado do paciente.

## Regras de acessibilidade aplicadas
- Texto base de **18 px**; alvos de toque de pelo menos **48 px**.
- **Contraste AA** (cor principal verde-azulada com 5,4:1 sobre branco).
- **Ícone sempre acompanhado de texto** (nunca só a cor ou só o ícone).
- **Linguagem simples:** "Dei o remédio", não "Registrar administração".
- Rótulo em todo campo, foco visível e navegação por teclado.
- Uma pergunta por vez na Zarit, com "Pergunta N de 12" e barra de progresso.

## As telas

| # | Tela | Objetivo | Elementos principais | Decisões |
|---|---|---|---|---|
| 1 | Login | Entrar | E-mail, senha, "Criar minha conta" | No modo demonstração, mostra as contas de teste |
| 2 | **Hoje** | Saber o que fazer agora | Alertas no topo, "Seu turno", linha do tempo com um botão por item | É a tela que abre; quem só ajuda no turno quase não sai dela |
| 3 | Escala | Ver e organizar a semana | ◀ ▶ entre semanas, avisos de sobrecarga com quem pode ajudar, turnos por dia, vago tracejado | 🌙 marca o turno noturno; "Posso cobrir" no período vago |
| 4 | Novo turno | Criar turno (coordenador) | Pessoa ou vago, dia, início e fim | Fim menor que o início vai para o dia seguinte; conflito aparece na hora |
| 5 | Bem-estar (pergunta) | Responder à Zarit | Uma pergunta, 5 respostas grandes, progresso | "Só você vê" sempre visível |
| 6 | Bem-estar (resultado alto) | Acolher e encaminhar | Faixa, pontuação, CVV 188, UBS, CAPS, "Pedir ajuda à rede" | O pedido de ajuda não mostra a pontuação |
| 7 | Mais | Acessar o restante | Lista com ícone e texto | "Painel da rede" só aparece para o coordenador |
| 8 | Painel da rede | Ver os números do cuidado | Adesão, quem carrega o cuidado, média móvel, chance de atraso, correlação | Cada número com interpretação em palavras |
| 9 | Dados coletados | Transparência (LGPD) | Um cartão por dado: por quê, quem vê, por quanto tempo | Cartões em vez de tabela, para caber no celular |

## Telas reais (implementadas, modo demonstração)
Fotos tiradas do sistema funcionando, em tamanho de celular:

| Hoje (Paulo, membro) | Escala | Painel |
|---|---|---|
| ![[imagens/hoje-membro-real.png]] | ![[imagens/escala-real.png]] | ![[imagens/painel-real.png]] |

Demais fotos em `imagens/` (arquivos `*-real.png`).

## Versão final
_A preencher depois da implementação (Tarefa B5): prints das telas rodando com a API real e o que mudou em relação aos wireframes._
