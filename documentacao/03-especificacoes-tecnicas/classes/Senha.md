---
tipo: classe
camada: infra
arquivo: codigo/src/main/java/br/com/cuidaquemcuida/infra/Senha.java
tags: [classe, infra]
---

# Senha

**Classe** da camada **Infraestrutura** · `codigo/src/main/java/br/com/cuidaquemcuida/infra/Senha.java`

## Para que serve
Senhas guardadas só como hash PBKDF2-HMAC-SHA256 com salt (recomendação OWASP), usando a própria biblioteca padrão do Java. A senha nunca é gravada nem pode ser lida de volta.

## Métodos
| Método | O que faz |
|---|---|
| `novoSalt() → estático String` |  |
| `hash(String senha, String saltBase64) → estático String` → [[hash da senha]] |  |
| `confere(String senha, String saltBase64, String hashBase64) → estático boolean` | Compara em tempo constante. Conta anonimizada (hash vazio) nunca confere. |
| `novoToken() → estático String` | Token de sessão: 32 bytes aleatórios em Base64 seguro para URL (43 caracteres). |

## É usada por
[[ContaService]]

## Testes
`SenhaTest` (JUnit 5) em `codigo/src/test/java/`. Ver [[Testes e Validação]].

## Conceito do curso
Cybersecurity (Fase 3): hash PBKDF2 com salt

---
Ver também: [[Mapa do Código]] · [[Diagrama de Classes]] · [[Arquitetura]]
