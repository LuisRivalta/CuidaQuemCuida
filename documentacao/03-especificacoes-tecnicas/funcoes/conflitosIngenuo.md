---
tipo: funcao
classe: EscalaRegras
tags: [funcao, escala, eficiencia]
---

# conflitosIngenuo

`static List<Conflito> EscalaRegras.conflitosIngenuo(List<Turno> turnos)` · classe [[EscalaRegras]]

## O que faz
A versão "força bruta" da detecção de conflitos: compara **cada turno com todos os outros**, O(n²). Fica no código para **comparação**: o teste confere que ela e a versão rápida [[conflitos]] encontram exatamente os mesmos pares. É o "antes" do desafio de eficiência no vídeo técnico.

```java
for (int i = 0; i < lista.size(); i++)
    for (int j = i + 1; j < lista.size(); j++)
        if (lista.get(i).sobrepoe(lista.get(j))) conflitos.add(new Conflito(lista.get(i), lista.get(j)));
```

## Testes
`EscalaRegrasTest.versaoRapidaEVersaoIngenuaAchamOsMesmosConflitos` e `versaoRapidaAchaTodosOsParesQuandoUmTurnoLongoCobreOutros`.
