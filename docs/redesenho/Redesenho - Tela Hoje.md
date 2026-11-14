---
titulo: Redesenho — tela Hoje
data: 2026-11-14
tags: [redesenho, tela, hoje]
---

# Tela Hoje (redesenhada e fechada em 14/11/2026)

Arquivo: `codigo/src/main/resources/web/js/telas/hoje.js`, com os estilos na seção "Tela Hoje" do `css/estilo.css`. Voltar para [[Redesenho - Passagem]]. Visual: [[Redesenho - Sistema Visual]].

- **Notas dos critiques da Impeccable:** 26 → 27 → 29 → **30/40** ("Bom"). Relatórios: [[Critique Hoje - rodada 1 (26 de 40)]], [[Critique Hoje - rodada 2 (27 de 40)]], [[Critique Hoje - rodada 3 (29 de 40)]], [[Critique Hoje - rodada 4 (30 de 40)]].
- **Fechada por decisão do Luis** ("os 5 e fecha"), sem uma 5ª rodada. O que sobrou vai para o polish da Fase 5.

## Fotos
- Celular, de dia, Marta no turno: ![[hoje-celular-dia-no-turno.png|280]]
- Noite, Marta fora do turno: ![[hoje-celular-noite-fora-do-turno.png|280]]
- Paulo fora do turno: ![[hoje-celular-paulo-fora-do-turno.png|280]]
- Modo escuro de dia: ![[hoje-celular-modo-escuro-de-dia.png|280]]
- Logo depois de registrar ("Desfazer"): ![[hoje-celular-desfazer.png|280]]
- Letra a 150%: ![[hoje-celular-letra-150.png|280]]
- Celular de 360×640: ![[hoje-celular-360x640.png|280]]
- Computador: ![[hoje-computador.png|560]]

## De onde vêm os dados
Todas as rotas já existiam no [[API]]. **Nenhuma mudança de contrato.**

| Chamada | Para quê |
|---|---|
| `GET /api/hoje?pacienteId=` | turno atual e próximo, itens do dia (doses e execuções de tarefas) e alertas |
| `GET /api/pacientes/{id}/doses?data=hoje` | quem deu e quando (`dadaPorNome`, `dadaEm`, `observacao`); "último remédio dado"; "remédios já registrados hoje" (decisão do Luis: buscar à parte, sem mudar o `/hoje`) |
| `GET /api/pacientes/{id}/turnos?de=ontem&ate=hoje` | quem está cuidando agora (fora do turno) e o agrupamento por turno |
| `GET /api/pacientes/{id}/escala/analise?de=&ate=` | turno vago dos próximos 7 dias ("Posso cobrir") |
| `PUT /api/doses/{id}/dar` · `PUT /api/doses/{id}/nao-dar {motivo}` | registrar remédio |
| `PUT /api/execucoes/{id}/feita` | tarefa feita (também depois de uma medição) |
| `POST /api/pacientes/{id}/sinais` | medição |
| `POST /api/pacientes/{id}/turnos` | assumir o turno vago |
| `PUT /api/alertas/{id}/lido` | "Entendi" num aviso |

## Composição, de cima para baixo
1. **Céu da hora:**
   - "Bom dia, Marta" e "Sábado, 14/11 · cuidando de Lurdes";
   - no turno, o **arco do turno**: "Faltam 2 h 17 min para o fim do seu turno", com as horas de início e fim nas pontas;
   - fora do turno, "Seu próximo turno: Hoje, 22:00–06:00", ou "Sem turnos marcados" com o link para a Escala.
2. **Cartão "Agora"**, sobre os morros:
   - no turno: o item em destaque e a ação principal;
   - fora do turno: o cartão calmo "Nada para você agora" ou, se houver remédio atrasado, o aviso para conferir antes de dar.
3. **Aviso de fila:** registros guardados sem internet, com "Tentar agora".
4. **"Você está há 88 h sem folga":** só quando a sobrecarga é de quem está vendo.
5. **Painel de avisos:** turno vago e alertas. Os alertas de remédio e tarefa saem daqui, porque já estão no caminho.
6. **Caminho do dia:**
   - título "No seu turno" ou "Pendências de hoje", contagem e "atualizado às";
   - "Último remédio dado";
   - grupos recolhidos e pendentes;
   - "Ficou para trás";
   - orientação de "sem registro".
7. **Fora do turno:** "Remédios já registrados hoje", recolhido.
8. **Aviso médico:** "O CuidaQuemCuida organiza e orienta. Não substitui orientação médica."

## Regras de comportamento (o que o código faz)

### Item em destaque (`classificar`)
- **Tarefa superada vai para "Ficou para trás"** quando acontece uma destas coisas:
  - já existe uma vez mais nova da mesma tarefa no horário;
  - está esquecida há mais de 4 h (`PARADA`).
- **Entre os pendentes que sobram, a prioridade é:**
  1. remédio dentro da janela de 120 min (`JANELA_DOSE`), até 30 min antes do horário;
  2. item da hora atual (±30 min);
  3. o atrasado mais recente;
  4. o próximo.
- **Desempate no mesmo horário:** remédio, depois medição, depois tarefa (`peso`).
- **Fora do turno, só vira destaque um remédio atrasado.** No resto aparece o cartão calmo `cartaoFora`: "Marta está com Lurdes até 14:00. O turno de Marta tem 2 pendências.".

### Textos de tempo (`quandoDoItem`)
- **No turno:**
  - atrasado: "Atrasado há 1 h 10 min", vermelho (`ruim`) para remédio no prazo e âmbar (`meio`) para tarefa;
  - "Às 16:00";
  - "Daqui a 25 min · 10:00";
  - "Agora · 10:00".
- **Fora do turno, sem cobrança:** "Previsto para 22:00 · passou há 1 h".
- **Notas do cartão de remédio:**
  - no turno: "Ninguém registrou ainda (conferido às 23:21)." e, se atrasado, "Registre até 00:00; depois disso, o app não aceita mais o registro.";
  - fora do turno, atrasado: "Ainda sem registro no app (…). Quem está com Lurdes é Paulo: antes de dar, confirme com Paulo, que pode ter dado sem marcar.".

### Ações
- **No turno (`acoes`):**
  - remédio: "Dei o remédio" (principal) e "Não foi dado" (secundário);
  - medição: "Registrar medição";
  - tarefa: "Feito".
- **Fora do turno (`acoesFora`):** só ações secundárias, para quem fez e não marcou: "Fui eu que dei", "Registrar medição" e "Fui eu que fiz".

### Registrar com desfazer (`registrarComDesfazer`)
1. **Ao tocar:** o botão vira "✓ Registrado" (o check se desenha com GSAP), o cartão fica sálvia, a etiqueta "Atrasado" sai e o horário vira "Registrado às 11:43".
2. **"Desfazer (15 s)" para remédio e "Desfazer (8 s)" para tarefa,** dentro do próprio item, com o foco nele e o tempo contando.
3. **Antes de enviar, o registro fica guardado no navegador:** `localStorage`, chave `cqc.registros-pendentes.<id da pessoa>`, uma fila por pessoa. Assim, um registro de uma pessoa nunca sai com o login de outra.
4. **Envio:**
   - depois do tempo, envia (`enviar`);
   - se a pessoa sair da tela ou do app, envia na hora (`descarregar`, no `visibilitychange` e no `hashchange`).
5. **Sem internet (status 0):** o registro continua guardado e aparece o aviso "1 registro ainda não foi enviado… Tentar agora". A tela tenta de novo ao abrir, ao atualizar e no botão. O item mostra "Aguardando envio".
6. **Outro erro (ex.: 409, outra pessoa já registrou):** o registro sai da fila e o erro diz o item: "Não deu para salvar 'Oferecer água · 10:00': …". **O erro fica até a pessoa fechar.**
7. **Depois de enviar:**
   - aparece "Remédio registrado." (ou "…, com atraso.") ou "Tarefa registrada.", seguido de "Registrou errado? Avise quem coordena a rede.";
   - a tela se atualiza no lugar;
   - o foco vai para o **título** do próximo item, não para o botão, para um Enter a mais não registrar outro item.
- **No modo demonstração,** a fila é limpa a cada carga da página (`app.js`), porque os ids mudam e uma fila antiga daria erro durante a gravação.

### "Não foi dado" (`formularioNaoDado`)
- Motivos em botões: Recusou, Vomitou, Acabou o remédio, Estava dormindo, Outro motivo. Há também o campo "Quer contar mais? (opcional)".
- **"Outro motivo" exige texto.** O rótulo vira "Qual foi o motivo?".
- **"Estava dormindo":**
  - aparece "Vai dar quando acordar? Então não registre agora: quando der, toque em 'Dei o remédio' (até 00:00).";
  - o botão principal vira **"Vou dar quando acordar"**, que fecha sem registrar;
  - "Confirmar" vira o secundário "Registrar como não dado mesmo assim".
- **O registro passa pelo mesmo "Desfazer".** O motivo vai em `motivo` (até 200 caracteres no banco; a observação está limitada a 150).

### Medição (`formularioSinal`)
- Campos de texto com teclado numérico e unidade no rótulo (mmHg, mg/dL, °C, %, bpm). **Aceita vírgula** (36,5). Na pressão, a máxima e a mínima são obrigatórias.
- **Valor fora do possível** (`POSSIVEL`: temperatura 30 a 45; saturação 50 a 100; pressão 50 a 260 por 30 a 160; glicemia 20 a 600; batimentos 20 a 250): a tela pede para conferir ("365 °C parece fora do possível. Confira se faltou a vírgula."). "Salvar" de novo confirma.
- **Valor fora da faixa da pessoa:** o aviso fica no cartão até "Entendi": "Valor fora da faixa combinada. A rede vai ver este aviso quando abrir o app. Se a pessoa estiver passando mal, ligue para o SAMU.", com o botão **"Ligar para o SAMU (192)"** (`tel:192`).
- **Se a medição salvar mas a tarefa não for marcada:** "A medição foi salva, mas não deu para marcar a tarefa como feita. Não registre de novo; avise quem coordena a rede.".
- O erro aparece **embaixo do campo** (`erroNoCampo`, com `aria-invalid` e `aria-describedby`).

### Caminho do dia (`caminhoDoDia`)
- **No turno:**
  - o que já foi registrado fica recolhido em "Já registrados (n)";
  - os pendentes vêm abertos, e cada um abre com um toque (`details`, com `summary` de 48 px);
  - "Ficou para trás (n)" vem no fim, sem vermelho.
- **Fora do turno (`pendentesFora`):**
  - "Seu turno, 22:00–06:00" aberto e primeiro;
  - "Agora, com Marta até 14:00 (n)" recolhido;
  - "Outros horários de hoje (n)" recolhido;
  - sem "Atrasado" em nada (quem está vendo não é quem deve fazer).
- **Marcadores:**
  - check sálvia (feito);
  - traço vermelho (não dado com motivo);
  - traço âmbar (sem registro);
  - aro vermelho (remédio atrasado no prazo);
  - aro âmbar (tarefa atrasada);
  - aro coral (o item em destaque).
- **Etiquetas:**
  - "Dado com atraso", "Não dado" e "Sem registro";
  - "Atrasado", sempre da mesma cor no cartão e na lista;
  - no item em destaque: "Agora", "Próximo", "Pendente" ou "Atrasado";
  - "Aguardando envio";
  - dado e feito não têm etiqueta (o check e o "Por Marta às 08:06" já dizem).
- **"Sem registro"** é a dose que o sistema marcou como não dada depois de 120 min sem ninguém registrar e sem motivo. É diferente de "Não dado", que tem motivo. Quando existe, aparece a orientação "Se você não sabe se já deram, não dê de novo: pergunte a quem estava no turno.".
- **"Último remédio dado: Losartana 50 mg e Donepezila 10 mg, por Marta às 20:06"**, sempre à vista. Junta os dados no mesmo minuto pela mesma pessoa.
- **Leitor de tela:** a hora do item vai escondida dentro do `summary`.

### Avisos
- **`avisoVoce`:** quando a sobrecarga é de quem está vendo. No turno: "Você está há 88 h sem folga". De folga: "Você ficou 88 h seguidas sem folga… Aproveite a folga para descansar.". Ações: "Ver quem pode cobrir" (Escala) e "Entendi".
  - A tela identifica isso pelo alerta `SOBRECARGA` cuja mensagem começa com o nome da pessoa (igual no Java e no `demo.js`).
- **Turno vago (`avisoVago`):** "Ninguém cobre domingo, 15/11, 22:00–06:00".
  - "Posso cobrir" pede confirmação: "Você fica com…? · Sim, eu cubro · Agora não".
  - Quem está sobrecarregado vê só "Ver na escala".
- **Alertas da rede:** "Entendi" no lugar de "Ok". O nome acessível inclui a mensagem. O `role="alert"` só vale na entrada da tela, não nas atualizações.

### Atualização (`atualizar`, `montar`)
- **Quando:** a cada minuto (`setInterval`) e ao voltar ao app (`visibilitychange`).
- **Ao voltar ao app,** a tela antiga fica **travada** (`inert` + `aria-busy`) até chegar a atualizada.
- **Não atualiza sozinha** se houver formulário aberto, aviso de medição, confirmação de "Posso cobrir" ou registro esperando o "Desfazer". Se algo assim começar durante a espera, `montar` desiste.
- **Mantém o lugar:** os grupos abertos (`data-chave`), o "Como fazer" aberto, a rolagem e o foco.
- **Se o item em destaque mudou,** os botões do cartão ficam desligados por 700 ms, para um toque que ia para o item antigo não cair no novo.

### Tema e tamanho
- Tema noturno e céu por período: ver [[Redesenho - Sistema Visual]].
- **Com letra muito grande** (`ajustarArco`), o arco vira uma linha só: "Seu turno 06:00–14:00 · faltam 2 h 38 min".
- **Tela baixa** (`max-height: 760px`): céu compacto, para o botão principal aparecer sem rolar num 360×640.

## Mapa das funções de `hoje.js`
- **Utilidades e regras:** `duracao`, `classificar`, `quandoDoItem`, `urgente`, `atrasado`, `peso`.
- **Fila:** `lerFila`, `gravarFila`, `chaveFila`, `naFila`, `tirarDaFila`, `enviar`, `reenviarFila`.
- **Céu:** `ajustarArco`, `desenharArco`, `arcoDoTurno`, `ceu`.
- **Registrar:** `marcarConfirmado`, `registrarComDesfazer`, `descarregar`.
- **Formulários:** `erroNoCampo`, `abrirFormulario`, `formularioSinal`, `formularioNaoDado`, `acoes`, `acoesFora`, `detalheDoItem`.
- **Cartões:** `linhaQuemCuida`, `cartaoFora`, `cartaoAgora`, `avisoVoce`, `avisoVago`.
- **Caminho:** `semRegistro`, `etiquetaStatus`, `quemRegistrou`, `linhaCaminho`, `ultimoRemedio`, `agruparFora`, `pendentesFora`, `caminhoDoDia`, `jaRegistrados`.
- **Movimento e montagem:** `animarEntrada`, `montar`, `ocupar`, `liberar`, `atualizar`, e o `registrarTela('/hoje', …)`.

## Histórico dos critiques (resumo)
| Rodada | Nota | O que a revisão achou de mais grave | O que foi feito (escolha do Luis) |
|---|---|---|---|
| 1 | 26/40 (1 P0, 3 P1) | P0: o destaque pegava a tarefa pendente mais antiga, que nunca vencia. P1: registrar sem proteção; a noite só no céu; "cuidar de quem cuida" virou um alerta com "Ok" | Os 5 problemas: destaque por prioridade, "Ficou para trás", desfazer, atualização, modo noturno de verdade, sobrecarga no topo, céu compacto |
| 2 | 27/40 (3 P1 novos) | O cartão não sabia de quem é o turno; "não dado" usado para "sem registro"; aviso fora da faixa prometendo notificação que não existe | Os 5: cartão fora do turno, "Sem registro", SAMU e conferência de valores, fila com nova tentativa, itens feitos recolhidos |
| 3 | 29/40 (1 P1) | Remédio atrasado visto fora do turno sem "pergunte antes de dar" | Os 5: orientação, desfazer no "Não foi dado", lista agrupada por turno, último remédio sempre à vista, fila por pessoa, erro que fica, etc. |
| 4 | 30/40 (1 P1) | A atualização em segundo plano atropelava o toque | Os 5 e fecha: tela travada ao voltar, desfazer com contagem e 15 s, "Estava dormindo" com o botão certo, erros com contexto, fora do turno mais enxuto |

O detector da Impeccable deu **zero achados** nas rodadas 2, 3 e 4. A única exceção é o fundo pêssego, que foi escolha do Luis e está registrada.

## O que sobrou para o polish (Fase 5)
- **Pilha de caixas pastel** abaixo do cartão: o "caminho do dia" poderia carregar a divisão entre os turnos.
- **"Atrasado" aparece várias vezes na primeira tela;** para tarefa, "Era às 10:00" cobraria menos.
- **Sem ação em lote** ("fiz as três das 10:00").
- **A medição não tem fila sem internet nem desfazer** (os remédios e as tarefas têm).
- **Não existe rota de correção** depois do envio. Precisaria mudar a API: Parte B ou roadmap, registrado no [[Registro de Decisões]].
- **Computador:** o menu lateral não tem a marca, a coluna de 720 px e os morros cortados na borda (adapt).
- **Chart.js carrega também na Hoje,** sem gráfico (optimize: carregar só no Painel).
- **De madrugada, o botão pêssego** é o ponto mais claro da tela; testar um tom mais baixo.
- **Ao tocar no item em destaque da lista, nada acontece;** ele poderia levar ao cartão.
- **Tratamento de gênero:** a Hoje não tem texto com gênero. A mensagem do pedido de ajuda (Java `AlertaPedidoAjuda` e `demo.js`) ainda diz "sobrecarregada(o)": deixar neutra.
