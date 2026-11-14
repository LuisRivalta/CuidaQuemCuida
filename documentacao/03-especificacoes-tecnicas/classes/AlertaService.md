---
tipo: classe
camada: service
arquivo: codigo/src/main/java/br/com/cuidaquemcuida/service/AlertaService.java
tags: [classe, service]
---

# AlertaService

**Classe** da camada **Serviços e regras de negócio** · `codigo/src/main/java/br/com/cuidaquemcuida/service/AlertaService.java`

## Para que serve
Alertas calculados na hora em que a tela abre (sem rotina rodando em segundo plano). Cada alerta é gravado com chave única (tipo, referência, destinatário), então reabrir a tela não repete o aviso e o "lido" funciona. Quem recebe cada tipo segue a tabela da seção 4.2 do design.

Faz parte do [[Módulo Hoje e Alertas]].

## Métodos
| Método | O que faz |
|---|---|
| `gerar(long eu, long pacienteId, LocalDateTime agora) → estático List<AlertaDto>` |  |
| `chaves(List<Alerta> alertas) → estático List<String>` | "TIPO/referencia" de cada alerta: a mesma chave única da tabela (sem o destinatário). |
| `marcarLido(long eu, long alertaId) → estático void` |  |
| `deTurnoECoordenadores(long pacienteId, LocalDateTime agora) → estático Set<Long>` | Destinatários de um alerta "do momento": quem está de turno agora e os coordenadores. |
| `pessoaNoTurno(List<Turno> turnos, LocalDateTime instante) → estático Long` |  |

## Usa
[[Alerta]], [[AlertaConflito]], [[AlertaDao]], [[AlertaMedicacao]], [[AlertaSobrecarga]], [[AlertaTarefa]], [[AlertaTurnoVago]], [[ApiException]], [[Autorizacao]], [[Dose]], [[Dtos]], [[EscalaRegras]], [[EscalaService]], [[ExecucaoTarefa]], [[Limites]], [[MedicacaoService]], [[Medicamento]], [[MembroRede]], [[MembroRedeDao]], [[Paciente]], [[PessoaDao]], [[RedeService]], [[StatusDose]], [[TarefaCuidado]], [[TarefaDao]], [[TarefaService]], [[TipoAlerta]], [[Turno]], [[TurnoDao]]

## É usada por
[[AlertaResource]], [[HojeService]], [[SinalVitalService]]

## Testes
`AlertaServiceTest` (JUnit 5) em `codigo/src/test/java/`. Ver [[Testes e Validação]].

---
Ver também: [[Mapa do Código]] · [[Diagrama de Classes]] · [[Arquitetura]]
