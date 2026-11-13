---
tipo: funcao
classe: DoseDao
tags: [funcao, medicacao, banco, concorrencia]
---

# registrar dose

`static int DoseDao.registrar(long id, StatusDose status, LocalDateTime dadaEm, long pessoaId, String observacao)` · classe [[DoseDao]] · chamada por [[MedicacaoService]]

## O que faz
Grava "Dei o remédio" ou "Não foi dado" **só se a dose ainda estiver pendente**:

```sql
UPDATE dose SET status = ?, dada_em = ?, dada_por = ?, observacao = ?
 WHERE id = ? AND status = 'PENDENTE'
```

Devolve o **número de linhas alteradas**. Se for **0**, outra pessoa registrou antes, e o serviço responde **409 "Essa dose já foi registrada por Marta Souza"**.

## Por que assim
Numa rede de cuidado, duas pessoas podem tocar no botão quase ao mesmo tempo (a filha e o vizinho, por exemplo). Ler o status e depois gravar deixaria uma janela em que as duas leem "pendente" e uma sobrescreve a outra. A condição dentro do próprio `UPDATE` torna a operação **atômica** no banco.

## Verificação
Regra em `DoseRegrasTest.naoRegistraDoseJaResolvida`. No sistema real: abrir o mesmo turno em duas janelas e tocar nas duas (Tarefa B4, passo 2).
