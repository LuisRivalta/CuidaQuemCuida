---
tipo: classe
camada: dao
arquivo: codigo/src/main/java/br/com/cuidaquemcuida/dao/PacienteDao.java
tags: [classe, dao]
---

# PacienteDao

**Classe** da camada **Acesso a dados (JDBC)** · `codigo/src/main/java/br/com/cuidaquemcuida/dao/PacienteDao.java`

## Para que serve
Pessoas cuidadas (tabela `paciente`).

Faz parte do [[Módulo Cadastros e Rede]].

## Métodos
| Método | O que faz |
|---|---|
| `porId(long id) → estático Optional<Paciente>` |  |
| `porCodigo(String codigo) → estático Optional<Paciente>` |  |
| `codigoExiste(String codigo) → estático boolean` |  |
| `inserir(Paciente p) → estático long` |  |
| `atualizar(Paciente p) → estático void` |  |
| `mudarCodigo(long id, String codigo) → estático void` |  |
| `apagar(long id) → estático void` | Apaga o paciente e, em cascata, todos os dados de cuidado dele. |
| `daPessoa(long pessoaId) → estático List<PacienteResumo>` | Pacientes das redes de que a pessoa participa, com o papel dela em cada uma. |

## Usa
[[Dtos]], [[Paciente]], [[Papel]], [[Sql]]

## É usada por
[[ContaService]], [[RedeService]]

---
Ver também: [[Mapa do Código]] · [[Diagrama de Classes]] · [[Arquitetura]]
