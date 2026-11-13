---
tipo: classe
camada: dao
arquivo: codigo/src/main/java/br/com/cuidaquemcuida/dao/MembroRedeDao.java
tags: [classe, dao]
---

# MembroRedeDao

**Classe** da camada **Acesso a dados (JDBC)** · `codigo/src/main/java/br/com/cuidaquemcuida/dao/MembroRedeDao.java`

## Para que serve
Quem participa de cada rede de cuidado (tabela associativa `membro_rede`).

Faz parte do [[Módulo Cadastros e Rede]].

## Métodos
| Método | O que faz |
|---|---|
| `daPessoa(long pessoaId) → estático List<MembroRede>` | Todas as redes de que a pessoa participa (ativas ou não). |
| `doPaciente(long pacienteId) → estático List<MembroRede>` | Membros ativos da rede de um paciente. |
| `buscar(long pessoaId, long pacienteId) → estático Optional<MembroRede>` |  |
| `inserir(long pessoaId, long pacienteId, Papel papel, Vinculo vinculo) → estático void` |  |
| `reativar(long pessoaId, long pacienteId, Vinculo vinculo) → estático void` | Reativa quem já tinha saído da rede e volta a entrar com o código. |
| `mudarPapel(long pessoaId, long pacienteId, Papel papel) → estático int` |  |
| `desativar(long pessoaId, long pacienteId) → estático int` |  |
| `compartilharZarit(long pessoaId, long pacienteId, boolean compartilha) → estático void` |  |

## Usa
[[MembroRede]], [[Papel]], [[Sql]], [[Vinculo]]

## É usada por
[[AlertaService]], [[Autorizacao]], [[ContaService]], [[EscalaService]], [[EstatisticaService]], [[RedeService]], [[ZaritService]]

---
Ver também: [[Mapa do Código]] · [[Diagrama de Classes]] · [[Arquitetura]]
