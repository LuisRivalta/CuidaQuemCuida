---
tipo: classe
camada: service
arquivo: codigo/src/main/java/br/com/cuidaquemcuida/service/EscalaService.java
tags: [classe, service]
---

# EscalaService

**Classe** da camada **Serviços e regras de negócio** · `codigo/src/main/java/br/com/cuidaquemcuida/service/EscalaService.java`

## Para que serve
Escala de revezamento: listar, criar, editar e assumir turnos, análise de conflitos, vagos e sobrecarga.

Faz parte do [[Módulo Escala]].

## Tipos internos
`record Carga`

## Métodos
| Método | O que faz |
|---|---|
| `Carga(double horas7d, double horasSeguidas, EscalaRegras.NivelSobrecarga nivel) → record` | Carga de uma pessoa: horas nos últimos 7 dias, maior sequência sem folga e o nível de sobrecarga. |
| `carga(long pessoaId, LocalDateTime agora) → estático Carga` |  |
| `dto(Turno t, Map<Long, String> nomes) → estático TurnoDto` |  |
| `listar(long eu, long pacienteId, LocalDate de, LocalDate ate) → estático List<TurnoDto>` |  |
| `criar(long eu, long pacienteId, TurnoEntrada dados) → estático TurnoDto` |  |
| `atualizar(long eu, long turnoId, TurnoEntrada dados) → estático TurnoDto` |  |
| `apagar(long eu, long turnoId) → estático void` |  |
| `assumir(long eu, long turnoId) → estático TurnoDto` |  |
| `sugestoes(long eu, long turnoId) → estático List<SugestaoDto>` |  |
| `analise(long eu, long pacienteId, LocalDate deData, LocalDate ateData) → estático AnaliseDto` |  |
| `exigirSemConflito(Turno candidato, Long ignorarId) → estático void` | Recusa com 409 (e a lista de conflitos) se a pessoa do turno já tem outro turno no mesmo horário, em qualquer rede. |
| `umaCasa(double valor) → estático double` |  |

## Usa
[[ApiException]], [[AuditoriaDao]], [[Autorizacao]], [[Cuidador]], [[Dtos]], [[EscalaRegras]], [[Limites]], [[MembroRede]], [[MembroRedeDao]], [[Paciente]], [[Papel]], [[PessoaDao]], [[RedeService]], [[StatusTurno]], [[Turno]], [[TurnoDao]]

## É usada por
[[AlertaService]], [[EstatisticaService]], [[PacienteResource]], [[RedeService]], [[TurnoResource]]

---
Ver também: [[Mapa do Código]] · [[Diagrama de Classes]] · [[Arquitetura]]
