---
tipo: classe
camada: service
arquivo: codigo/src/main/java/br/com/cuidaquemcuida/service/ZaritService.java
tags: [classe, service]
---

# ZaritService

**Classe** da camada **Serviços e regras de negócio** · `codigo/src/main/java/br/com/cuidaquemcuida/service/ZaritService.java`

## Para que serve
Bem-estar do cuidador: Escala Zarit (privada) e pedido de ajuda à rede.

Faz parte do [[Módulo Bem-estar]].

## Métodos
| Método | O que faz |
|---|---|
| `responder(long eu, ZaritEntrada dados) → estático ZaritCriada` |  |
| `minhas(long eu) → estático MinhasZarit` |  |
| `apagar(long eu, long avaliacaoId) → estático void` |  |
| `pedirAjuda(long eu, long avaliacaoId, List<Long> pacienteIds) → estático PedirAjudaSaida` | Avisa os membros das redes escolhidas, sem mostrar a pontuação. |

## Usa
[[AlertaDao]], [[AlertaPedidoAjuda]], [[ApiException]], [[AuditoriaDao]], [[Autorizacao]], [[AvaliacaoZarit]], [[Cuidador]], [[Dtos]], [[FaixaZarit]], [[Limites]], [[MembroRede]], [[MembroRedeDao]], [[PessoaDao]], [[Sql]], [[ZaritCalculadora]], [[ZaritDao]]

## É usada por
[[ZaritResource]]

---
Ver também: [[Mapa do Código]] · [[Diagrama de Classes]] · [[Arquitetura]]
