---
tipo: modulo
tags: [modulo, cuidado, tarefas]
---

# Módulo Protocolo de Cuidado

**Para que serve:** dar **orientação técnica básica** a quem cuida. São tarefas recorrentes com "como fazer", como **mudar de posição a cada 2 h para evitar escara**, oferecer água e fazer a higiene, e medições do dia, como "Medir pressão". Aparecem na tela Hoje de quem estiver no turno, **inclusive de madrugada**. Casos de uso: UC05 e UC13 ([[Casos de Uso]]).

| Camada | Onde |
|---|---|
| Telas | `web/js/telas/hoje.js` (Feito, Registrar, "Como fazer"), `mais.js` (Tarefas de cuidado) |
| Rotas | `GET/POST /api/pacientes/{id}/tarefas`, `PUT/DELETE /api/tarefas/{id}`, `GET /api/pacientes/{id}/execucoes`, `PUT /api/execucoes/{id}/feita` |
| Recursos | [[PacienteResource]], [[TarefaResource]], [[ExecucaoResource]] |
| Serviço | [[TarefaService]] |
| Acesso a dados | [[TarefaDao]] |
| Modelo | [[TarefaCuidado]] (`horariosDoDia`), [[ExecucaoTarefa]] |
| Tabelas | `tarefa_cuidado` (`tipo_sinal` preenchido = medição), `execucao_tarefa` (`UNIQUE (tarefa_id, prevista_para)`) |

## Regras
- **Horários do dia:** primeira vez + k × repetição, dando a volta no relógio. "A cada 2 h a partir das 6h" vira 0h, 2h, 4h ... 22h, porque o turno da noite também muda a pessoa de posição.
- Tarefa com **tipo de sinal** é uma medição: o botão vira "Registrar", e a execução é marcada ao salvar a medição.
- Só a primeira pessoa marca "Feito" (`UPDATE ... WHERE feita_em IS NULL`).
- Tarefa atrasada (de 30 min a 2 h) gera alerta para quem está de turno e o coordenador.

Testes: `TarefaCuidadoTest` (2).
