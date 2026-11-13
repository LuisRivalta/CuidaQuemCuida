---
tipo: classe
camada: infra
arquivo: codigo/src/main/java/br/com/cuidaquemcuida/infra/ApiException.java
tags: [classe, infra]
---

# ApiException

**Classe** da camada **Infraestrutura** · `codigo/src/main/java/br/com/cuidaquemcuida/infra/ApiException.java`

## Para que serve
Erro com código HTTP e mensagem em português simples, que a tela mostra para a pessoa.

Declaração: `class ApiException extends RuntimeException`

## Campos principais
| Campo | Tipo |
|---|---|
| `status` | `int` |
| `extra` | `Map<String, Object>` |

## Métodos
| Método | O que faz |
|---|---|
| `ApiException(int status, String mensagem)` |  |
| `ApiException(int status, String mensagem, Map<String, Object> extra)` |  |
| `naoEncontrado(String mensagem) → estático ApiException` |  |
| `conflito(String mensagem) → estático ApiException` |  |
| `invalido(String mensagem) → estático ApiException` |  |

## É usada por
[[AlertaResource]], [[AlertaService]], [[AuthFilter]], [[Autorizacao]], [[ContaService]], [[ErroMapper]], [[EscalaService]], [[HojeService]], [[MedicacaoService]], [[PacienteResource]], [[RecursoBase]], [[RedeService]], [[SinalVitalService]], [[Sql]], [[TarefaService]], [[ZaritService]]

---
Ver também: [[Mapa do Código]] · [[Diagrama de Classes]] · [[Arquitetura]]
