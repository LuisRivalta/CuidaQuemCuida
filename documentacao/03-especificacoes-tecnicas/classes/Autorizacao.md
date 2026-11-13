---
tipo: classe
camada: infra
arquivo: codigo/src/main/java/br/com/cuidaquemcuida/infra/Autorizacao.java
tags: [classe, infra]
---

# Autorizacao

**Classe** da camada **Infraestrutura** · `codigo/src/main/java/br/com/cuidaquemcuida/infra/Autorizacao.java`

## Para que serve
Quem pode ver e mexer em cada paciente: só quem faz parte da rede dele, e algumas ações só o coordenador. Trocar o id do paciente na URL não dá acesso a outra família.

## Métodos
| Método | O que faz |
|---|---|
| `papel(List<MembroRede> redes, long pacienteId) → estático Optional<Papel>` | Papel da pessoa na rede do paciente (vazio se não participa ou saiu da rede). |
| `exigirMembro(long pessoaId, long pacienteId) → estático Papel` |  |
| `exigirCoordenador(long pessoaId, long pacienteId) → estático void` |  |

## Usa
[[ApiException]], [[MembroRede]], [[MembroRedeDao]], [[Papel]]

## É usada por
[[AlertaService]], [[EscalaService]], [[EstatisticaService]], [[HojeService]], [[MedicacaoService]], [[RedeService]], [[SinalVitalService]], [[TarefaService]], [[ZaritService]]

## Testes
`AutorizacaoTest` (JUnit 5) em `codigo/src/test/java/`. Ver [[Testes e Validação]].

## Conceito do curso
Segurança: cada pessoa só acessa a rede de que faz parte (LGPD, Fase 5)

---
Ver também: [[Mapa do Código]] · [[Diagrama de Classes]] · [[Arquitetura]]
