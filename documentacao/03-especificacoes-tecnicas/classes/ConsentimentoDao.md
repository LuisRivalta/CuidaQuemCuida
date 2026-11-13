---
tipo: classe
camada: dao
arquivo: codigo/src/main/java/br/com/cuidaquemcuida/dao/ConsentimentoDao.java
tags: [classe, dao]
---

# ConsentimentoDao

**Classe** da camada **Acesso a dados (JDBC)** · `codigo/src/main/java/br/com/cuidaquemcuida/dao/ConsentimentoDao.java`

## Para que serve
Registro dos consentimentos da LGPD (tabela `consentimento`).

Faz parte do [[Módulo Cadastros e Rede]].

## Métodos
| Método | O que faz |
|---|---|
| `termoUsuario(long pessoaId, String versao) → estático void` | Aceite do termo de uso pela própria pessoa, no cadastro. |
| `dadosPaciente(long pessoaId, long pacienteId, String versao, String responsavelNome) → estático void` | Declaração de quem cadastrou o paciente: é o responsável legal ou tem a autorização dele (LGPD art. 11). |

## Usa
[[Sql]]

## É usada por
[[ContaService]], [[RedeService]]

## Conceito do curso
LGPD (Fase 5): registro do consentimento

---
Ver também: [[Mapa do Código]] · [[Diagrama de Classes]] · [[Arquitetura]]
