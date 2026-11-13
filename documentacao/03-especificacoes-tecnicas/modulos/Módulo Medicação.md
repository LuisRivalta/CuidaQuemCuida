---
tipo: modulo
tags: [modulo, medicacao]
---

# Módulo Medicação

**Para que serve:** cadastrar os remédios com **horários complexos** (de 8 em 8 horas, horários fixos, dia sim, dia não), gerar as doses previstas sozinho e registrar quem deu cada uma e quando. Casos de uso: UC04 e UC11 ([[Casos de Uso]]). Fluxo: [[Fluxo - Dar o Remédio]].

| Camada | Onde |
|---|---|
| Telas | `web/js/telas/hoje.js` (Dei o remédio / Não foi dado), `mais.js` (Paciente e remédios) |
| Rotas | `GET/POST /api/pacientes/{id}/medicamentos`, `PUT/DELETE /api/medicamentos/{id}`, `GET /api/pacientes/{id}/doses`, `PUT /api/doses/{id}/dar`, `PUT /api/doses/{id}/nao-dar` |
| Recursos | [[PacienteResource]], [[MedicamentoResource]], [[DoseResource]] |
| Serviço | [[MedicacaoService]] ([[garantirDoses]]) |
| Regras | [[RegraHorario]] e subclasses ([[horariosEntre]]), [[DoseRegras]] ([[status da dose]]) |
| Acesso a dados | [[MedicamentoDao]], [[DoseDao]] ([[registrar dose]]) |
| Modelo | [[Medicamento]], [[RegraHorario]], [[RegraIntervalo]], [[RegraHorariosFixos]], [[RegraDiasAlternados]], [[Dose]], [[StatusDose]], [[TipoRegra]] |
| Tabelas | `medicamento`, `regra_horario` (1:1), `dose` (`UNIQUE (medicamento_id, previsto_para)`) |

## Destaques técnicos
- **Polimorfismo:** o serviço chama `remedio.horariosEntre(...)` sem saber o tipo da regra.
- **Sem duplicar:** gerar as doses várias vezes não cria repetidas (`ON CONFLICT DO NOTHING`).
- **Duas pessoas ao mesmo tempo:** `UPDATE ... WHERE status = 'PENDENTE'` deixa só a primeira gravar.
- **Mudou a regra:** as doses futuras pendentes são apagadas e refeitas pela regra nova.

Testes: `RegraHorarioTest` (7), `DoseRegrasTest` (5).
