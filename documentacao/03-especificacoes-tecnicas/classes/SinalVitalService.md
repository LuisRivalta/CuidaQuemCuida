---
tipo: classe
camada: service
arquivo: codigo/src/main/java/br/com/cuidaquemcuida/service/SinalVitalService.java
tags: [classe, service]
---

# SinalVitalService

**Classe** da camada **Serviços e regras de negócio** · `codigo/src/main/java/br/com/cuidaquemcuida/service/SinalVitalService.java`

## Para que serve
Sinais vitais: registro com alerta (fora da faixa ou fora da curva) e faixas por paciente.

Faz parte do [[Módulo Sinais Vitais]].

## Métodos
| Método | O que faz |
|---|---|
| `listar(long eu, long pacienteId, TipoSinal tipo, LocalDate de, LocalDate ate) → estático List<SinalDto>` |  |
| `registrar(long eu, long pacienteId, SinalEntrada dados) → estático SinalDto` |  |
| `faixas(long eu, long pacienteId) → estático List<FaixaDto>` |  |
| `salvarFaixas(long eu, long pacienteId, List<FaixaDto> faixas) → estático List<FaixaDto>` |  |

## Usa
[[AlertaDao]], [[AlertaService]], [[AlertaSinalVital]], [[ApiException]], [[AuditoriaDao]], [[Autorizacao]], [[Dtos]], [[FaixaSinal]], [[Paciente]], [[PessoaDao]], [[RedeService]], [[SinalVital]], [[SinalVitalDao]], [[SinalVitalRegras]], [[Sql]], [[TipoAlerta]], [[TipoSinal]]

## É usada por
[[PacienteResource]]

---
Ver também: [[Mapa do Código]] · [[Diagrama de Classes]] · [[Arquitetura]]
