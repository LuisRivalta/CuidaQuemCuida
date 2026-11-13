---
tipo: funcao
classe: EscalaRegras
tags: [funcao, escala, sobrecarga]
---

# blocosSemFolga

`static List<Bloco> EscalaRegras.blocosSemFolga(List<Turno> turnos)` · classe [[EscalaRegras]] · [[Módulo Escala]]

## O que faz
Junta os turnos de uma pessoa que têm **menos de 11 horas de intervalo** entre si (sem folga) num mesmo **bloco**, e soma as horas trabalhadas. O maior bloco recente vira o indicador "horas seguidas sem folga", usado no [[nivel de sobrecarga]].

**Regra** (ver [[Regras de Negócio]]): folga é um intervalo de **pelo menos 11 h** sem turno. A referência é o descanso mínimo entre jornadas da CLT (art. 66).

## Exemplo (do teste)
| Turnos | Intervalos | Resultado |
|---|---|---|
| 06–14, 22–06 (dia seguinte), 06–14 | 8 h e 0 h (menos de 11 h) | **1 bloco de 24 h** |
| 06–14 e 06–14 do dia seguinte | 16 h (folga) | **2 blocos** |

Na família da demonstração, a Marta fica de sábado a quinta sem nenhuma folga de 11 h.

## Testes
`EscalaRegrasTest.turnosComMenosDeOnzeHorasDeIntervaloFormamUmBloco` e `dezesseisHorasDeIntervaloEhFolga`.
