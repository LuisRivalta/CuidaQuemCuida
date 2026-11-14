---
titulo: Mapa do Código
tags: [indice, codigo]
---

# Mapa do Código

Índice de todas as partes do código, por camada. Cada nome leva à nota da classe (gerada a partir do próprio código) ou da função. Ver [[Arquitetura]], [[Diagrama de Classes]] e [[API]].

## Módulos
[[Módulo Cadastros e Rede]] · [[Módulo Escala]] · [[Módulo Medicação]] · [[Módulo Sinais Vitais]] · [[Módulo Protocolo de Cuidado]] · [[Módulo Bem-estar]] · [[Módulo Painel Estatístico]] · [[Módulo Hoje e Alertas]] · [[Módulo Infraestrutura e Segurança]]

## Telas (`codigo/src/main/resources/web/`)
| Arquivo | O que tem |
|---|---|
| `index.html` | Página única: topo, alertas, conteúdo e menu |
| `css/estilo.css` | Estilo pensado primeiro para celular, com regras de acessibilidade |
| `js/app.js` | Decide qual tela mostrar pelo endereço (`#/hoje`, `#/escala`...) |
| `js/rotas.js` | Registro das telas, navegação, seletor de paciente, barra de alertas |
| `js/api.js` | Chama a API (com o token) ou o modo demonstração |
| `js/demo.js` | Modo demonstração: o contrato da API inteiro em memória |
| `js/estado.js` | Sessão da aba, opção de lembrar neste aparelho e paciente selecionado |
| `js/ui.js` | Criar elementos, mensagens e formatar datas |
| `js/ceu.js` | Períodos do dia, estrelas, morros e preferência de movimento reduzido |
| `js/icones.js` | Ícones SVG usados nas telas |
| `manifest.json` e `icones/` | Metadados e ícones para instalação do app web |
| `js/telas/*.js` | login, cadastros, hoje, escala, bem-estar, mais, painel |
| `dados/zarit-perguntas.json` | As 12 perguntas da Zarit e as 2 de sono |

## Java (`codigo/src/main/java/br/com/cuidaquemcuida/`)
| Camada | Classes |
|---|---|
| Início | [[App]] |
| **resource** (API) | [[RecursoBase]], [[Dtos]], [[SaudeResource]], [[AuthResource]], [[PessoaResource]], [[PacienteResource]], [[TurnoResource]], [[MedicamentoResource]], [[DoseResource]], [[TarefaResource]], [[ExecucaoResource]], [[ZaritResource]], [[HojeResource]], [[AlertaResource]], [[DemoResource]] |
| **service** (serviços) | [[ContaService]], [[RedeService]], [[EscalaService]], [[MedicacaoService]], [[SinalVitalService]], [[TarefaService]], [[ZaritService]], [[AlertaService]], [[HojeService]], [[EstatisticaService]] |
| **service** (regras puras) | [[Limites]], [[EscalaRegras]], [[Estatistica]], [[DoseRegras]], [[SinalVitalRegras]], [[ZaritCalculadora]] |
| **dao** | [[PessoaDao]], [[PacienteDao]], [[MembroRedeDao]], [[ConsentimentoDao]], [[SessaoDao]], [[TurnoDao]], [[MedicamentoDao]], [[DoseDao]], [[SinalVitalDao]], [[TarefaDao]], [[ZaritDao]], [[AlertaDao]], [[AuditoriaDao]], [[EstatisticaDao]] |
| **model** | [[Pessoa]], [[Cuidador]], [[Paciente]], [[MembroRede]], [[Turno]], [[Medicamento]], [[RegraHorario]], [[RegraIntervalo]], [[RegraHorariosFixos]], [[RegraDiasAlternados]], [[Dose]], [[SinalVital]], [[FaixaSinal]], [[TarefaCuidado]], [[ExecucaoTarefa]], [[AvaliacaoZarit]] |
| **model** (enums) | [[Papel]], [[Vinculo]], [[StatusTurno]], [[StatusDose]], [[TipoSinal]], [[FaixaZarit]], [[TipoRegra]], [[Periodo]] |
| **model.alerta** | [[Alerta]], [[TipoAlerta]], [[AlertaMedicacao]], [[AlertaSinalVital]], [[AlertaTurnoVago]], [[AlertaConflito]], [[AlertaSobrecarga]], [[AlertaPedidoAjuda]], [[AlertaTarefa]] |
| **infra** | [[Config]], [[Conexao]], [[Sql]], [[LogSql]], [[Senha]], [[JsonConfig]], [[ApiException]], [[ErroMapper]], [[AuthFilter]], [[Autorizacao]] |

## Funções com regra de negócio
[[conflitos]] · [[conflitosIngenuo]] · [[blocosSemFolga]] · [[horasNaJanela]] · [[nivel de sobrecarga]] · [[periodosDescobertos]] · [[sugerirCobertura]] · [[horariosEntre]] · [[status da dose]] · [[foraDaCurva]] · [[pontuar Zarit]] · [[mediaMovel]] · [[pearson]] · [[desvioPadrao]] · [[zScore]] · [[hash da senha]] · [[garantirDoses]] · [[registrar dose]]

## Testes (`codigo/src/test/java/`)
14 classes de teste JUnit 5 (64 testes). Lista e o que cada uma prova em [[Testes e Validação]].

## Banco (`banco/`)
`00-apagar-tabelas.sql` · `01-criar-tabelas.sql` · `02-ligar-rls.sql` · `03-dados-demo.sql`. Ver [[Diagrama do Banco]].
