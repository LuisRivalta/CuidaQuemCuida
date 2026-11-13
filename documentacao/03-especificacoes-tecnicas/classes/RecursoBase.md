---
tipo: classe abstrata
camada: resource
arquivo: codigo/src/main/java/br/com/cuidaquemcuida/resource/RecursoBase.java
tags: [classe, resource]
---

# RecursoBase

**Classe abstrata** da camada **API REST (JAX-RS)** · `codigo/src/main/java/br/com/cuidaquemcuida/resource/RecursoBase.java`

## Para que serve
Base dos recursos da API: quem está logado e leitura segura dos parâmetros.

## Campos principais
| Campo | Tipo |
|---|---|
| `requisicao` | `ContainerRequestContext` |

## Métodos
| Método | O que faz |
|---|---|
| `eu() → long` | Id de quem está logado (colocado pelo `AuthFilter`). |
| `corpo(T dados) → estático <T> T` | Corpo obrigatório: sem JSON, responde 400 em vez de quebrar. |
| `data(String texto, LocalDate padrao) → estático LocalDate` | Data no formato AAAA-MM-DD, ou o padrão se não veio. |

## Usa
[[ApiException]], [[AuthFilter]]

## É usada por
[[AlertaResource]], [[AuthResource]], [[DemoResource]], [[DoseResource]], [[ExecucaoResource]], [[HojeResource]], [[MedicamentoResource]], [[PacienteResource]], [[PessoaResource]], [[TarefaResource]], [[TurnoResource]], [[ZaritResource]]

---
Ver também: [[Mapa do Código]] · [[Diagrama de Classes]] · [[Arquitetura]]
