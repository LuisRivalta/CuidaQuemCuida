---
titulo: Regras de Negócio
tags: [especificacao, regras]
---

# Regras de Negócio

Todas as regras do sistema num só lugar, com o valor usado, a origem e onde estão no código. Os limites numéricos ficam na classe [[Limites]] para ajuste fácil. Ver [[Design da Solução]] (seção 5) e [[Mapa do Código]].

## Escala de revezamento ([[Módulo Escala]])
| Regra | Valor | Origem | Código |
|---|---|---|---|
| Conflito de turno | Dois turnos da mesma pessoa que se sobrepõem (um começa antes do outro terminar), em qualquer rede. Encostados (14h–14h) não conflitam | — | [[conflitos]] |
| Turno que atravessa a meia-noite | Início e fim com data e hora completas; na tela, fim menor que o início vai para o dia seguinte | — | [[Turno]] |
| Turno noturno | Pelo menos **3 h** entre 22h e 6h | Decisão da equipe | `Turno.noturno()` |
| Folga | Pelo menos **11 h** sem turno | CLT, art. 66 (descanso entre jornadas) | [[blocosSemFolga]] |
| Horas seguidas sem folga | Soma dos turnos de um bloco sem folga; vale o maior bloco dos últimos 7 dias | — | `EscalaRegras.horasSeguidas` |
| Atenção (sobrecarga) | **> 44 h** em 7 dias ou **> 24 h** seguidas | 44 h: jornada semanal da CLT | [[nivel de sobrecarga]] |
| Alerta (sobrecarga) | **> 60 h** em 7 dias ou **> 36 h** seguidas | Decisão da equipe | [[nivel de sobrecarga]] |
| Período descoberto | Paciente "24 h": qualquer intervalo sem turno com pessoa (vago não cobre) | — | [[periodosDescobertos]] |
| Sugestão de cobertura | Membros sem conflito, do menos carregado (horas em 7 dias) para o mais | — | [[sugerirCobertura]] |
| Quem cria turno | Coordenador: qualquer membro ou vago · Membro: só para si mesmo | Decisão da equipe | [[EscalaService]] |

## Medicação ([[Módulo Medicação]])
| Regra | Valor | Código |
|---|---|---|
| Tipos de horário | De N em N horas (1 a 24) a partir de uma hora · horários fixos · dia sim, dia não | [[horariosEntre]] |
| Dose no horário | Registrada até **30 min** depois do previsto | [[status da dose]] |
| Dose atrasada | Registrada **mais de 30 min** depois | [[status da dose]] |
| Dose não dada | Marcada com motivo, ou **sem registro 2 h** depois | [[status da dose]] |
| Sem duplicar doses | `UNIQUE (medicamento_id, previsto_para)` + `ON CONFLICT DO NOTHING` | [[garantirDoses]] |
| Registro único | Só a primeira pessoa grava (`WHERE status = 'PENDENTE'`); a segunda recebe 409 com o nome | [[registrar dose]] |
| Mudança de regra | As doses futuras pendentes são refeitas pela regra nova | [[MedicacaoService]] |

## Sinais vitais ([[Módulo Sinais Vitais]])
| Regra | Valor | Código |
|---|---|---|
| Fora da faixa | Abaixo do mínimo ou acima do máximo configurado (tem prioridade) | `SinalVitalRegras.foraDaFaixa` |
| Fora da curva | \|z\| > **2**, com pelo menos **7** medições anteriores do mesmo tipo | [[foraDaCurva]] |
| Valor | Maior que zero (modelo e `CHECK` no banco) | [[SinalVital]] |

## Protocolo de cuidado ([[Módulo Protocolo de Cuidado]])
| Regra | Valor | Código |
|---|---|---|
| Horários da tarefa no dia | Primeira vez + k × repetição, módulo 24 h (inclui madrugada) | `TarefaCuidado.horariosDoDia` |
| Medição | Tarefa com tipo de sinal: "Registrar" grava o sinal e marca a tarefa | [[TarefaCuidado]] |
| Tarefa atrasada | De 30 min a 2 h depois do previsto, sem registro | [[AlertaService]] |

## Bem-estar ([[Módulo Bem-estar]])
| Regra | Valor | Origem | Código |
|---|---|---|---|
| Pontuação | 12 respostas de 0 a 4 → 0 a 48 | ZBI-12 | [[pontuar Zarit]] |
| Faixas | BAIXA ≤ 10 · MODERADA 11 a 20 · **ALTA > 20** | ALTA: formulário ZBI-12 · demais: equipe | [[pontuar Zarit]] |
| Frequência | Sugerida a cada **14 dias** | Decisão da equipe | [[ZaritService]] |
| Privacidade | Privado por padrão; entra no painel só com consentimento, por rede | LGPD art. 11 | [[MembroRedeDao]] |
| Pedido de ajuda | Alerta para todos da rede, sem a pontuação | — | [[ZaritService]] |

## Alertas ([[Módulo Hoje e Alertas]])
| Regra | Valor |
|---|---|
| Quando são calculados | Quando a tela abre (sem rotina em segundo plano) |
| Sem repetir | `UNIQUE (tipo, referencia, destinatario_id)` |
| Prioridades | Pedido de ajuda 100 · sinal 90 · dose não dada 80 · dose atrasada 70 · turno vago 60 · conflito 50 · sobrecarga 40 · tarefa 30 · dose próxima 20 |
| Dose próxima | Até 30 min antes |

## Conta e LGPD ([[Módulo Cadastros e Rede]])
| Regra | Valor |
|---|---|
| Senha | Pelo menos 8 caracteres; guardada como hash PBKDF2 ([[hash da senha]]) |
| Sessão | 7 dias |
| Código de convite | 6 caracteres sem ambiguidade (sem O/0 e I/1) |
| Excluir conta | Anonimiza; apaga a Zarit e as sessões; mantém os registros de cuidado; coordenador único precisa passar a coordenação |
| Rede | Nunca fica sem coordenador |
