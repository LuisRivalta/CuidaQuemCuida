---
tipo: classe
camada: model
arquivo: codigo/src/main/java/br/com/cuidaquemcuida/model/Turno.java
tags: [classe, model]
---

# Turno

**Classe** da camada **Modelo do domínio** · `codigo/src/main/java/br/com/cuidaquemcuida/model/Turno.java`

## Para que serve
Um período da escala de revezamento. `pessoaId` nulo = turno vago. Início e fim guardam data E hora, então um turno das 22h às 6h termina no dia seguinte.

Faz parte do [[Módulo Escala]].

## Campos principais
| Campo | Tipo |
|---|---|
| `id` | `Long` |
| `pacienteId` | `long` |
| `pessoaId` | `Long` |
| `inicio` | `LocalDateTime` |
| `fim` | `LocalDateTime` |
| `status` | `StatusTurno` |

## Métodos
| Método | O que faz |
|---|---|
| `Turno(Long id, long pacienteId, Long pessoaId, LocalDateTime inicio, LocalDateTime fim, StatusTurno status)` |  |
| `minutos() → long` |  |
| `sobrepoe(Turno outro) → boolean` | Dois turnos se sobrepõem se um começa antes do outro terminar. Turnos encostados (14h-14h) não se sobrepõem. |
| `noturno() → boolean` |  |
| `vago() → boolean` |  |
| `cancelado() → boolean` |  |

## Usa
[[StatusTurno]]

## É usada por
[[AlertaConflito]], [[AlertaService]], [[EscalaRegras]], [[EscalaService]], [[EstatisticaService]], [[HojeService]], [[TurnoDao]]

## Testes
`TurnoTest` (JUnit 5) em `codigo/src/test/java/`. Ver [[Testes e Validação]].

## Conceito do curso
Encapsulamento (construtor recusa fim antes do início) e regras do próprio objeto (Fase 2: "Programando com métodos")

---
Ver também: [[Mapa do Código]] · [[Diagrama de Classes]] · [[Arquitetura]]
