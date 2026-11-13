---
tipo: classe
camada: service
arquivo: codigo/src/main/java/br/com/cuidaquemcuida/service/DoseRegras.java
tags: [classe, service]
---

# DoseRegras

**Classe** da camada **Serviços e regras de negócio** · `codigo/src/main/java/br/com/cuidaquemcuida/service/DoseRegras.java`

## Para que serve
Regras do status de uma dose.

Faz parte do [[Módulo Medicação]].

## Métodos
| Método | O que faz |
|---|---|
| `status(LocalDateTime previsto, LocalDateTime dadaEm, boolean marcadaNaoDada, LocalDateTime agora) → estático StatusDose` → [[status da dose]] | Marcada como não dada -> NAO_DADA. Dada até 30 min depois do previsto -> DADA; depois disso -> ATRASADA. Sem registro e passaram mais de 2 h -> NAO_DADA. Senão -> PENDENTE. |
| `podeRegistrar(StatusDose atual) → estático boolean` | Só dá para registrar (dada ou não dada) uma dose que ainda está pendente. Impede sobrescrever o registro de outra pessoa. |

## Usa
[[Limites]], [[StatusDose]]

## É usada por
[[MedicacaoService]]

## Testes
`DoseRegrasTest` (JUnit 5) em `codigo/src/test/java/`. Ver [[Testes e Validação]].

---
Ver também: [[Mapa do Código]] · [[Diagrama de Classes]] · [[Arquitetura]]
