---
tipo: classe
camada: dao
arquivo: codigo/src/main/java/br/com/cuidaquemcuida/dao/PessoaDao.java
tags: [classe, dao]
---

# PessoaDao

**Classe** da camada **Acesso a dados (JDBC)** · `codigo/src/main/java/br/com/cuidaquemcuida/dao/PessoaDao.java`

## Para que serve
Pessoas com login (tabela `pessoa`).

Faz parte do [[Módulo Cadastros e Rede]].

## Métodos
| Método | O que faz |
|---|---|
| `porEmail(String email) → estático Optional<Cuidador>` |  |
| `porId(long id) → estático Optional<Cuidador>` |  |
| `emailExiste(String email) → estático boolean` |  |
| `inserir(Cuidador c) → estático long` |  |
| `salvarAnonimizada(Cuidador c) → estático void` | Grava a pessoa já anonimizada (`Cuidador#anonimizar()`). |
| `redes(long pessoaId) → estático List<RedeDto>` | Redes de que a pessoa participa, com o nome do paciente (JOIN, Fase 5). |
| `nomesDaRede(long pacienteId) → estático Map<Long, String>` | Nome de todas as pessoas que já passaram pela rede do paciente (para mostrar "quem fez" nos registros). |

## Usa
[[Cuidador]], [[Dtos]], [[Papel]], [[Sql]], [[Vinculo]]

## É usada por
[[AlertaService]], [[ContaService]], [[EscalaService]], [[EstatisticaService]], [[HojeService]], [[MedicacaoService]], [[RedeService]], [[SinalVitalService]], [[TarefaService]], [[ZaritService]]

---
Ver também: [[Mapa do Código]] · [[Diagrama de Classes]] · [[Arquitetura]]
