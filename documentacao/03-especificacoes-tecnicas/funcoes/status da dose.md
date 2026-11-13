---
tipo: funcao
classe: DoseRegras
tags: [funcao, medicacao]
---

# status da dose

`static StatusDose DoseRegras.status(LocalDateTime previsto, LocalDateTime dadaEm, boolean marcadaNaoDada, LocalDateTime agora)` · classe [[DoseRegras]] · [[Módulo Medicação]]

## O que faz
Decide o status de uma dose:

| Situação | Status |
|---|---|
| Marcada como "não foi dado" | NÃO DADA |
| Dada até **30 min** depois do previsto | DADA (no horário) |
| Dada **mais de 30 min** depois | ATRASADA |
| Sem registro e já passaram **mais de 2 h** | NÃO DADA |
| Senão | PENDENTE |

O par `podeRegistrar(status)` só deixa registrar dose **pendente**. Junto com o `UPDATE ... WHERE status = 'PENDENTE'` ([[registrar dose]]), impede que duas pessoas registrem a mesma dose.

## Exemplos (do teste)
Previsto às 8h: dada às 8h29 → DADA; 8h30 → DADA; 8h31 → ATRASADA. Sem registro às 10h01 → NÃO DADA; às 9h59 → PENDENTE.

## Testes
`DoseRegrasTest` (5 testes, incluindo `naoRegistraDoseJaResolvida`).
