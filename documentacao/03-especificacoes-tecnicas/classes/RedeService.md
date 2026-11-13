---
tipo: classe
camada: service
arquivo: codigo/src/main/java/br/com/cuidaquemcuida/service/RedeService.java
tags: [classe, service]
---

# RedeService

**Classe** da camada **Serviços e regras de negócio** · `codigo/src/main/java/br/com/cuidaquemcuida/service/RedeService.java`

## Para que serve
Pacientes e redes de cuidado: cadastro, convite por código, membros e papéis.

Faz parte do [[Módulo Cadastros e Rede]].

## Métodos
| Método | O que faz |
|---|---|
| `minhasRedes(long eu) → estático List<PacienteResumo>` |  |
| `criar(long eu, PacienteEntrada dados) → estático PacienteCriado` |  |
| `buscar(long eu, long pacienteId) → estático PacienteDto` |  |
| `atualizar(long eu, long pacienteId, PacienteEntrada dados) → estático PacienteDto` |  |
| `apagar(long eu, long pacienteId) → estático void` |  |
| `entrar(long eu, String codigo, Vinculo vinculo) → estático EntrarSaida` |  |
| `renovarConvite(long eu, long pacienteId) → estático ConviteSaida` |  |
| `membros(long eu, long pacienteId) → estático List<MembroDto>` |  |
| `mudarPapel(long eu, long pacienteId, long pessoaId, Papel papel) → estático void` |  |
| `remover(long eu, long pacienteId, long pessoaId) → estático void` |  |
| `compartilharZarit(long eu, long pacienteId, boolean compartilha) → estático boolean` |  |
| `paciente(long pacienteId) → estático Paciente` |  |

## Usa
[[ApiException]], [[AuditoriaDao]], [[Autorizacao]], [[ConsentimentoDao]], [[Dtos]], [[EscalaService]], [[MembroRede]], [[MembroRedeDao]], [[Paciente]], [[PacienteDao]], [[Papel]], [[Pessoa]], [[PessoaDao]], [[Sql]], [[Vinculo]]

## É usada por
[[AlertaService]], [[EscalaService]], [[HojeService]], [[PacienteResource]], [[SinalVitalService]]

---
Ver também: [[Mapa do Código]] · [[Diagrama de Classes]] · [[Arquitetura]]
