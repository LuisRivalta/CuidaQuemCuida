---
tipo: funcao
classe: EscalaRegras
tags: [funcao, escala, sobrecarga]
---

# nivel de sobrecarga

`static NivelSobrecarga EscalaRegras.nivel(double horas7d, double horasSeguidas)` · classe [[EscalaRegras]]

## O que faz
Classifica a carga de uma pessoa em **OK**, **ATENÇÃO** ou **ALERTA**. Usa as horas dos últimos 7 dias ([[horasNaJanela]]) e as horas seguidas sem folga ([[blocosSemFolga]]).

| Nível | Quando | Ligado à |
|---|---|---|
| ALERTA | mais de **60 h** em 7 dias **ou** mais de **36 h** seguidas | aviso e sugestão de quem pode ajudar |
| ATENÇÃO | mais de **44 h** em 7 dias **ou** mais de **24 h** seguidas | aviso amarelo |
| OK | o resto | — |

44 h é a jornada semanal da CLT; os limites ficam na classe [[Limites]] para ajuste.

## Exemplo (do teste)
`nivel(45, 10)` = ATENÇÃO · `nivel(61, 10)` = ALERTA · `nivel(30, 37)` = ALERTA · `nivel(44, 24)` = OK (o limite é "mais de").

## Testes
`EscalaRegrasTest.niveisDeSobrecarga`.
