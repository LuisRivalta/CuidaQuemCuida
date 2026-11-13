---
tipo: classe
camada: service
arquivo: codigo/src/main/java/br/com/cuidaquemcuida/service/HojeService.java
tags: [classe, service]
---

# HojeService

**Classe** da camada **Serviços e regras de negócio** · `codigo/src/main/java/br/com/cuidaquemcuida/service/HojeService.java`

## Para que serve
Tela "Hoje": com turno em andamento, o que cai dentro do turno; sem turno, as pendências do dia e o próximo turno. Qualquer membro pode registrar a qualquer hora (o remédio às vezes sai 10 minutos depois do fim do turno).

Faz parte do [[Módulo Hoje e Alertas]].

## Métodos
| Método | O que faz |
|---|---|
| `hoje(long eu, Long pacienteIdPedido) → estático HojeDto` |  |

## Usa
[[AlertaService]], [[ApiException]], [[Autorizacao]], [[Dose]], [[Dtos]], [[ExecucaoTarefa]], [[MedicacaoService]], [[Medicamento]], [[Paciente]], [[PessoaDao]], [[RedeService]], [[StatusDose]], [[TarefaCuidado]], [[TarefaDao]], [[TarefaService]], [[Turno]], [[TurnoDao]]

## É usada por
[[HojeResource]]

---
Ver também: [[Mapa do Código]] · [[Diagrama de Classes]] · [[Arquitetura]]
