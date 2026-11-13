---
tipo: classe
camada: resource
arquivo: codigo/src/main/java/br/com/cuidaquemcuida/resource/AuthResource.java
tags: [classe, resource]
---

# AuthResource

**Classe** da camada **API REST (JAX-RS)** · `codigo/src/main/java/br/com/cuidaquemcuida/resource/AuthResource.java`

## Para que serve
Login e logout.

Faz parte do [[Módulo Cadastros e Rede]].

Declaração: `class AuthResource extends RecursoBase`

## Métodos
| Método | O que faz |
|---|---|
| `login(LoginEntrada dados) → LoginSaida` | POST /api/auth/login (público) |
| `logout() → void` | POST /api/auth/logout |

## Usa
[[ContaService]], [[Dtos]], [[RecursoBase]]

---
Ver também: [[Mapa do Código]] · [[Diagrama de Classes]] · [[Arquitetura]]
