---
tipo: funcao
classe: EscalaRegras
tags: [funcao, escala, eficiencia]
---

# conflitos

`static List<Conflito> EscalaRegras.conflitos(List<Turno> turnos)` · classe [[EscalaRegras]] · [[Módulo Escala]]

## O que faz
Acha todos os pares de turnos que se sobrepõem (mesma pessoa em dois lugares ao mesmo tempo). É usada ao **criar, editar e assumir** um turno, que recusa com 409, e na **análise da escala**. A regra está em [[Regras de Negócio]].

## Como funciona (o desafio de eficiência)
1. **Ordena** os turnos pelo início: O(n log n).
2. Percorre a lista guardando numa **fila de prioridade, ordenada pelo fim**, só os turnos ainda "abertos".
3. Antes de olhar o turno atual, tira da fila todos os que já terminaram (fim ≤ início do atual): eles não podem mais conflitar com ninguém.
4. Todos os que sobraram na fila conflitam com o atual.

```java
for (Turno atual : validosOrdenados(turnos)) {
    while (!abertos.isEmpty() && !abertos.peek().getFim().isAfter(atual.getInicio())) {
        abertos.poll();
    }
    for (Turno aberto : abertos) conflitos.add(new Conflito(aberto, atual));
    abertos.add(atual);
}
```

| Versão | Complexidade | Com 1.000 turnos |
|---|---|---|
| [[conflitosIngenuo]] (todos contra todos) | O(n²) | ~500.000 comparações |
| `conflitos` (ordena e varre) | O(n log n + k), k = conflitos | ~10.000 operações |

Conteúdo do curso: **Fase 6, "Matematizando a eficiência"** (Big O) e ordenação.

## Exemplo (do teste)
Turnos 06–14, 12–18 e 20–23 da mesma pessoa → **1 conflito** (06–14 com 12–18). Turno das 22h às 6h e outro das 5h às 7h do dia seguinte → **1 conflito**. Turnos 06–14 e 14–22 → **nenhum** (encostados não conflitam).

## Testes
`EscalaRegrasTest`:
- `versaoRapidaEVersaoIngenuaAchamOsMesmosConflitos`;
- `versaoRapidaAchaTodosOsParesQuandoUmTurnoLongoCobreOutros`;
- `turnoDaNoiteConflitaComOTurnoDaMadrugadaSeguinte`.

## Desafio registrado
A primeira ideia do plano era comparar cada turno só com o de "maior fim visto até ali". Ela perde pares quando um turno longo cobre dois outros que também se sobrepõem entre si. A fila de turnos abertos resolve isso, e o teste com o turno longo prova. Ver [[Diário de Desafios]].
