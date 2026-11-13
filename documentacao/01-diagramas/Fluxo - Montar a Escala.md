---
titulo: Fluxo — Montar a escala
versao: 1 (planejada)
data: 2026-11-13
tags: [diagrama, fluxo, escala]
---

# Fluxo — Montar a escala

> **Versão 1 (planejada) — 13/11/2026.** Ver [[Casos de Uso]] (UC03 e UC14), [[Regras de Negócio]] e a nota da função [[conflitos]].

```mermaid
flowchart TD
    A([Coordenador abre a Escala]) --> B[Toca + Novo turno]
    B --> C[Escolhe a pessoa ou vago,<br/>o dia, o início e o fim]
    C --> D{Fim menor<br/>que o início?}
    D -- sim --> D1[Fim passa para o dia seguinte<br/>ex.: 22h às 6h]
    D -- não --> E
    D1 --> E{Fim depois<br/>do início?}
    E -- não --> E1[400: O fim do turno precisa<br/>ser depois do início]
    E -- sim --> F{Turno vago?}
    F -- sim --> H[Grava o turno]
    F -- não --> G[Busca os turnos da pessoa<br/>em TODAS as redes]
    G --> G1[Ordena pelo início e varre<br/>com a fila dos turnos abertos<br/>O de n log n]
    G1 --> G2{Algum turno<br/>sobrepõe?}
    G2 -- sim --> G3[409: fulano já tem turno<br/>nesse horário + lista]
    G2 -- não --> H
    H --> I[Análise da semana]
    I --> I1[Períodos sem ninguém<br/>se o paciente precisa de 24 h]
    I --> I2[Sobrecarga de cada um:<br/>horas em 7 dias e horas<br/>seguidas sem 11 h de folga]
    I2 --> I3{Atenção ou alerta?}
    I3 -- sim --> I4[Aviso amarelo +<br/>quem pode ajudar,<br/>do menos carregado]
    I1 --> J([Membros veem 'Posso cobrir'])
```

## Regras envolvidas
| Regra | Valor |
|---|---|
| Folga | Pelo menos **11 h** sem turno (referência: CLT, art. 66) |
| Atenção | Mais de **44 h** em 7 dias ou mais de **24 h** seguidas |
| Alerta | Mais de **60 h** em 7 dias ou mais de **36 h** seguidas |
| Conflito | Um turno começa antes de o outro terminar; turnos encostados não conflitam |
| Quem cria turno | O coordenador, para qualquer membro; o membro, só para si mesmo (cobrir vago) |
