---
tipo: classe abstrata
camada: model
arquivo: codigo/src/main/java/br/com/cuidaquemcuida/model/RegraHorario.java
tags: [classe, model]
---

# RegraHorario

**Classe abstrata** da camada **Modelo do domínio** · `codigo/src/main/java/br/com/cuidaquemcuida/model/RegraHorario.java`

## Para que serve
Regra que diz quando um remédio deve ser dado. Cada tipo de regra é uma subclasse que gera os horários do seu jeito (polimorfismo, Fase 3): `RegraIntervalo`, `RegraHorariosFixos` e `RegraDiasAlternados`.

Faz parte do [[Módulo Medicação]].

## Campos principais
| Campo | Tipo |
|---|---|
| `inicio` | `LocalDate` |
| `fim` | `LocalDate` |

## Métodos
| Método | O que faz |
|---|---|
| `RegraHorario(LocalDate inicio, LocalDate fim)` |  |
| `criar(TipoRegra tipo, Integer intervaloHoras, LocalTime primeiraDose, List<LocalTime> horarios, LocalDate inicio, LocalDate fim) → estático RegraHorario` | Monta a subclasse certa a partir do tipo (usado ao ler do banco e ao receber da tela). |
| `vigente(LocalDate dia) → boolean` | O dia está dentro do período da regra? |
| `limiteFinal() → LocalDateTime` | Primeiro instante depois do fim da regra (ou null se não tem fim). |
| `horariosEntre(LocalDateTime de, LocalDateTime ate) → List<LocalDateTime> (abstrato)` → [[horariosEntre]] | Horários previstos dentro de [de, ate), em ordem e sem repetição, respeitando o início e o fim da regra. Chamar duas vezes com o mesmo período devolve a mesma lista (por isso as doses não duplicam). |
| `tipo() → TipoRegra (abstrato)` |  |

## Usa
[[RegraDiasAlternados]], [[RegraHorariosFixos]], [[RegraIntervalo]], [[TipoRegra]]

## É usada por
[[MedicacaoService]], [[Medicamento]], [[MedicamentoDao]], [[RegraHorariosFixos]], [[RegraIntervalo]]

## Testes
`RegraHorarioTest` (JUnit 5) em `codigo/src/test/java/`. Ver [[Testes e Validação]].

## Conceito do curso
Classe abstrata com método polimórfico horariosEntre() e método de fábrica criar() (Fase 3)

---
Ver também: [[Mapa do Código]] · [[Diagrama de Classes]] · [[Arquitetura]]
