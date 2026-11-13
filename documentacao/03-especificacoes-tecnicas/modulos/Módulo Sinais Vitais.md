---
tipo: modulo
tags: [modulo, sinais-vitais]
---

# Módulo Sinais Vitais

**Para que serve:** registrar pressão, glicemia, temperatura, saturação e batimentos; avisar a rede quando um valor está **fora da faixa** combinada ou **fora do padrão** do próprio paciente; mostrar o gráfico dos últimos 30 dias. Casos de uso: UC06 e UC12 ([[Casos de Uso]]).

| Camada | Onde |
|---|---|
| Telas | `web/js/telas/mais.js` (Sinais vitais: registrar, gráfico com a faixa, tabela), `hoje.js` (tarefa "Medir pressão" → Registrar) |
| Rotas | `GET/POST /api/pacientes/{id}/sinais`, `GET/PUT /api/pacientes/{id}/faixas` |
| Recurso | [[PacienteResource]] |
| Serviço | [[SinalVitalService]] |
| Regras | [[SinalVitalRegras]] (`foraDaFaixa`, [[foraDaCurva]]) e [[Estatistica]] ([[zScore]]) |
| Acesso a dados | [[SinalVitalDao]] |
| Modelo | [[SinalVital]], [[FaixaSinal]], [[TipoSinal]], [[AlertaSinalVital]] |
| Tabelas | `sinal_vital`, `faixa_sinal` |

## Regras
- **Fora da faixa:** abaixo do mínimo ou acima do máximo configurado para o paciente. Tem prioridade.
- **Fora da curva:** |z| > 2 em relação às medições anteriores do mesmo tipo, com pelo menos 7 delas (Fase 5).
- O alerta vai para **quem está de turno** e os **coordenadores**, com prioridade 90.
- Valor zero ou negativo é recusado (pelo modelo e por um `CHECK` no banco).

Testes: `SinalVitalRegrasTest` (4).
