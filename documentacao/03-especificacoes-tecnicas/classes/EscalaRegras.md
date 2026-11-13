---
tipo: classe
camada: service
arquivo: codigo/src/main/java/br/com/cuidaquemcuida/service/EscalaRegras.java
tags: [classe, service]
---

# EscalaRegras

**Classe** da camada **Serviços e regras de negócio** · `codigo/src/main/java/br/com/cuidaquemcuida/service/EscalaRegras.java`

## Para que serve
Regras da escala de revezamento: conflitos, folga, sobrecarga, períodos vagos e sugestão de cobertura.

Faz parte do [[Módulo Escala]].

## Tipos internos
`record Conflito`, `record Bloco`, `record Intervalo`, `enum NivelSobrecarga`

## Métodos
| Método | O que faz |
|---|---|
| `Conflito(Turno a, Turno b) → record` | Dois turnos da mesma pessoa ao mesmo tempo. |
| `Bloco(LocalDateTime inicio, LocalDateTime fim, long minutosTrabalhados) → record` | Sequência de turnos sem 11 h de folga entre eles. |
| `Intervalo(LocalDateTime inicio, LocalDateTime fim) → record` | Intervalo de tempo (usado para os períodos sem ninguém). |
| `conflitos(List<Turno> turnos) → estático List<Conflito>` → [[conflitos]] | Conflitos entre os turnos (de uma mesma pessoa). Ordena pelo início e varre a lista guardando só os turnos ainda "abertos" numa fila pelo fim: O(n log n + k), com k = número de conflitos. A versão `#conflitosIngenuo` compara todos contra todos, O(n²) (Fase 6: eficiência). |
| `conflitosIngenuo(List<Turno> turnos) → estático List<Conflito>` → [[conflitosIngenuo]] | Versão ingênua (todos contra todos), mantida para comparação e testes. |
| `blocosSemFolga(List<Turno> turnos) → estático List<Bloco>` → [[blocosSemFolga]] | Junta turnos encostados ou com menos de 11 h de intervalo. Cada bloco soma as horas trabalhadas. |
| `horasNaJanela(List<Turno> turnos, LocalDateTime fim, int dias) → estático double` → [[horasNaJanela]] | Horas de turno dentro da janela [fim - dias, fim), recortando o que passa das bordas. |
| `horasSeguidas(List<Turno> turnos, LocalDateTime agora) → estático double` | Maior bloco sem folga que terminou dentro dos últimos 7 dias (ou ainda está em andamento). |
| `nivel(double horas7d, double horasSeguidas) → estático NivelSobrecarga` → [[nivel de sobrecarga]] |  |
| `periodosDescobertos(List<Turno> doPaciente, LocalDateTime de, LocalDateTime ate) → estático List<Intervalo>` → [[periodosDescobertos]] | Intervalos dentro de [de, ate) sem nenhum turno com pessoa. Turno vago não conta como coberto. |
| `sugerirCobertura(Turno vago, Map<Long, List<Turno>> turnosPorPessoa, LocalDateTime agora) → estático List<Long>` → [[sugerirCobertura]] | Quem pode cobrir um turno vago: membros sem conflito no horário, do menos para o mais carregado (horas nos últimos 7 dias). No empate, pelo id. |

## Usa
[[Limites]], [[Turno]]

## É usada por
[[AlertaService]], [[Dtos]], [[EscalaService]]

## Testes
`EscalaRegrasTest` (JUnit 5) em `codigo/src/test/java/`. Ver [[Testes e Validação]].

## Conceito do curso
Eficiência e ordenação (Fase 6: "Matematizando a eficiência"): conflitos em O(n log n) com fila de prioridade

---
Ver também: [[Mapa do Código]] · [[Diagrama de Classes]] · [[Arquitetura]]
