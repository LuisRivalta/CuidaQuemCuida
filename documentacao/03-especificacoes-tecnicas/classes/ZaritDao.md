---
tipo: classe
camada: dao
arquivo: codigo/src/main/java/br/com/cuidaquemcuida/dao/ZaritDao.java
tags: [classe, dao]
---

# ZaritDao

**Classe** da camada **Acesso a dados (JDBC)** · `codigo/src/main/java/br/com/cuidaquemcuida/dao/ZaritDao.java`

## Para que serve
Avaliações da Escala Zarit (tabelas `avaliacao_zarit` e `resposta_zarit`). Dado de saúde privado.

Faz parte do [[Módulo Bem-estar]].

## Métodos
| Método | O que faz |
|---|---|
| `inserir(AvaliacaoZarit a) → estático long` | Grava a avaliação e as 12 respostas (chame dentro de Sql.transacao). |
| `daPessoa(long pessoaId) → estático List<AvaliacaoZarit>` | Avaliações da pessoa, da mais recente para a mais antiga. |
| `porId(long id) → estático Optional<AvaliacaoZarit>` |  |
| `apagar(long id, long pessoaId) → estático int` | Só a própria pessoa apaga. Devolve 0 se a avaliação não é dela. |
| `apagarDaPessoa(long pessoaId) → estático void` |  |
| `compartilhadasDaRede(long pacienteId) → estático List<AvaliacaoZarit>` | Avaliações de quem escolheu compartilhar a pontuação com o coordenador desta rede (consentimento). |

## Usa
[[AvaliacaoZarit]], [[FaixaZarit]], [[Sql]]

## É usada por
[[ContaService]], [[EstatisticaService]], [[ZaritService]]

---
Ver também: [[Mapa do Código]] · [[Diagrama de Classes]] · [[Arquitetura]]
