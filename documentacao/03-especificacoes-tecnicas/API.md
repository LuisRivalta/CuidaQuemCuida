---
titulo: Contrato da API
versao: 1
data: 2026-11-13
tags: [api, especificacao]
---

# Contrato da API — CuidaQuemCuida

É o ponto de encontro entre as **telas** (`codigo/src/main/resources/web/js/`) e a **API Java** (`codigo/src/main/java/br/com/cuidaquemcuida/resource/`). Uma mudança aqui exige mudar os dois lados. Ver [[Design da Solução]] (seção 9), [[Regras de Negócio]] e [[Mapa do Código]].

## Regras gerais

| Item | Regra |
|---|---|
| Base | `/api` (o mesmo servidor entrega as telas em `/`) |
| Formato | JSON em UTF-8 |
| Login | Cabeçalho `Authorization: Bearer <token>` em toda rota, menos as marcadas **(pública)** |
| Datas | ISO-8601 local, sem fuso: `2026-11-13T14:00:00` (data e hora), `2026-11-13` (data), `14:00` (hora) |
| Erro | Sempre `{"erro": "mensagem em português simples"}`, às vezes com campos extras |
| Valor indefinido | `null` (nunca `NaN`). A tela mostra "Dados insuficientes" |
| **(coord)** | Só o coordenador da rede daquele paciente pode usar |

### Códigos de resposta

| Código | Quando |
|---|---|
| 200 | Deu certo, com corpo |
| 201 | Criado |
| 204 | Deu certo, sem corpo |
| 400 | Dado inválido (a mensagem diz qual) |
| 401 | Sem login ou sessão expirada: a tela volta para o login |
| 403 | Logado, mas sem permissão (não é da rede, ou não é coordenador) |
| 404 | Não existe |
| 409 | Conflito: horário sobreposto, dose já registrada, e-mail já usado |

### Enumerações

| Campo | Valores |
|---|---|
| `papel` | `COORDENADOR`, `MEMBRO` |
| `vinculo` | `FAMILIAR`, `VIZINHO`, `AMIGO`, `OUTRO` |
| `genero` | `FEMININO`, `MASCULINO`, `OUTRO`, `NAO_INFORMAR` |
| `status` (turno) | `PLANEJADO`, `REALIZADO`, `CANCELADO` |
| `status` (dose) | `PENDENTE`, `DADA`, `ATRASADA`, `NAO_DADA` |
| `tipo` (regra) | `INTERVALO`, `HORARIOS_FIXOS`, `DIAS_ALTERNADOS` |
| `tipo` / `tipoSinal` | `PRESSAO`, `GLICEMIA`, `TEMPERATURA`, `SATURACAO`, `FREQUENCIA_CARDIACA` |
| `faixa` (Zarit) | `BAIXA`, `MODERADA`, `ALTA` |
| `nivel` (sobrecarga) | `OK`, `ATENCAO`, `ALERTA` |
| `periodo` | `MADRUGADA`, `MANHA`, `TARDE`, `NOITE` |
| `tipo` (alerta) | `DOSE_PROXIMA`, `DOSE_ATRASADA`, `DOSE_NAO_DADA`, `TAREFA_ATRASADA`, `SINAL_FORA_FAIXA`, `SINAL_FORA_CURVA`, `TURNO_VAGO`, `CONFLITO_TURNO`, `SOBRECARGA`, `PEDIDO_AJUDA` |

---

## Saúde e login

### `GET /api/saude` (pública)
```json
{"ok": true}
```

### `POST /api/auth/login` (pública)
Entrada:
```json
{"email": "marta@demo.cqc", "senha": "demo1234"}
```
Saída 200:
```json
{"token": "q8Zx...43 caracteres", "pessoa": {"id": 1, "nome": "Marta Souza", "email": "marta@demo.cqc"}}
```
401: `{"erro": "E-mail ou senha incorretos"}`. A sessão vale 7 dias.

### `POST /api/auth/logout`
204. Apaga a sessão.

---

## Pessoas e conta

### `POST /api/pessoas` (pública) — cadastro
```json
{"nome": "Carla Lima", "email": "carla@exemplo.com", "senha": "segredo123", "telefone": "11999990000",
 "dataNascimento": "1970-05-02", "genero": "FEMININO", "aceiteTermo": true, "versaoTermo": "1.0"}
```
201: `{"id": 5, "nome": "Carla Lima", "email": "carla@exemplo.com"}`

- 400 sem aceite do termo, com senha de menos de 8 caracteres ou sem nome ou e-mail.
- 409 `{"erro": "Este e-mail já tem cadastro"}`.

### `GET /api/pessoas/eu` — meus dados
```json
{"id": 1, "nome": "Marta Souza", "email": "marta@demo.cqc", "telefone": null, "dataNascimento": "1968-03-10",
 "genero": "FEMININO",
 "redes": [{"pacienteId": 1, "pacienteNome": "Lurdes Souza", "papel": "COORDENADOR", "vinculo": "FAMILIAR", "compartilhaZarit": true}]}
```

### `DELETE /api/pessoas/eu` — excluir minha conta
204. Anonimiza a pessoa (o nome vira "Pessoa removida"; e-mail, telefone, senha e data de nascimento são apagados), **apaga as avaliações Zarit** e mantém os registros de cuidado.
409 `{"erro": "Passe a coordenação a outro membro antes de excluir sua conta"}` quando a pessoa é a única coordenadora de uma rede com outros membros. Se for o último membro, o paciente é apagado junto.

---

## Pacientes e rede

### `GET /api/pacientes` — minhas redes
```json
[{"id": 1, "nome": "Lurdes Souza", "condicao": "Alzheimer moderado, acamada parcialmente", "papel": "COORDENADOR"}]
```

### `POST /api/pacientes` — cadastrar paciente
```json
{"nome": "Lurdes Souza", "dataNascimento": "1944-08-21", "condicao": "Alzheimer moderado",
 "precisa24h": true, "observacoes": "Alergia a dipirona",
 "responsavelNome": "Marta Souza", "responsavelParentesco": "Filha", "declaracaoAutorizacao": true}
```
201: `{"id": 1, "nome": "Lurdes Souza", "codigoConvite": "LURD26"}`. Quem cria vira **COORDENADOR**. Grava o consentimento `DADOS_PACIENTE`. 400 sem a declaração de autorização ou sem o nome ou parentesco do responsável.

### `GET /api/pacientes/{id}`
```json
{"id": 1, "nome": "Lurdes Souza", "dataNascimento": "1944-08-21", "condicao": "Alzheimer moderado",
 "precisa24h": true, "observacoes": "Alergia a dipirona",
 "responsavelNome": "Marta Souza", "responsavelParentesco": "Filha", "codigoConvite": "LURD26"}
```
O `codigoConvite` só vem para o coordenador (para os outros, `null`).

### `PUT /api/pacientes/{id}` (coord)
Os mesmos campos do POST, sem `declaracaoAutorizacao`. 200 com o paciente.

### `DELETE /api/pacientes/{id}` (coord)
204. Apaga o paciente e todos os dados de cuidado dele.

### `POST /api/pacientes/entrar` — entrar com código
```json
{"codigo": "LURD26", "vinculo": "VIZINHO"}
```
200: `{"pacienteId": 1, "pacienteNome": "Lurdes Souza"}`. Entra como **MEMBRO**. 404 `{"erro": "Código de convite não encontrado"}`. 409 `{"erro": "Você já faz parte desta rede"}`.

### `POST /api/pacientes/{id}/convite` (coord)
200: `{"codigoConvite": "K7PQ2M"}`. Gera um código novo; o antigo deixa de valer.

### `GET /api/pacientes/{id}/membros`
```json
[{"pessoaId": 1, "nome": "Marta Souza", "papel": "COORDENADOR", "vinculo": "FAMILIAR", "horas7d": 96.0},
 {"pessoaId": 2, "nome": "Paulo Souza", "papel": "MEMBRO", "vinculo": "FAMILIAR", "horas7d": 32.0}]
```

### `PUT /api/pacientes/{id}/membros/{pessoaId}` (coord)
`{"papel": "COORDENADOR"}` → 200.

### `DELETE /api/pacientes/{id}/membros/{pessoaId}` (coord)
204. A pessoa sai da rede, e os registros dela continuam.

### `PUT /api/pacientes/{id}/compartilhar-zarit`
`{"compartilha": true}` → 200 `{"compartilha": true}`. Vale para a pessoa logada naquela rede.

---

## Escala

### `GET /api/pacientes/{id}/turnos?de=2026-11-09&ate=2026-11-15`
`de` e `ate` são datas, com `ate` incluído. Devolve os turnos que começam nesse intervalo.
```json
[{"id": 10, "pessoaId": 1, "pessoaNome": "Marta Souza", "inicio": "2026-11-13T06:00:00", "fim": "2026-11-13T14:00:00", "status": "PLANEJADO", "noturno": false},
 {"id": 11, "pessoaId": null, "pessoaNome": null, "inicio": "2026-11-15T22:00:00", "fim": "2026-11-16T06:00:00", "status": "PLANEJADO", "noturno": true}]
```
`pessoaId: null` = turno vago.

### `POST /api/pacientes/{id}/turnos`
```json
{"pessoaId": 2, "inicio": "2026-11-14T14:00:00", "fim": "2026-11-14T22:00:00"}
```
201 com o turno.
- O **coordenador** cria turno para qualquer membro, ou vago (`pessoaId: null`).
- O **membro** só cria turno para **si mesmo** (`pessoaId` = a pessoa logada). É assim que alguém "se oferece para cobrir" um período vago. Senão, 403 `{"erro": "Você só pode marcar turnos para você mesmo(a)"}`.
- 400 `{"erro": "O fim do turno precisa ser depois do início"}`.
- 409 com a lista de conflitos:
```json
{"erro": "Paulo Souza já tem turno nesse horário", "conflitos": [{"id": 7, "inicio": "2026-11-14T12:00:00", "fim": "2026-11-14T18:00:00"}]}
```

### `PUT /api/turnos/{id}` (coord)
`{"pessoaId": 2, "inicio": "...", "fim": "...", "status": "PLANEJADO"}` → 200. Os erros são os mesmos do POST.

### `DELETE /api/turnos/{id}` (coord)
204.

### `POST /api/turnos/{id}/assumir`
A pessoa logada assume o turno vago. 200 com o turno. 409 `{"erro": "Este turno já tem responsável"}` ou o conflito de horário.

### `GET /api/turnos/{id}/sugestoes`
Membros ativos sem conflito no horário, do menos para o mais carregado:
```json
[{"pessoaId": 3, "nome": "Ana Souza", "horas7d": 24.0}, {"pessoaId": 4, "nome": "João Pereira", "horas7d": 8.0}]
```

### `GET /api/pacientes/{id}/escala/analise?de=2026-11-09&ate=2026-11-15`
```json
{"conflitos": [{"turnoA": {"id": 7, "pessoaNome": "Paulo Souza", "inicio": "...", "fim": "..."}, "turnoB": {"id": 9, "pessoaNome": "Paulo Souza", "inicio": "...", "fim": "..."}}],
 "vagos": [{"inicio": "2026-11-15T22:00:00", "fim": "2026-11-16T06:00:00"}],
 "sobrecarga": [{"pessoaId": 1, "nome": "Marta Souza", "horas7d": 96.0, "horasSeguidas": 88.0, "nivel": "ALERTA"}]}
```
`vagos` só é calculado quando o paciente precisa de acompanhamento 24 h. `sobrecarga` lista todos os membros, inclusive os com nível `OK`.

---

## Medicação

### `GET /api/pacientes/{id}/medicamentos`
```json
[{"id": 5, "nome": "Amoxicilina", "dosagem": "500 mg", "via": "Oral", "instrucoes": "Com água, após comer", "ativo": true,
  "regra": {"tipo": "INTERVALO", "intervaloHoras": 8, "primeiraDose": "06:00", "horarios": null, "inicio": "2026-11-07", "fim": "2026-11-14"}},
 {"id": 1, "nome": "Losartana", "dosagem": "50 mg", "via": "Oral", "instrucoes": null, "ativo": true,
  "regra": {"tipo": "HORARIOS_FIXOS", "intervaloHoras": null, "primeiraDose": null, "horarios": ["08:00", "20:00"], "inicio": "2026-10-14", "fim": null}}]
```
Campos da regra por tipo:
- `INTERVALO`: `intervaloHoras` (1 a 24) e `primeiraDose`;
- `HORARIOS_FIXOS`: `horarios`;
- `DIAS_ALTERNADOS`: `horarios`, a partir da data `inicio`.

### `POST /api/pacientes/{id}/medicamentos` (coord)
O mesmo formato, sem `id`. 201.

### `PUT /api/medicamentos/{id}` (coord) · `DELETE /api/medicamentos/{id}` (coord)
200 · 204.

### `GET /api/pacientes/{id}/doses?data=2026-11-13`
Gera as doses previstas do dia se ainda não existirem (sem duplicar).
```json
[{"id": 301, "medicamentoId": 1, "medicamentoNome": "Losartana", "dosagem": "50 mg",
  "previstoPara": "2026-11-13T08:00:00", "status": "DADA", "dadaEm": "2026-11-13T08:05:00", "dadaPorNome": "Marta Souza", "observacao": null}]
```

### `PUT /api/doses/{id}/dar`
`{"observacao": "Tomou com suco"}` (opcional) → 200 com a dose. O status fica `DADA` se for registrada até 30 min depois do previsto; senão, `ATRASADA`.
409 `{"erro": "Essa dose já foi registrada por Marta Souza"}`.

### `PUT /api/doses/{id}/nao-dar`
`{"motivo": "Recusou o remédio"}` (obrigatório) → 200 com `status: "NAO_DADA"`. 409 igual ao anterior.

---

## Sinais vitais

### `GET /api/pacientes/{id}/sinais?tipo=PRESSAO&de=2026-10-14&ate=2026-11-13`
```json
[{"id": 90, "tipo": "PRESSAO", "valor": 130.0, "valor2": 80.0, "medidoEm": "2026-11-13T10:00:00", "medidoPorNome": "Marta Souza"}]
```
Na pressão, `valor` é a sistólica e `valor2` a diastólica. Nos outros tipos, `valor2` é `null`.

### `POST /api/pacientes/{id}/sinais`
```json
{"tipo": "PRESSAO", "valor": 175, "valor2": 100, "medidoEm": "2026-11-13T10:05:00"}
```
`medidoEm` é opcional (padrão: agora). 201:
```json
{"id": 91, "tipo": "PRESSAO", "valor": 175.0, "valor2": 100.0, "medidoEm": "2026-11-13T10:05:00", "medidoPorNome": "Paulo Souza", "alerta": "FORA_DA_FAIXA"}
```
- `alerta` é `"FORA_DA_FAIXA"` (fora do mínimo ou máximo configurado), `"FORA_DA_CURVA"` (|z| > 2 em relação às medições anteriores do mesmo tipo, com pelo menos 7 medições) ou `null`. A faixa tem prioridade.
- 400 com valor ≤ 0.

### `GET /api/pacientes/{id}/faixas` · `PUT /api/pacientes/{id}/faixas` (coord)
```json
[{"tipo": "PRESSAO", "minimo": 90, "maximo": 150}, {"tipo": "GLICEMIA", "minimo": 70, "maximo": 180}]
```
O PUT recebe a lista inteira e devolve 200.

---

## Tarefas de cuidado

### `GET /api/pacientes/{id}/tarefas` · `POST` (coord)
```json
[{"id": 1, "titulo": "Mudar de posição", "orientacao": "Vire a pessoa de lado...", "recorrenciaHoras": 2, "primeiraVez": "06:00", "tipoSinal": null, "ativa": true},
 {"id": 4, "titulo": "Medir pressão", "orientacao": "Sentada, braço apoiado...", "recorrenciaHoras": 24, "primeiraVez": "10:00", "tipoSinal": "PRESSAO", "ativa": true}]
```
Com `tipoSinal` preenchido, a tarefa é uma **medição**: na tela Hoje, o botão é "Registrar" e abre o formulário de sinal vital.

### `PUT /api/tarefas/{id}` (coord) · `DELETE /api/tarefas/{id}` (coord)
200 · 204.

### `GET /api/pacientes/{id}/execucoes?data=2026-11-13`
Gera as execuções previstas do dia se ainda não existirem.
```json
[{"id": 700, "tarefaId": 1, "titulo": "Mudar de posição", "orientacao": "...", "tipoSinal": null,
  "previstaPara": "2026-11-13T16:00:00", "feitaEm": null, "feitaPorNome": null}]
```

### `PUT /api/execucoes/{id}/feita`
200 com a execução. 409 `{"erro": "Essa tarefa já foi feita por Ana Souza"}`.

---

## Bem-estar (Zarit)

As 12 perguntas e as 2 de sono ficam num arquivo estático, servido com as telas: `GET /dados/zarit-perguntas.json` (fora de `/api`).

### `POST /api/zarit`
```json
{"respostas": [2, 3, 1, 4, 2, 2, 3, 1, 2, 3, 2, 3], "horasSono": 5.5, "qualidadeSono": 2}
```
201: `{"id": 12, "pontuacao": 28, "faixa": "ALTA", "respondidaEm": "2026-11-13T21:10:00"}`.
400 se não forem exatamente 12 respostas, se alguma estiver fora de 0 a 4, ou se a qualidade do sono estiver fora de 1 a 5.

### `GET /api/zarit/minhas`
```json
{"avaliacoes": [{"id": 12, "pontuacao": 28, "faixa": "ALTA", "respondidaEm": "2026-11-13T21:10:00", "horasSono": 5.5, "qualidadeSono": 2}],
 "proximaSugerida": "2026-11-27"}
```
`proximaSugerida` = última + 14 dias (ou hoje, se nunca respondeu).

### `DELETE /api/zarit/{id}`
204. Só a própria pessoa.

### `POST /api/zarit/{id}/pedir-ajuda`
`{"pacienteIds": [1]}` → 200 `{"alertasCriados": 3}`. Cria um alerta `PEDIDO_AJUDA` para cada membro dessas redes (menos a própria pessoa).

---

## Hoje e alertas

### `GET /api/hoje?pacienteId=1`
`pacienteId` é opcional: sem ele, usa a primeira rede da pessoa.
```json
{"paciente": {"id": 1, "nome": "Lurdes Souza"},
 "turnoAtual": {"id": 10, "inicio": "2026-11-13T14:00:00", "fim": "2026-11-13T22:00:00"},
 "proximoTurno": null,
 "itens": [
   {"tipo": "DOSE", "id": 301, "horario": "2026-11-13T20:00:00", "titulo": "Donepezila 10 mg", "detalhe": "Oral", "status": "PENDENTE", "tipoSinal": null},
   {"tipo": "TAREFA", "id": 712, "horario": "2026-11-13T16:00:00", "titulo": "Mudar de posição", "detalhe": "Vire a pessoa de lado...", "status": "PENDENTE", "tipoSinal": null},
   {"tipo": "TAREFA", "id": 715, "horario": "2026-11-13T10:00:00", "titulo": "Medir pressão", "detalhe": "Sentada, braço apoiado...", "status": "FEITA", "tipoSinal": "PRESSAO"}],
 "alertas": [{"id": 40, "tipo": "TURNO_VAGO", "mensagem": "Domingo 22h–6h está sem ninguém", "prioridade": 60, "criadoEm": "...", "lido": false}]}
```
- Com turno em andamento, `itens` traz o que cai dentro do turno; sem turno, as pendências do dia, e `proximoTurno` é preenchido.
- O `status` de uma tarefa é `PENDENTE` ou `FEITA`.
- Os itens vêm em ordem de horário.

### `GET /api/alertas?pacienteId=1`
Calcula os alertas na hora (sem rotina em segundo plano) e devolve os não lidos, da maior prioridade para a menor:
```json
[{"id": 41, "tipo": "PEDIDO_AJUDA", "mensagem": "Marta Souza pediu ajuda à rede", "prioridade": 100, "criadoEm": "...", "lido": false}]
```
Quem recebe cada tipo está em [[Design da Solução]], seção 4.2.

### `PUT /api/alertas/{id}/lido`
204.

---

## Estatísticas

### `GET /api/pacientes/{id}/estatisticas?dias=30` (coord)
```json
{"periodoDias": 30,
 "adesao": {"geral": 0.89,
   "porMedicamento": [{"nome": "Losartana", "taxa": 0.92}],
   "porPeriodo": [{"periodo": "MANHA", "taxa": 0.95}, {"periodo": "NOITE", "taxa": 0.81}]},
 "cargaPorPessoa": [{"nome": "Marta Souza", "horas": 410.0, "percentual": 0.60}],
 "acimaDaMedia": ["Marta Souza"],
 "equilibrio": {"desvioPadrao": 31.4, "coeficienteVariacao": 0.78},
 "mediaMovelHoras": [{"nome": "Marta Souza", "serie": [{"data": "2026-11-12", "valor": 13.7}]}],
 "horasPorTurno": {"media": 8.0, "mediana": 8.0, "moda": 8.0},
 "horaComMaisAtrasos": 20,
 "chanceAtraso": {"noturno": 0.21, "diurno": 0.09},
 "zarit": {"compartilharam": 4, "total": 4, "media": 16.1, "mediana": 13.0, "moda": 6.0,
           "pearsonNoturnosZarit": 0.93, "pearsonNoturnosSono": -0.88}}
```
- Taxas de 0 a 1.
- `adesao`: doses dadas no horário ÷ doses previstas já vencidas.
- `chanceAtraso`: doses atrasadas ÷ doses de cada grupo; noturna = prevista entre 22:00 e 05:59.
- `zarit`: só as avaliações de quem compartilha com o coordenador.
- Correlações de Pearson: cada avaliação é um ponto (x = turnos noturnos da pessoa nos 14 dias antes; y = pontuação ou qualidade do sono).
- Valor indefinido (sem dados suficientes) = `null`.

---

## Demonstração

### `GET /api/demo/sql`
Os últimos 50 comandos SQL executados, o mais novo primeiro, com `?` no lugar dos valores:
```json
[{"quando": "2026-11-13T14:05:12", "tipo": "UPDATE", "sql": "UPDATE dose SET status = ?, dada_em = ?, dada_por = ? WHERE id = ? AND status = 'PENDENTE'", "ms": 38}]
```
