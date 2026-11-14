---
titulo: Testes e Validação
tags: [qualidade, testes, validacao]
---

# Testes e Validação

O edital pede "como o protótipo foi testado ou validado e como seus resultados podem ser medidos". Há quatro camadas: testes automáticos, cenários de aceite, validação com pessoas e métricas de sucesso. Ver [[Design da Solução]] (seção 12) e [[Backlog]].

## 1. Testes automáticos (JUnit 5)
Rodam com `mvn test` (ou Maven → Lifecycle → test no IntelliJ). O print da janela verde vai em `imagens/testes-verdes.png` (Tarefa B2).

| Classe de teste | Testes | O que prova |
|---|---|---|
| `PeriodoTest` | 1 | Fronteiras 05:59/06:00, 11:59/12:00, 23:59/00:00 caem no período certo |
| `TurnoTest` | 6 | Turno que atravessa a meia-noite (8 h, noturno); 1 h de noite não é noturno; fim = início é inválido; sobreposição na madrugada; encostados não conflitam |
| `RegraHorarioTest` | 7 | De 8 em 8 h; continua nos dias seguintes; horários fixos; dias alternados; fora do período; **geração idempotente**; fábrica monta a subclasse certa |
| `TarefaCuidadoTest` | 2 | A cada 2 h inclui a madrugada; 1×/dia só no horário |
| `EstatisticaTest` | 8 | Média, desvio (populacional), mediana, moda (empate → menor), média móvel, Pearson ±1, **NaN sem dados**, coeficiente de variação |
| `EscalaRegrasTest` | 10 | Conflitos: versão rápida = ingênua, inclusive com turno longo; blocos sem folga (11 h); níveis de sobrecarga nos limites; horas na janela recortadas; período descoberto (vago não cobre); sugestão ordenada pela carga |
| `DoseRegrasTest` | 5 | 29/30/31 min (no horário × atrasada); 2 h sem registro; marcada como não dada; **não registra dose já resolvida** |
| `SinalVitalRegrasTest` | 4 | Menos de 7 medições nunca é fora da curva; 175 fora; 131 normal; faixa |
| `ZaritCalculadoraTest` | 4 | Soma; faixas nos limites 10/11/20/21; 11 respostas e valor 5 recusados |
| `EstatisticaServiceTest` | 3 | **NaN e infinito viram null** no JSON; arredondamento; horário noturno 22h–5h |
| `SenhaTest` | 6 | A senha da demonstração confere com o hash dos dados; senha errada; conta anonimizada nunca confere; salt aleatório; hash determinístico; token de 43 caracteres |
| `LogSqlTest` | 3 | Guarda só os 50 últimos, o mais novo primeiro; tipo do comando; espaços compactados |
| `AutorizacaoTest` | 3 | Trocar o id do paciente não dá acesso; quem saiu da rede perde o acesso; só saúde, login e cadastro são públicos |
| `AlertaServiceTest` | 2 | A chave de cada alerta (usada para tirar da lista os que já foram resolvidos) é tipo + referência e não contém o separador do SQL |
| **Total** | **64** | |

> Os testes foram **escritos antes** do código de cada regra (TDD). O computador usado na construção não tinha Java, então a primeira execução acontece na Tarefa B2. Resultado: _a preencher (data e "64 de 64 passaram")_.

## 2. Testes das telas (modo demonstração)
Feitos durante a construção, em 13/11/2026:
- **Sintaxe:** todos os arquivos JavaScript conferidos com `node --check`.
- **Contrato:** um roteiro automático chama as rotas do modo demonstração como as telas fazem, cobrindo login, 401, 403, conflito, doses sem duplicar, 409 na dose repetida, Zarit, pedido de ajuda, conta anonimizada e log de SQL. Todas as verificações passaram.
- **Visual:** as 16 telas abertas num navegador em tamanho de celular (390 px) e de computador (1280 px), com foto de cada uma e captura de erros. Resultado final: **0 erros no console, 0 textos "null"/"undefined" na tela, 0 rolagem horizontal**. Defeitos achados e corrigidos nesse teste estão no [[Diário de Desafios]].

## 3. Cenários de aceite (com a API real — Tarefa B4)
| # | História | Passos | Esperado | Obtido |
|---|---|---|---|---|
| 1 | Login | Entrar com marta@demo.cqc / demo1234 | Abre a tela Hoje | |
| 2 | Login inválido | Senha errada | "E-mail ou senha incorretos" | |
| 3 | Dar remédio | Hoje → "Dei o remédio" | Item vira "Dado ✓"; Banco ao vivo mostra um UPDATE | |
| 4 | Duas pessoas, mesma dose | Marta e Paulo em janelas diferentes tocam na mesma dose | A segunda vê "Essa dose já foi registrada por ..." | |
| 5 | Não foi dado | "Não foi dado" + motivo | Status "Não dado" com o motivo | |
| 6 | Conflito de turno | Criar turno sobreposto para a Marta | 409 com o turno que conflita | |
| 7 | Turno da noite | Novo turno 22h → 6h | Termina no dia seguinte, marcado 🌙 | |
| 8 | Domingo vago | Abrir a Escala | Domingo 22h–6h tracejado; alerta "sem ninguém" | |
| 9 | Cobrir vago | Logado como Ana → "Posso cobrir" | O turno passa a ser da Ana | |
| 10 | Sobrecarga | Escala logado como Marta | Alerta de Marta com quem pode ajudar | |
| 11 | Sinal fora da faixa | Registrar pressão 180/105 | Aviso "fora da faixa"; alerta para o coordenador | |
| 12 | Zarit alta | Responder tudo "Sempre" | 48 pontos, faixa alta, CVV 188, "Pedir ajuda" | |
| 13 | Pedido de ajuda | Pedir ajuda → entrar como outro membro | Alerta "fulano pediu ajuda" no topo | |
| 14 | Privacidade da Zarit | Desligar "compartilhar" | O painel mostra 3 de 4 | |
| 15 | Painel só do coordenador | Logado como João | "Painel da rede" não aparece; a API dá 403 | |
| 16 | Outra família | `/api/pacientes/999` logado como João | 403 | |
| 17 | Convite | Criar conta nova → código LURD26 | Entra como membro | |
| 18 | Excluir conta | Excluir a conta nova | Nome vira "Pessoa removida"; login não funciona mais | |
| 19 | Doses sem duplicar | Abrir Hoje várias vezes | Mesma quantidade de doses | |
| 20 | Celular de verdade | Abrir pelo IP no Wi-Fi | Botões grandes, leitura confortável | |

## 4. Validação com pessoas (Tarefa B4)
- **Questionário:** ZBI-12 aplicada num formulário a 2 ou 3 cuidadores reais conhecidos da equipe ([[Formulário Zarit (validação)]]). Os resultados entram lá, com a data.
- **Teste de uso:** uma pessoa marca um remédio no celular sem ajuda; anotar quanto tempo levou e onde travou.

| Data | Quem (sem nome) | Tarefa | Conseguiu sozinho? | Observação |
|---|---|---|---|---|
| | | Marcar "Dei o remédio" | | |
| | | Responder à Zarit | | |

## 5. Métricas de sucesso do produto
| Métrica | Como medir no sistema | Meta (piloto de 30 dias) |
|---|---|---|
| Adesão aos remédios | Taxa do painel | ≥ 90% |
| Horas seguidas sem folga do cuidador principal | Indicador de sobrecarga | Cair para menos de 24 h |
| Equilíbrio da carga | Coeficiente de variação | Cair abaixo de 0,5 |
| Sobrecarga do cuidador | Pontuação Zarit (compartilhada) | Sair da faixa alta |
| Turnos vagos | Alertas de turno vago | Zero noites sem ninguém |
