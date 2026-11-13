---
tipo: classe
camada: model
arquivo: codigo/src/main/java/br/com/cuidaquemcuida/model/alerta/AlertaPedidoAjuda.java
tags: [classe, model]
---

# AlertaPedidoAjuda

**Classe** da camada **Modelo do domínio (alertas)** · `codigo/src/main/java/br/com/cuidaquemcuida/model/alerta/AlertaPedidoAjuda.java`

## Para que serve
Pedido de ajuda à rede, feito pela própria pessoa depois de uma Zarit com sobrecarga alta. Não mostra a pontuação.

Faz parte do [[Módulo Hoje e Alertas]].

Declaração: `class AlertaPedidoAjuda extends Alerta`

## Campos principais
| Campo | Tipo |
|---|---|
| `nomePessoa` | `String` |

## Métodos
| Método | O que faz |
|---|---|
| `AlertaPedidoAjuda(long pacienteId, long destinatarioId, long avaliacaoId, String nomePessoa)` |  |
| `mensagem() → String` |  |

## Usa
[[Alerta]], [[TipoAlerta]]

## É usada por
[[ZaritService]]

---
Ver também: [[Mapa do Código]] · [[Diagrama de Classes]] · [[Arquitetura]]
