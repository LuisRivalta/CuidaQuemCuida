---
tipo: classe
camada: service
arquivo: codigo/src/main/java/br/com/cuidaquemcuida/service/EstatisticaService.java
tags: [classe, service]
---

# EstatisticaService

**Classe** da camada **Serviços e regras de negócio** · `codigo/src/main/java/br/com/cuidaquemcuida/service/EstatisticaService.java`

## Para que serve
Painel estatístico do coordenador. Parte vem pronta do SQL (agrupamentos, junções, subconsulta) e parte é calculada no Java (média móvel, desvio padrão, chance condicional, correlação de Pearson).

Faz parte do [[Módulo Painel Estatístico]].

## Métodos
| Método | O que faz |
|---|---|
| `paraJson(double valor) → estático Double` | JSON não aceita NaN: valor indefinido sai como null. Arredonda em 3 casas. |
| `horarioNoturno(int hora) → estático boolean` | Horário noturno para a chance de atraso: das 22h às 5h59. |
| `calcular(long eu, long pacienteId, int dias) → estático EstatisticasDto` |  |

## Usa
[[Autorizacao]], [[AvaliacaoZarit]], [[Dtos]], [[EscalaService]], [[Estatistica]], [[EstatisticaDao]], [[Limites]], [[MembroRede]], [[MembroRedeDao]], [[Periodo]], [[PessoaDao]], [[StatusDose]], [[Turno]], [[TurnoDao]], [[ZaritDao]]

## É usada por
[[PacienteResource]]

## Testes
`EstatisticaServiceTest` (JUnit 5) em `codigo/src/test/java/`. Ver [[Testes e Validação]].

## Conceito do curso
Probabilidade condicional (Fase 2: "Qual é a chance de...?") e interpretação estatística

---
Ver também: [[Mapa do Código]] · [[Diagrama de Classes]] · [[Arquitetura]]
