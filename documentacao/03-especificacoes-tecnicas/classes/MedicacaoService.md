---
tipo: classe
camada: service
arquivo: codigo/src/main/java/br/com/cuidaquemcuida/service/MedicacaoService.java
tags: [classe, service]
---

# MedicacaoService

**Classe** da camada **Serviços e regras de negócio** · `codigo/src/main/java/br/com/cuidaquemcuida/service/MedicacaoService.java`

## Para que serve
Remédios, regras de horário e registro das doses.

Faz parte do [[Módulo Medicação]].

## Métodos
| Método | O que faz |
|---|---|
| `dto(Medicamento m) → estático MedicamentoDto` |  |
| `listar(long eu, long pacienteId) → estático List<MedicamentoDto>` |  |
| `criar(long eu, long pacienteId, MedicamentoDto dados) → estático MedicamentoDto` |  |
| `atualizar(long eu, long medicamentoId, MedicamentoDto dados) → estático MedicamentoDto` |  |
| `apagar(long eu, long medicamentoId) → estático void` |  |
| `garantirDoses(long pacienteId, LocalDate dia) → estático void` → [[garantirDoses]] | Cria as doses previstas do dia que ainda não existem (pode ser chamado várias vezes: não duplica). |
| `dosesDoDia(long pacienteId, LocalDate dia, LocalDateTime agora) → estático List<Dose>` | Doses do dia, com o status atualizado (sem registro depois de 2 h vira "não dada"). |
| `doses(long eu, long pacienteId, LocalDate dia) → estático List<DoseDto>` |  |
| `dar(long eu, long doseId, String observacao) → estático DoseDto` |  |
| `naoDar(long eu, long doseId, String motivo) → estático DoseDto` |  |
| `dto(Dose d, Map<Long, Medicamento> remedios, Map<Long, String> nomes) → estático DoseDto` |  |
| `remediosPorId(long pacienteId) → estático Map<Long, Medicamento>` |  |

## Usa
[[ApiException]], [[AuditoriaDao]], [[Autorizacao]], [[Dose]], [[DoseDao]], [[DoseRegras]], [[Dtos]], [[Medicamento]], [[MedicamentoDao]], [[PessoaDao]], [[RegraHorario]], [[Sql]], [[StatusDose]]

## É usada por
[[AlertaService]], [[DoseResource]], [[HojeService]], [[MedicamentoResource]], [[PacienteResource]]

---
Ver também: [[Mapa do Código]] · [[Diagrama de Classes]] · [[Arquitetura]]
