---
tipo: modulo
tags: [modulo, hoje, alertas]
---

# Módulo Hoje e Alertas

**Para que serve:** a tela que abre primeiro. Responde "o que eu preciso fazer agora?" com a linha do tempo do turno, e mostra os **alertas** no topo de todas as telas. Caso de uso: UC10 ([[Casos de Uso]]).

| Camada | Onde |
|---|---|
| Telas | `web/js/telas/hoje.js`; barra de alertas em `web/js/rotas.js` |
| Rotas | `GET /api/hoje?pacienteId`, `GET /api/alertas?pacienteId`, `PUT /api/alertas/{id}/lido` |
| Recursos | [[HojeResource]], [[AlertaResource]] |
| Serviços | [[HojeService]], [[AlertaService]] |
| Acesso a dados | [[AlertaDao]] (e os DAOs dos outros módulos) |
| Modelo | [[Alerta]] e as subclasses: [[AlertaMedicacao]], [[AlertaSinalVital]], [[AlertaTurnoVago]], [[AlertaConflito]], [[AlertaSobrecarga]], [[AlertaPedidoAjuda]], [[AlertaTarefa]]; [[TipoAlerta]] |
| Tabela | `alerta` (`UNIQUE (tipo, referencia, destinatario_id)`) |

## Regras
- **Com turno em andamento:** o que cai dentro do turno. **Sem turno:** as pendências do dia e o próximo turno.
- Qualquer membro registra a qualquer hora.
- **Alertas calculados quando a tela abre** (sem rotina em segundo plano) e gravados com chave única: reabrir não repete o aviso, e o "lido" funciona.
- **Quem recebe** (tabela da seção 4.2 do [[Design da Solução]]):

| Alerta | Quem recebe |
|---|---|
| Dose próxima, atrasada ou não dada; tarefa atrasada | Quem está de turno e o coordenador |
| Sinal fora da faixa ou da curva | Quem está de turno e o coordenador |
| Turno vago | Todos da rede |
| Conflito de turno | A pessoa e o coordenador |
| Sobrecarga | A própria pessoa e o coordenador |
| Pedido de ajuda | Todos da rede (menos quem pediu) |

- **Polimorfismo:** o serviço monta uma lista de `Alerta` e grava todos chamando `mensagem()`, sem saber o tipo.
