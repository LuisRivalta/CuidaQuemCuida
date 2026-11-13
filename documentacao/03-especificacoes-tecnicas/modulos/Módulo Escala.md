---
tipo: modulo
tags: [modulo, escala]
---

# Módulo Escala

**Para que serve:** dividir o cuidado em turnos entre família e vizinhos, impedir dois turnos da mesma pessoa ao mesmo tempo, mostrar períodos sem ninguém, medir a sobrecarga e sugerir quem pode ajudar. Casos de uso: UC03 e UC14 ([[Casos de Uso]]). Fluxo: [[Fluxo - Montar a Escala]].

| Camada | Onde |
|---|---|
| Telas | `web/js/telas/escala.js`; o cartão de turno vago fica em `hoje.js` |
| Rotas | `GET/POST /api/pacientes/{id}/turnos`, `GET /api/pacientes/{id}/escala/analise`, `PUT/DELETE /api/turnos/{id}`, `POST /api/turnos/{id}/assumir`, `GET /api/turnos/{id}/sugestoes` |
| Recursos | [[PacienteResource]], [[TurnoResource]] |
| Serviço | [[EscalaService]] |
| Regras puras | [[EscalaRegras]]: [[conflitos]], [[conflitosIngenuo]], [[blocosSemFolga]], [[horasNaJanela]], [[nivel de sobrecarga]], [[periodosDescobertos]], [[sugerirCobertura]] |
| Acesso a dados | [[TurnoDao]] |
| Modelo | [[Turno]], [[StatusTurno]] |
| Tabela | `turno` (`pessoa_id` nulo = vago; `CHECK (fim > inicio)`) |

## Regras principais
| Regra | Valor |
|---|---|
| Conflito | Turnos da mesma pessoa que se sobrepõem, em **qualquer** rede → 409 com a lista |
| Turno noturno | Pelo menos 3 h entre 22h e 6h |
| Folga | ≥ 11 h sem turno |
| Sobrecarga | Atenção: > 44 h/7 dias ou > 24 h seguidas · Alerta: > 60 h ou > 36 h |
| Quem cria turno | Coordenador: para qualquer membro ou vago · Membro: só para si mesmo |

Testes: `EscalaRegrasTest` (10), `TurnoTest` (6), `PeriodoTest` (1).
