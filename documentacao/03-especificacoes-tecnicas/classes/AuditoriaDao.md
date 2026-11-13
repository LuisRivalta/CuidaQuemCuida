---
tipo: classe
camada: dao
arquivo: codigo/src/main/java/br/com/cuidaquemcuida/dao/AuditoriaDao.java
tags: [classe, dao]
---

# AuditoriaDao

**Classe** da camada **Acesso a dados (JDBC)** · `codigo/src/main/java/br/com/cuidaquemcuida/dao/AuditoriaDao.java`

## Para que serve
Trilha de auditoria: quem alterou o quê e quando (tabela `auditoria`, Fase 5).

## Métodos
| Método | O que faz |
|---|---|
| `registrar(Long pessoaId, String acao, String tabela, Long registroId, String detalhe) → estático void` |  |

## Usa
[[Sql]]

## É usada por
[[ContaService]], [[EscalaService]], [[MedicacaoService]], [[RedeService]], [[SinalVitalService]], [[TarefaService]], [[ZaritService]]

## Conceito do curso
Auditoria de sistemas (Fase 5)

---
Ver também: [[Mapa do Código]] · [[Diagrama de Classes]] · [[Arquitetura]]
