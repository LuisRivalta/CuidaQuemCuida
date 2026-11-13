---
tipo: classe
camada: service
arquivo: codigo/src/main/java/br/com/cuidaquemcuida/service/ZaritCalculadora.java
tags: [classe, service]
---

# ZaritCalculadora

**Classe** da camada **Serviços e regras de negócio** · `codigo/src/main/java/br/com/cuidaquemcuida/service/ZaritCalculadora.java`

## Para que serve
Pontuação e faixa da Escala Zarit, versão de 12 itens (ZBI-12).

Faz parte do [[Módulo Bem-estar]].

## Métodos
| Método | O que faz |
|---|---|
| `pontuar(int[] respostas) → estático int` → [[pontuar Zarit]] | Soma das 12 respostas (cada uma de 0 = nunca a 4 = sempre). Total de 0 a 48. |
| `faixa(int pontuacao) → estático FaixaZarit` | BAIXA até 10, MODERADA de 11 a 20, ALTA acima de 20 (formulário ZBI-12). |

## Usa
[[FaixaZarit]], [[Limites]]

## É usada por
[[ZaritService]]

## Testes
`ZaritCalculadoraTest` (JUnit 5) em `codigo/src/test/java/`. Ver [[Testes e Validação]].

## Conceito do curso
Validação de entrada e regra de pontuação

---
Ver também: [[Mapa do Código]] · [[Diagrama de Classes]] · [[Arquitetura]]
