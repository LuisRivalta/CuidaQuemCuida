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

As 11 primeiras perguntas usam frequência, de **Nunca (0)** a **Quase sempre (4)**. A última usa intensidade, de **Nem um pouco (0)** a **Extremamente (4)**. A pontuação é a soma.

## Faixas usadas
| Faixa | Pontuação | Fonte |
|---|---|---|
| BAIXA | 0 a 10 | Divisão da equipe para o protótipo |
| MODERADA | 11 a 20 | Divisão da equipe para o protótipo |
| **ALTA** | **21 a 48** | Divisão da equipe para o protótipo |

As três faixas orientam a interface do protótipo. O estudo brasileiro de 2019 sugere um corte de 13 pontos para triagem na população estudada. Esse resultado se refere a cuidadores idosos da comunidade. A escolha das faixas do produto está no [[Registro de Decisões]].

## Perguntas
Ficam em `codigo/src/main/resources/web/dados/zarit-perguntas.json`, junto com o número do item na escala original de 22. O texto foi **adaptado para autoaplicação**: "você" e "seu familiar" no lugar de "o(a) Sr(a)" e do nome da pessoa cuidada, que aparecem na versão aplicada por entrevistador.

Em **14/11/2026**, os itens e as opções foram comparados com o Quadro 1 de [Gratão et al. (2019)](https://pmc.ncbi.nlm.nih.gov/articles/PMC6497029/) e a Tabela 1 de [Scazufca (2002)](https://doi.org/10.1590/S1516-44462002000100006). A seleção usa os itens 2, 3, 5, 6, 9, 10, 11, 12, 17, 19, 20 e 22 da escala completa.

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
