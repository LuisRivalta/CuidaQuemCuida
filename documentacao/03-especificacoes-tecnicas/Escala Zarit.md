---
titulo: Escala Zarit
tags: [especificacao, zarit, bem-estar]
---

# Escala Zarit (sobrecarga do cuidador)

Instrumento usado no módulo **Bem-estar**. Ver [[Módulo Bem-estar]], [[Regras de Negócio]], [[Estatística]] e [[LGPD, Segurança e Acessibilidade]].

## O que é
A **Zarit Burden Interview** mede a sobrecarga que quem cuida *sente* por causa do cuidado: tempo para si, saúde, vida social, tensão, dúvidas. Foi criada para cuidadores de pessoas com demência e é uma das escalas mais usadas no mundo.

| Versão | Itens | Pontuação | Uso no projeto |
|---|---|---|---|
| Original (Zarit) | 22 | 0 a 88 | Referência |
| Tradução brasileira validada (Scazufca, 2002) | 22 | 0 a 88 | Fonte do texto em português |
| **Versão curta ZBI-12** (Bédard et al., 2001) | **12** | **0 a 48** | **Usada no CuidaQuemCuida**: mais rápida de responder no celular |

Cada item é respondido numa escala de frequência: **Nunca (0), Raramente (1), Algumas vezes (2), Frequentemente (3), Sempre (4)**. A pontuação é a soma.

## Faixas usadas
| Faixa | Pontuação | Fonte |
|---|---|---|
| BAIXA | 0 a 10 | Divisão da equipe para o protótipo |
| MODERADA | 11 a 20 | Divisão da equipe para o protótipo |
| **ALTA** | **21 a 48** | Formulário ZBI-12: pontuação **acima de 20** sugere sobrecarga alta |

Só a faixa ALTA tem respaldo direto na fonte. A divisão entre BAIXA e MODERADA é do protótipo e está registrada em [[Registro de Decisões]]. O estudo brasileiro de 2019 com a ZBI-12 sugere pontos de corte por quartis, uma alternativa para versões futuras.

## Perguntas
Ficam em `codigo/src/main/resources/web/dados/zarit-perguntas.json`, junto com o número do item na escala original de 22. O texto foi **adaptado para autoaplicação**: "você" e "seu familiar" no lugar de "o(a) Sr(a)" e do nome da pessoa cuidada, que aparecem na versão aplicada por entrevistador.

> **Pendente:** o texto e a seleção dos 12 itens ainda não foram comparados com as fontes originais (o arquivo está com `"conferido": false`). Conferir antes da gravação (Tarefa B4) com:
> - Scazufca M. *Brazilian version of the Burden Interview scale for the assessment of burden of care in carers of people with mental illnesses.* Rev Bras Psiquiatr. 2002;24(1):12-7.
> - Bédard M. et al. *The Zarit Burden Interview: a new short version and screening version.* The Gerontologist. 2001;41(5):652-7 (tabela com os itens da versão de 12).
> - PDF com a escala completa em português (Universidade Federal de Pelotas): `dms.ufpel.edu.br/static/bib/apoio/zarit.pdf`.

Além das 12 perguntas, há **2 perguntas de sono**, fora da pontuação: horas dormidas por noite e qualidade do sono (de 1 a 5). Elas alimentam a correlação "turnos noturnos × sono" do [[Estatística|painel]].

## Privacidade
- O resultado é **privado por padrão**: só quem respondeu vê.
- **Consentimento 1:** "Compartilhar minha pontuação com quem coordena a rede", por rede. Só assim a avaliação entra nas estatísticas do painel.
- **Consentimento 2:** "Pedir ajuda à rede", oferecido quando a faixa é ALTA. Avisa os membros sem mostrar a pontuação.
- A pessoa pode **apagar** qualquer avaliação. Ao excluir a conta, todas as avaliações são apagadas de verdade (não só anonimizadas).

## Direitos autorais
A Zarit Burden Interview tem direitos autorais (Mapi Research Trust). O uso é livre para pesquisa acadêmica sem financiamento, que é o caso deste protótipo da faculdade. Um uso comercial exigiria licença.

## Frequência
Sugerida **a cada 14 dias** (a tela mostra a próxima data), mas pode ser respondida a qualquer momento.

## Não é diagnóstico
A escala mede a sobrecarga percebida. Não diagnostica depressão nem outro problema de saúde. No risco alto, o sistema orienta a buscar o CVV (188), a UBS e o CAPS.
