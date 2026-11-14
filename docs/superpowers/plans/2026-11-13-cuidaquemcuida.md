# CuidaQuemCuida — Plano de Construção

> **Para quem executa (pessoa ou IA):** execute as tarefas **na ordem**, marcando cada `- [ ]` como `- [x]` ao concluir. Agentes com o skill superpowers: use superpowers:executing-plans (ou subagent-driven-development). **A Parte A roda no PC sem Java; a Parte B roda em casa, no PC com IntelliJ.** Antes de começar, leia `AGENTS.md` na raiz e o documento de design.

**Objetivo:** construir o protótipo funcional do CuidaQuemCuida (sistema Java com API REST + telas web pensadas para celular + PostgreSQL no Supabase) e toda a documentação e os vídeos exigidos pelo edital da GS 2026.

**Arquitetura:** um único processo Java (Maven) sobe o Grizzly, que serve a API JAX-RS (Jersey) em `/api` e as telas estáticas em `/`. As telas são uma SPA em HTML, CSS e JS puros (módulos ES). Elas funcionam em **modo demonstração**, com dados em memória, quando servidas sem a API: é o que permite construir e testar as telas no PC sem Java. A persistência é por JDBC puro (`PreparedStatement`) no PostgreSQL do Supabase. As regras de negócio puras ficam em classes estáticas testáveis com JUnit.

**Stack:** Java 21, Maven, Jersey 3.1.5 + Grizzly 2, Jackson (com jsr310), driver JDBC do PostgreSQL 42.7.3, JUnit 5.10.2; HTML, CSS e JS sem framework; Chart.js 4.4.1 (CDN); Supabase (PostgreSQL), região São Paulo; documentação em Markdown no Obsidian, com diagramas em Mermaid.

**Spec:** `documentacao/03-especificacoes-tecnicas/Design da Solução.md` (aprovado em 13/11/2026). O edital está em `documentacao/04-outros-materiais/Edital GS 2026.md`. Este plano argumenta a partir do design: leia os dois.

## Restrições globais

- **Prazo:** entrega na plataforma FIAP ON até **19/11/2026**. Não existe entrega atrasada.
- **Equipe nos documentos:** **Luis** (Product Owner) e **Gabriel Vilela** (Scrum Master e validação). Nos arquivos entregáveis **não citar IA, Claude ou ferramenta de IA**. Commits sem linha de coautoria.
- **Datas sempre reais** em sprints, Kanban, commits e diário de desafios. Desafios técnicos só os que aconteceram de verdade.
- **Pacote Java:** `br.com.cuidaquemcuida`. As camadas usam os nomes do design: `model`, `dao`, `service`, `resource`, mais `infra`.
- **Fuso:** `America/Sao_Paulo` (o `App` define como padrão da JVM; os scripts SQL fazem `SET TIME ZONE 'America/Sao_Paulo';`). Colunas de data e hora são `timestamp` sem fuso.
- **JSON:** datas em ISO-8601 local (`2026-11-13T14:00:00`, `2026-11-13`). Erros sempre como `{"erro": "mensagem em português simples"}`. **Nunca** emitir `NaN`: valor estatístico indefinido vira `null`.
- **Acesso ao banco só pelo Java, via JDBC com `PreparedStatement`.** Não usar a API automática do Supabase. RLS ligado em todas as tabelas, sem política.
- **Senha do banco** só em `codigo/config.properties` (fora do Git) ou em variáveis de ambiente. Nunca em commit, nunca em documento.
- **Senhas dos usuários:** PBKDF2WithHmacSHA256, 600.000 iterações, salt de 16 bytes, hash de 32 bytes, os dois em Base64.
- **Limites (classe `Limites`):** folga ≥ 11 h; atenção > 44 h em 7 dias ou > 24 h seguidas; alerta > 60 h em 7 dias ou > 36 h seguidas; dose atrasada > 30 min; não dada sem registro após 120 min; z-score |z| > 2 com mínimo de 7 medições; Zarit a cada 14 dias; faixa Zarit ALTA > 20.
- **Períodos do dia:** MADRUGADA 00:00–05:59, MANHA 06:00–11:59, TARDE 12:00–17:59, NOITE 18:00–23:59. **Turno noturno:** cobre pelo menos 3 h entre 22:00 e 06:00.
- **Acessibilidade das telas:** texto base ≥ 18 px, alvo de toque ≥ 48 px, contraste AA, ícone sempre com texto, rótulo em todo campo, navegação por teclado, linguagem simples ("Dei o remédio").
- **Documentação:** tudo em `.md` no vault do Obsidian (pasta raiz `C:\CuidaQuemCuida`), com `[[links]]`. Uma nota por módulo, por classe e por função com regra de negócio. Getters e setters não ganham nota.
- **Fora do `.zip` de entrega:** `docs/`, `AGENTS.md`, `.superpowers/`, `.obsidian/`, `codigo/target/`, `codigo/config.properties`.
- **PC 1 (atual):** tem Node 26, Python 3.15, Git e Obsidian; **não tem Java** e não pode instalar. As verificações Java da Parte A ficam **adiadas para a Tarefa B2**.
- **Carimbo de auditoria do PC 1:** um hook local coloca o cabeçalho `[CLAUDE-CODE-AUDIT]` em arquivos `.js`, `.py` e `.ps1` gravados aqui. Ele é removido só no empacotamento (Tarefa B7).

## Foco de revisão

Situações que o design implica, mas que nenhum teste "óbvio" cobre. Cada uma tem teste na tarefa dona:

1. **Duas pessoas tocam "Dei o remédio" na mesma dose.** A segunda recebe 409 "Essa dose já foi registrada por {nome}", e a dose não é sobrescrita. → A7 (`DoseRegrasTest.naoRegistraDoseJaResolvida`) e A9 (UPDATE condicional), conferido em B4.
2. **Membro de uma rede tenta abrir paciente de outra rede trocando o id na URL.** Recebe 403. → A8 (`AutorizacaoTest`).
3. **Painel com poucos dados** (rede recém-criada, uma pessoa, ninguém compartilhou a Zarit). Não pode quebrar nem mostrar `NaN`: aparece "Dados insuficientes". → A7 (`EstatisticaTest` com listas vazias e n < 2) e A9 (`EstatisticaServiceTest.nanViraNull`).
4. **A tela de doses é aberta várias vezes no mesmo dia.** As doses previstas não podem duplicar. → A7 (`RegraHorarioTest.geracaoIdempotente`) e A3 (`UNIQUE(medicamento_id, previsto_para)` + `ON CONFLICT DO NOTHING`).
5. **Horários de fronteira** (05:59 e 06:00, 23:59 e 00:00) e turno que atravessa a meia-noite. → A7 (`PeriodoTest`, `TurnoTest`).

---

## Mapa de arquivos

```
C:\CuidaQuemCuida\
├── AGENTS.md                         contexto para qualquer IA/pessoa que continuar (fora do zip)
├── README.md                         o que é, como rodar (vai no zip)
├── .gitignore
├── docs/superpowers/plans/           este plano (fora do zip)
├── banco/
│   ├── 00-apagar-tabelas.sql
│   ├── 01-criar-tabelas.sql
│   ├── 02-ligar-rls.sql
│   └── 03-dados-demo.sql
├── codigo/
│   ├── pom.xml
│   ├── config.properties.exemplo
│   └── src/
│       ├── main/java/br/com/cuidaquemcuida/
│       │   ├── App.java
│       │   ├── infra/      Config, Conexao, Sql, LogSql, Senha, JsonConfig, ApiException, ErroMapper, AuthFilter, Autorizacao
│       │   ├── model/      classes do domínio + model/alerta/
│       │   ├── service/    regras puras (Limites, Estatistica, EscalaRegras, DoseRegras, SinalVitalRegras, ZaritCalculadora) + *Service
│       │   ├── dao/        *Dao
│       │   └── resource/   *Resource + resource/dto/
│       ├── main/resources/web/
│       │   ├── index.html
│       │   ├── css/estilo.css
│       │   ├── dados/zarit-perguntas.json
│       │   └── js/  api.js, demo.js, app.js, ui.js, telas/*.js
│       └── test/java/br/com/cuidaquemcuida/   testes JUnit
├── documentacao/
│   ├── Mapa do Projeto.md
│   ├── 01-diagramas/
│   ├── 02-wireframes/
│   ├── 03-especificacoes-tecnicas/  (Design da Solução.md já existe) + modulos/ classes/ funcoes/
│   └── 04-outros-materiais/         (Edital GS 2026.md já existe) + agil/
└── videos/   Roteiro - Pitch.md, Roteiro - Técnico.md, links.txt
```

---

# PARTE A — No PC 1 (sem Java)

### Tarefa A1: Repositório, vault e arquivos de orientação

**Arquivos:**
- Criar: `.gitignore`, `README.md`, `AGENTS.md`, `documentacao/Mapa do Projeto.md`, `documentacao/04-outros-materiais/agil/Kanban.md`, `documentacao/04-outros-materiais/agil/Sprint 0 - Planejamento.md`
- Alterar: `documentacao/03-especificacoes-tecnicas/Design da Solução.md` (na árvore da seção 14, trocar `00-Mapa do Projeto.md` por `Mapa do Projeto.md`)

**Interfaces:**
- Produz: a estrutura de pastas do mapa acima, e o `AGENTS.md` que as tarefas seguintes atualizam na seção "Estado atual".

- [x] **Passo 1:** criar as pastas do mapa de arquivos (as que ainda não existem).
- [x] **Passo 2:** `.gitignore` com: `codigo/target/`, `codigo/config.properties`, `.superpowers/`, `.obsidian/workspace*.json`, `*.class`, `.idea/`, `*.iml`.
- [x] **Passo 3:** `README.md` (vai no zip; **não cita IA**), com:
  - o que é (2 linhas e o slogan);
  - a equipe (Luis e Gabriel Vilela, turma 2SIOA);
  - as tecnologias;
  - a seção "Como rodar": pré-requisitos (JDK 21 e Maven, ou IntelliJ), criar as tabelas rodando `banco/00` a `03` num PostgreSQL, copiar `config.properties.exemplo` para `config.properties` e preencher, `mvn test`, `mvn exec:java`, abrir `http://localhost:8080`;
  - os logins de demonstração (`marta@demo.cqc`, `paulo@demo.cqc`, `ana@demo.cqc`, `joao@demo.cqc`, todos com a senha `demo1234`);
  - o modo demonstração das telas sem a API.
- [x] **Passo 4:** `AGENTS.md` (fora do zip), com:
  - o contexto em 10 linhas (GS 2026, CitizenTech, prazo, equipe e papéis);
  - **regras invioláveis**: as restrições globais acima, em especial não citar IA nos entregáveis, datas reais e não inventar desafios;
  - onde está cada coisa (design, edital, plano, código, banco, documentação);
  - como continuar (abrir este plano e seguir o primeiro `- [ ]` não marcado);
  - a seção **"Estado atual"**, atualizada ao fim de cada tarefa, com data e o que foi feito.
- [x] **Passo 5:** `Mapa do Projeto.md`, a nota-índice com `[[links]]`:
  - para o design, o edital e cada pasta;
  - para as notas futuras (API, Regras de Negócio, Estatística, Escala Zarit, Diagrama do Banco, Diagrama de Classes, Arquitetura, Casos de Uso, Wireframes, Personas, Problema e Evidências, Concorrentes, ODS, LGPD, Testes e Validação, Métodos Ágeis, Kanban, Diário de Desafios, Registro de Decisões, Conteúdos do Curso, roteiros).
- [x] **Passo 6:** `Kanban.md`, com as colunas `## A fazer`, `## Fazendo`, `## Feito` em listas de tarefas. Um cartão por tarefa deste plano, no formato `- [ ] A3 Banco — resp.: Gabriel — aprovado por: Luis — início: 13/11`. Datas reais. `Sprint 0 - Planejamento.md`: o que foi feito em 13/11 (design, pesquisa de concorrentes, esboços, backlog) e a fase de descoberta (~09/11 a 12/11).
- [x] **Passo 7:** `git init` na raiz. Conferir `git config user.name` e `git config user.email`. Se estiverem vazios, **perguntar ao usuário** o nome e o e-mail a usar neste repositório e gravar com `git config` local (sem `--global`).
- [x] **Passo 8 — Verificar:** `git status` lista os arquivos novos e **não** lista `.superpowers/`.
- [x] **Passo 9:** commit: `git add -A && git commit -m "chore: estrutura do projeto, README e mapa da documentação"`.

### Tarefa A2: Contrato da API

**Arquivos:**
- Criar: `documentacao/03-especificacoes-tecnicas/API.md`

**Interfaces:**
- Produz: o contrato que as telas (A4 a A6, incluindo o `demo.js`) e o Java (A9) seguem **exatamente**. Uma mudança aqui exige mudar os dois lados.

- [x] **Passo 1:** escrever o `API.md` com as regras gerais:
  - base `/api`;
  - cabeçalho `Authorization: Bearer <token>` em toda rota, menos as marcadas como pública;
  - códigos 200, 201, 204, 400 (dado inválido), 401 (sem login), 403 (sem permissão), 404, 409 (conflito ou já registrado);
  - formato de erro e de datas das restrições globais;
  - "(coord)" quer dizer que só o coordenador daquele paciente pode usar.
- [x] **Passo 2:** documentar cada rota com um exemplo de JSON de entrada e de saída, usando estes campos (os nomes são obrigatórios):

| Rota | Entrada → Saída |
|---|---|
| `GET /api/saude` (pública) | → `{"ok":true}` |
| `POST /api/auth/login` (pública) | `{email,senha}` → `{token, pessoa:{id,nome,email}}`; 401 "E-mail ou senha incorretos" |
| `POST /api/auth/logout` | → 204 |
| `POST /api/pessoas` (pública) | `{nome,email,senha,telefone?,dataNascimento?,genero?,aceiteTermo:true,versaoTermo:"1.0"}` → 201 `{id,nome,email}`; 409 e-mail já usado; 400 sem aceite ou senha < 8 caracteres |
| `GET /api/pessoas/eu` | → `{id,nome,email,telefone,dataNascimento,genero,redes:[{pacienteId,pacienteNome,papel,vinculo,compartilhaZarit}]}` |
| `DELETE /api/pessoas/eu` | → 204 (anonimiza); 409 "Passe a coordenação a outro membro antes" |
| `GET /api/pacientes` | → `[{id,nome,condicao,papel}]` |
| `POST /api/pacientes` | `{nome,dataNascimento,condicao,precisa24h,observacoes,responsavelNome,responsavelParentesco,declaracaoAutorizacao:true}` → 201 `{id,nome,codigoConvite}` (quem cria vira COORDENADOR) |
| `GET /api/pacientes/{id}` | → paciente completo; o `codigoConvite` só aparece para o coord |
| `PUT /api/pacientes/{id}` (coord) | mesmos campos do POST, menos a declaração → 200 |
| `DELETE /api/pacientes/{id}` (coord) | → 204 |
| `POST /api/pacientes/entrar` | `{codigo,vinculo}` → 200 `{pacienteId,pacienteNome}`; 404 código inválido; 409 já é membro |
| `POST /api/pacientes/{id}/convite` (coord) | → `{codigoConvite}` (novo código) |
| `GET /api/pacientes/{id}/membros` | → `[{pessoaId,nome,papel,vinculo,horas7d}]` |
| `PUT /api/pacientes/{id}/membros/{pessoaId}` (coord) | `{papel}` → 200 |
| `DELETE /api/pacientes/{id}/membros/{pessoaId}` (coord) | → 204 |
| `PUT /api/pacientes/{id}/compartilhar-zarit` | `{compartilha:true}` → 200 (vale para a pessoa logada naquela rede) |
| `GET /api/pacientes/{id}/turnos?de=AAAA-MM-DD&ate=AAAA-MM-DD` | → `[{id,pessoaId,pessoaNome,inicio,fim,status,noturno}]` (`pessoaId` null = vago) |
| `POST /api/pacientes/{id}/turnos` (coord) | `{pessoaId?,inicio,fim}` → 201 turno; 400 fim ≤ início; 409 `{erro,conflitos:[{id,inicio,fim}]}` |
| `PUT /api/turnos/{id}` (coord) | `{pessoaId?,inicio,fim,status}` → 200; 409 igual ao POST |
| `DELETE /api/turnos/{id}` (coord) | → 204 |
| `POST /api/turnos/{id}/assumir` | → 200 turno; 409 já ocupado ou conflito |
| `GET /api/turnos/{id}/sugestoes` | → `[{pessoaId,nome,horas7d}]`, do menos para o mais carregado |
| `GET /api/pacientes/{id}/escala/analise?de&ate` | → `{conflitos:[{turnoA,turnoB}], vagos:[{inicio,fim}], sobrecarga:[{pessoaId,nome,horas7d,horasSeguidas,nivel}]}`, com `nivel` em OK, ATENCAO ou ALERTA |
| `GET /api/pacientes/{id}/medicamentos` | → `[{id,nome,dosagem,via,instrucoes,ativo,regra:{tipo,intervaloHoras,primeiraDose,horarios,inicio,fim}}]`, com `horarios` como `["08:00","20:00"]` |
| `POST /api/pacientes/{id}/medicamentos` (coord) | mesmo formato, sem id → 201 |
| `PUT /api/medicamentos/{id}` (coord) · `DELETE` (coord) | → 200 · 204 |
| `GET /api/pacientes/{id}/doses?data=AAAA-MM-DD` | gera as doses do dia se faltarem → `[{id,medicamentoId,medicamentoNome,dosagem,previstoPara,status,dadaEm,dadaPorNome,observacao}]` |
| `PUT /api/doses/{id}/dar` | `{observacao?}` → 200 dose; 409 "Essa dose já foi registrada por {nome}" |
| `PUT /api/doses/{id}/nao-dar` | `{motivo}` (obrigatório) → 200 dose; 409 igual |
| `GET /api/pacientes/{id}/sinais?tipo&de&ate` | → `[{id,tipo,valor,valor2,medidoEm,medidoPorNome}]` |
| `POST /api/pacientes/{id}/sinais` | `{tipo,valor,valor2?,medidoEm?}` → 201 `{...sinal, alerta}`, com `alerta` em `"FORA_DA_FAIXA"`, `"FORA_DA_CURVA"` ou `null`; 400 valor ≤ 0 |
| `GET /api/pacientes/{id}/faixas` · `PUT` (coord) | → `[{tipo,minimo,maximo}]` · mesma lista → 200 |
| `GET /api/pacientes/{id}/tarefas` · `POST` (coord) | → `[{id,titulo,orientacao,recorrenciaHoras,primeiraVez,tipoSinal,ativa}]` (`tipoSinal` null = tarefa comum) |
| `PUT /api/tarefas/{id}` (coord) · `DELETE` (coord) | → 200 · 204 |
| `GET /api/pacientes/{id}/execucoes?data` | gera as do dia se faltarem → `[{id,tarefaId,titulo,orientacao,previstaPara,feitaEm,feitaPorNome}]` |
| `PUT /api/execucoes/{id}/feita` | → 200; 409 já feita |
| `POST /api/zarit` | `{respostas:[12 inteiros de 0 a 4],horasSono?,qualidadeSono?}` → 201 `{id,pontuacao,faixa,respondidaEm}`; 400 tamanho ou valor inválido |
| `GET /api/zarit/minhas` | → `[{id,pontuacao,faixa,respondidaEm,horasSono,qualidadeSono}]` + `proximaSugerida` |
| `DELETE /api/zarit/{id}` | → 204 (só a própria pessoa) |
| `POST /api/zarit/{id}/pedir-ajuda` | `{pacienteIds:[...]}` → 200; gera um alerta PEDIDO_AJUDA para cada membro dessas redes |
| `GET /api/hoje?pacienteId` | → `{paciente:{id,nome}, turnoAtual, proximoTurno, itens:[{tipo,id,horario,titulo,detalhe,status,tipoSinal}], alertas:[...]}`, com `tipo` em DOSE ou TAREFA. Uma tarefa com `tipoSinal` (por exemplo, "Medir pressão") é uma medição: o botão vira "Registrar", e a execução fica feita quando o sinal é gravado |
| `GET /api/alertas?pacienteId` | → `[{id,tipo,mensagem,prioridade,criadoEm,lido}]`, da maior prioridade para a menor |
| `PUT /api/alertas/{id}/lido` | → 204 |
| `GET /api/pacientes/{id}/estatisticas?dias=30` (coord) | → `{adesao:{geral,porMedicamento:[{nome,taxa}],porPeriodo:[{periodo,taxa}]}, cargaPorPessoa:[{nome,horas,percentual}], acimaDaMedia:[nome], equilibrio:{desvioPadrao,coeficienteVariacao}, mediaMovelHoras:[{nome,serie:[{data,valor}]}], horasPorTurno:{media,mediana,moda}, horaComMaisAtrasos, chanceAtraso:{noturno,diurno}, zarit:{compartilharam,total,media,mediana,moda,pearsonNoturnosZarit,pearsonNoturnosSono}}`. Taxas de 0 a 1. Indefinido = `null` |
| `GET /api/demo/sql` | → `[{quando,tipo,sql,ms}]`, os últimos 50 (SQL com `?` no lugar dos valores) |

- [x] **Passo 3 — Verificar:** cada linha da tabela da seção 9 do design tem rota aqui, e cada tela da seção 10 tem as rotas de que precisa.
- [x] **Passo 4:** commit `docs: contrato da API`.

### Tarefa A3: Banco de dados (scripts e diagrama planejado)

**Arquivos:**
- Criar: `banco/00-apagar-tabelas.sql`, `banco/01-criar-tabelas.sql`, `banco/02-ligar-rls.sql`, `banco/03-dados-demo.sql`, `documentacao/01-diagramas/Diagrama do Banco.md`
- Auxiliar (fora do repositório, na pasta temporária): script que gera o hash PBKDF2 de `demo1234`, com auditoria normal

**Interfaces:**
- Produz: as tabelas e colunas abaixo, que o Java (A8 e A9) usa pelos mesmos nomes.

- [x] **Passo 1:** `01-criar-tabelas.sql`, começando com `SET TIME ZONE 'America/Sao_Paulo';`. Todas as chaves são `bigserial`, salvo indicação. Todo `CHECK` de domínio usa exatamente estes valores:

| Tabela | Colunas e restrições |
|---|---|
| `pessoa` | id; nome varchar(120) NN; email varchar(160) NN UNIQUE; senha_hash varchar(64) NN; senha_salt varchar(32) NN; telefone varchar(20); data_nascimento date; genero varchar(20) CHECK (FEMININO, MASCULINO, OUTRO, NAO_INFORMAR); ativo boolean NN default true; criado_em timestamp default now() |
| `paciente` | id; nome varchar(120) NN; data_nascimento date; condicao varchar(200); precisa_24h boolean NN default false; observacoes text; responsavel_nome varchar(120) NN; responsavel_parentesco varchar(40) NN; codigo_convite char(6) NN UNIQUE; criado_em timestamp default now() |
| `membro_rede` | pessoa_id FK pessoa; paciente_id FK paciente ON DELETE CASCADE; papel CHECK (COORDENADOR, MEMBRO); vinculo CHECK (FAMILIAR, VIZINHO, AMIGO, OUTRO); ativo boolean default true; compartilha_zarit boolean default false; desde timestamp default now(); PK (pessoa_id, paciente_id) |
| `consentimento` | id; pessoa_id FK; paciente_id FK NULL ON DELETE CASCADE; tipo CHECK (TERMO_USUARIO, DADOS_PACIENTE); versao_termo varchar(10) NN; responsavel_nome varchar(120); aceito_em timestamp default now() |
| `sessao` | token varchar(64) PK; pessoa_id FK ON DELETE CASCADE; expira_em timestamp NN |
| `turno` | id; paciente_id FK CASCADE; pessoa_id FK NULL; inicio timestamp NN; fim timestamp NN; status CHECK (PLANEJADO, REALIZADO, CANCELADO) default PLANEJADO; CHECK (fim > inicio) |
| `medicamento` | id; paciente_id FK CASCADE; nome varchar(120) NN; dosagem varchar(60); via varchar(40); instrucoes varchar(300); ativo boolean default true |
| `regra_horario` | id; medicamento_id FK CASCADE UNIQUE; tipo CHECK (INTERVALO, HORARIOS_FIXOS, DIAS_ALTERNADOS); intervalo_horas int CHECK 1..24; primeira_dose time; horarios varchar(100) (formato `08:00;20:00`); inicio date NN; fim date |
| `dose` | id; medicamento_id FK CASCADE; previsto_para timestamp NN; dada_em timestamp; dada_por FK pessoa; status CHECK (PENDENTE, DADA, ATRASADA, NAO_DADA) default PENDENTE; observacao varchar(200); UNIQUE (medicamento_id, previsto_para) |
| `sinal_vital` | id; paciente_id FK CASCADE; tipo CHECK (PRESSAO, GLICEMIA, TEMPERATURA, SATURACAO, FREQUENCIA_CARDIACA); valor numeric(6,2) NN CHECK > 0; valor2 numeric(6,2); medido_em timestamp NN; medido_por FK pessoa |
| `faixa_sinal` | paciente_id FK CASCADE; tipo (mesmo CHECK); minimo numeric(6,2); maximo numeric(6,2); PK (paciente_id, tipo) |
| `tarefa_cuidado` | id; paciente_id FK CASCADE; titulo varchar(120) NN; orientacao text; recorrencia_horas int CHECK 1..24; primeira_vez time NN; tipo_sinal (mesmo CHECK de `sinal_vital.tipo`, NULL = tarefa comum); ativa boolean default true |
| `execucao_tarefa` | id; tarefa_id FK CASCADE; prevista_para timestamp NN; feita_em timestamp; feita_por FK pessoa; UNIQUE (tarefa_id, prevista_para) |
| `avaliacao_zarit` | id; pessoa_id FK CASCADE; respondida_em timestamp default now(); pontuacao int CHECK 0..48; faixa CHECK (BAIXA, MODERADA, ALTA); horas_sono numeric(4,1); qualidade_sono int CHECK 1..5 |
| `resposta_zarit` | avaliacao_id FK CASCADE; item int CHECK 1..12; valor int CHECK 0..4; PK (avaliacao_id, item) |
| `alerta` | id; paciente_id FK CASCADE; destinatario_id FK pessoa CASCADE; tipo CHECK (DOSE_PROXIMA, DOSE_ATRASADA, DOSE_NAO_DADA, TAREFA_ATRASADA, SINAL_FORA_FAIXA, SINAL_FORA_CURVA, TURNO_VAGO, CONFLITO_TURNO, SOBRECARGA, PEDIDO_AJUDA); referencia varchar(60) NN; mensagem varchar(200) NN; prioridade int NN; criado_em timestamp default now(); lido_em timestamp; UNIQUE (tipo, referencia, destinatario_id) |
| `auditoria` | id; pessoa_id FK NULL; acao CHECK (INSERIR, ALTERAR, EXCLUIR, LOGIN); tabela varchar(40) NN; registro_id bigint; quando timestamp default now(); detalhe varchar(300) |

  Índices: `turno(paciente_id, inicio)`, `turno(pessoa_id, inicio)`, `dose(previsto_para)`, `sinal_vital(paciente_id, tipo, medido_em)`, `alerta(destinatario_id, lido_em)`, `execucao_tarefa(prevista_para)`.
- [x] **Passo 2:** `00-apagar-tabelas.sql`: `DROP TABLE IF EXISTS ... CASCADE` das 17 tabelas, na ordem inversa. `02-ligar-rls.sql`: `ALTER TABLE <t> ENABLE ROW LEVEL SECURITY;` nas 17, **sem nenhuma política**. Um comentário no topo explica: fecha a API automática do Supabase para a chave pública; o Java entra com o usuário dono das tabelas (`postgres`), a quem o RLS não se aplica.
- [x] **Passo 3:** gerar, com o script auxiliar na pasta temporária, o salt e o hash de `demo1234` (PBKDF2WithHmacSHA256, 600.000 iterações, salt de 16 bytes, saída de 32 bytes, Base64). Anotar os dois valores, que vão no seed e no `SenhaTest` (A8).
- [x] **Passo 4:** `03-dados-demo.sql`, começando com `SET TIME ZONE 'America/Sao_Paulo';`. **Determinístico** e com datas relativas a `CURRENT_DATE`, para sempre parecer atual ao resetar. Sem `random()`: a variação vem de expressões fixas sobre a data e o id. O conteúdo:
  - **Pessoas** (as 4 com o hash do Passo 3):
    - Marta Souza, 58, FEMININO, `marta@demo.cqc`;
    - Paulo Souza, 54, MASCULINO, `paulo@demo.cqc`;
    - Ana Souza, 24, FEMININO, `ana@demo.cqc`;
    - João Pereira, 67, MASCULINO, `joao@demo.cqc`.
  - **Paciente:** Lurdes Souza, 82 anos, "Alzheimer moderado, acamada parcialmente", `precisa_24h` true, responsável legal Marta Souza (filha), código `LURD26`.
  - **Rede:** Marta é COORDENADOR (FAMILIAR); Paulo e Ana são MEMBRO (FAMILIAR); João é MEMBRO (VIZINHO). Todos com `compartilha_zarit` true. Um consentimento TERMO_USUARIO por pessoa e um DADOS_PACIENTE declarado por Marta.
  - **Escala** (padrão semanal, de `CURRENT_DATE - 30` até `CURRENT_DATE + 7`; os turnos passados ficam REALIZADO):
    - 06–14: Marta todos os dias;
    - 14–22: Paulo seg, qua e sex; Ana ter e qui; Marta sáb e dom;
    - 22–06: Marta seg, ter e qua; João qui; Ana sex; Paulo sáb; **domingo vago** (sem linha de turno).
    
    O resultado esperado: Marta com cerca de 96 h por semana (cerca de 60% da carga) e sem 11 h de folga entre sábado e quinta.
  - **Medicamentos e regras:**
    - Losartana 50 mg (HORARIOS_FIXOS `08:00;20:00`);
    - Donepezila 10 mg (HORARIOS_FIXOS `20:00`);
    - Omeprazol 20 mg (HORARIOS_FIXOS `07:00`);
    - Vitamina D 7.000 UI (DIAS_ALTERNADOS `09:00`, início em `CURRENT_DATE - 30`);
    - Amoxicilina 500 mg (INTERVALO de 8 h, primeira dose 06:00, de `CURRENT_DATE - 6` a `CURRENT_DATE + 1`).
  - **Doses passadas** (`generate_series` até agora), com status por uma regra fixa:
    - `(dia_do_ano*7 + medicamento_id*13 + hora) % 20 = 0` → NAO_DADA;
    - `< 3` → ATRASADA (dada 45 a 90 min depois);
    - nos horários 20:00 e 22:00, `< 5` → ATRASADA, para a noite ter mais atrasos;
    - o resto DADA, entre 0 e 20 min depois.
    
    `dada_por` é a pessoa do turno que cobre o horário (junção com `turno`). As doses futuras ficam PENDENTE.
  - **Faixas:** pressão (sistólica) de 90 a 150; glicemia de 70 a 180; temperatura de 35,5 a 37,8; saturação de 92 a 100; frequência cardíaca de 50 a 110.
  - **Sinais:** pressão diária às 10:00, por volta de 125–135 / 78–85 (variação fixa pelo dia), e glicemia diária às 07:30, de 95 a 130. **Um valor fora da curva há 2 dias:** pressão 175/100.
  - **Tarefas:**
    - "Mudar de posição" (a cada 2 h, a partir das 06:00; orientação de 3 linhas sobre prevenir escara);
    - "Oferecer água" (a cada 3 h, a partir das 07:00);
    - "Higiene e troca" (a cada 24 h, às 08:00);
    - "Medir pressão" (a cada 24 h, às 10:00, `tipo_sinal` PRESSAO);
    - "Medir glicemia" (a cada 24 h, às 07:30, `tipo_sinal` GLICEMIA).
    
    Execuções feitas nos últimos 3 dias, com uma ou outra faltando.
  - **Zarit:** duas avaliações por pessoa, em `CURRENT_DATE - 20` e em `CURRENT_DATE - 6`, com as 12 respostas somando:

| Pessoa | Pontuação (1ª e 2ª) | Faixa | Qualidade do sono |
|---|---|---|---|
| Marta | 30 e 34 | ALTA | 2 e 1 |
| Ana | 14 e 15 | MODERADA | 3 e 3 |
| Paulo | 11 e 12 | MODERADA | 4 e 4 |
| João | 7 e 6 | BAIXA | 5 e 4 |

- [x] **Passo 5:** `Diagrama do Banco.md` com um `erDiagram` Mermaid das 17 tabelas e cardinalidades. No topo: "Versão 1 (planejada) — 13/11/2026. O DER final é gerado do banco real pelo DBeaver (Tarefa B5)". Links para [[Design da Solução]] e [[API]].
- [ ] **Passo 6 — Verificar:** se o projeto Supabase já existir, o usuário roda 00, 01, 02 e 03 no SQL Editor, nessa ordem, sem erro, e confere:
  - `select count(*) from pessoa` = 4;
  - `select count(*) from turno where pessoa_id is null` = 0 (domingo vago é ausência de turno);
  - `select status, count(*) from dose group by status` mostra DADA, ATRASADA, NAO_DADA e PENDENTE.
  
  Se o projeto ainda não existir, essa verificação passa para a B3.
- [x] **Passo 7:** commit `feat(banco): tabelas, RLS e dados de demonstração`.

### Tarefa A4: Telas — base, login, cadastro e modo demonstração

**Arquivos:**
- Criar: `codigo/src/main/resources/web/index.html`, `css/estilo.css`, `js/api.js`, `js/demo.js`, `js/ui.js`, `js/app.js`, `js/telas/login.js`, `js/telas/cadastros.js`

**Interfaces:**
- Consome: o contrato da A2.
- Produz:
  - `api.js`: `export const MODO` (`'api'` quando `location.port === '8080'`, senão `'demo'`; o parâmetro `?modo=demo` ou `?modo=api` força);
  - `export async function chamar(metodo, caminho, corpo)`, que devolve o JSON ou lança `Error` com a mensagem do campo `erro`, guarda e envia o token (`sessionStorage`) e, no 401, manda para `#/login`;
  - `demo.js`: `export async function responder(metodo, caminho, corpo)`, que implementa **as mesmas rotas e formatos** da A2 sobre dados em memória com a mesma família do seed. As estatísticas são fixas, e os GETs refletem as mutações em memória;
  - `ui.js`: `el(tag, atributos, ...filhos)`, `mostrarErro(msg)`, `mostrarAviso(msg)`, `formatarHora(iso)`, `formatarData(iso)`;
  - `app.js`: roteador por hash, `registrarTela(rota, funcaoRender)`, barra de alertas no topo, barra inferior (Hoje · Escala · Bem-estar · Mais) e seletor de paciente quando houver mais de uma rede.

- [x] **Passo 1:** `index.html` com `lang="pt-BR"`, viewport para celular, título "CuidaQuemCuida", Chart.js 4.4.1 por CDN (`https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js`) e `<script type="module" src="js/app.js">`. No modo demo, mostra a faixa "Modo demonstração — dados de exemplo".
- [x] **Passo 2:** `estilo.css`, pensado primeiro para o celular, com variáveis em `:root`: cor principal verde-azulada calma, fundo claro, texto de alto contraste, cores de alerta (vermelho, amarelo), raio, espaçamentos, fonte base de 18 px e `min-height: 48px` em botões e campos. A partir de 900 px, a barra inferior vira menu lateral e o conteúdo fica centralizado (máximo de 720 px). Foco visível nos elementos.
- [x] **Passo 3:** `api.js`, `demo.js`, `ui.js` e `app.js` conforme as interfaces. Rotas registradas nesta tarefa:
  - `#/login`;
  - `#/cadastro` (com o termo de consentimento destacado e a caixa "Li e aceito", obrigatória);
  - `#/novo-paciente` (com responsável legal, parentesco e a declaração de autorização, obrigatória);
  - `#/entrar-rede` (código e vínculo).
  
  Depois do login: sem rede, vai para a escolha entre "Cadastrar paciente" e "Entrar com código"; com rede, vai para `#/hoje`.
- [x] **Passo 4 — Verificar sintaxe:** `node --check` em cada `.js` (todos sem erro).
- [x] **Passo 5 — Verificar no navegador:** servir com `python -m http.server 8000 --directory codigo/src/main/resources/web` (em segundo plano) e abrir `http://localhost:8000`. Se possível, capturar com o Edge sem janela, em 390×844, e conferir a imagem:
  - login com `marta@demo.cqc` / `demo1234` entra;
  - a faixa de demonstração aparece;
  - o cadastro sem aceite mostra o erro;
  - nada passa da largura da tela no celular.
- [x] **Passo 6:** commit `feat(telas): base, login, cadastro e modo demonstração`.

### Tarefa A5: Telas — Hoje, Escala e Bem-estar

**Arquivos:**
- Criar: `js/telas/hoje.js`, `js/telas/escala.js`, `js/telas/bem-estar.js`, `dados/zarit-perguntas.json`, `documentacao/03-especificacoes-tecnicas/Escala Zarit.md`

**Interfaces:**
- Consome: `chamar`, `el`, `registrarTela` (A4) e as rotas da A2.

- [x] **Passo 1: `#/hoje`** (base: o esboço aprovado):
  - alertas no topo, com botão "Posso assumir" no turno vago;
  - "Seu turno 14h–20h" ou, sem turno, "Seu próximo turno: ...";
  - a linha do tempo dos itens do `GET /api/hoje`, cada um com um botão: "Dei o remédio" (`PUT /doses/{id}/dar`), "Não foi dado" (pede o motivo), "Feito" (tarefa comum, `PUT /execucoes/{id}/feita`), "Registrar" (tarefa com `tipoSinal`: abre o formulário de sinal vital já com o tipo e, ao salvar, marca a execução como feita);
  - "como fazer" expande a orientação da tarefa;
  - no 409, mostra a mensagem do servidor.
- [x] **Passo 2: `#/escala`:**
  - semana com ◀ ▶ e os turnos por dia;
  - vago em vermelho tracejado com "Assumir";
  - o resultado de `/escala/analise` em avisos amarelos (sobrecarga, com a sugestão vinda de `/turnos/{id}/sugestoes`) e vermelhos (conflito);
  - "+ Novo turno" (só para o coordenador), com pessoa ou vago, data, início e fim. Turno que atravessa a meia-noite é permitido: o fim no dia seguinte é calculado quando o fim é menor que o início.
- [x] **Passo 3: `zarit-perguntas.json`:** `[{"item":1,"texto":"..."} ... 12]` com os itens da **ZBI-12** (Bédard et al., 2001) no texto da **tradução brasileira validada** (Scazufca, 2002, SciELO, acesso aberto). Buscar a fonte e copiar o texto exato. Se não conseguir confirmar algum item, gravar o texto com o prefixo `[CONFERIR]` e listá-lo em B4. Opções de resposta: Nunca (0), Raramente (1), Algumas vezes (2), Frequentemente (3), Sempre (4). Mais 2 perguntas de sono, fora da pontuação: "Quantas horas você dormiu por noite, em média, nesta semana?" e "Como foi a qualidade do seu sono?" (de 1, muito ruim, a 5, muito boa).
- [x] **Passo 4: `#/bem-estar`:**
  - "Só você vê" no topo;
  - a última pontuação, a próxima data sugerida e o histórico (`/zarit/minhas`);
  - "Responder agora": uma pergunta por vez, com "Pergunta N de 12" e voltar; depois as 2 de sono; envio por `POST /api/zarit`;
  - resultado com a faixa explicada em linguagem simples;
  - se ALTA: o bloco "Você não está sozinha(o)", com CVV 188 (ligação gratuita, 24 h), "Procure a UBS de referência" e "CAPS da sua cidade", e o botão "Pedir ajuda à rede";
  - interruptor "Compartilhar minha pontuação com o coordenador", por rede (`PUT /compartilhar-zarit`).
- [x] **Passo 5:** `Escala Zarit.md`: o que é, a fonte (Scazufca 2002; ZBI-12 de Bédard 2001; estudo brasileiro de 2019), as faixas usadas (BAIXA 0–10, MODERADA 11–20, ALTA 21–48, com a fonte da faixa alta), a nota de direitos autorais (uso acadêmico sem financiamento) e a privacidade (dois consentimentos).
- [x] **Passo 6 — Verificar:** `node --check` nos 3 arquivos novos. No navegador (modo demo, logado como Paulo):
  - "Dei o remédio" muda o item para dado;
  - a Escala mostra o domingo 22–06 vago;
  - a Zarit respondida até o fim com respostas altas mostra o bloco do CVV.
- [x] **Passo 7:** commit `feat(telas): Hoje, Escala e Bem-estar`.

### Tarefa A6: Telas — Mais, painel, LGPD e Banco ao vivo

**Arquivos:**
- Criar: `js/telas/mais.js`, `js/telas/painel.js`

- [x] **Passo 1: `#/mais`**, uma lista de entradas:
  - Painel da rede (só para o coordenador);
  - Paciente e remédios;
  - Pessoas da rede;
  - Sinais vitais;
  - Tarefas de cuidado;
  - Dados coletados;
  - Banco ao vivo;
  - Minha conta;
  - Sair.
- [x] **Passo 2:** subtelas, todas com criar, editar e excluir quando a rota permite:
  - **Paciente e remédios:** o formulário de remédio troca os campos pelo tipo de regra (intervalo: horas e primeira dose; horários fixos: lista de horas; dias alternados: horas e início).
  - **Pessoas da rede:** membros com papel e horas na semana; código de convite com "Gerar novo" (coordenador); mudar o papel e remover (coordenador).
  - **Sinais vitais:** registrar; gráfico de linha por tipo nos últimos 30 dias (Chart.js), com a faixa desenhada; os pontos fora da faixa ou da curva destacados.
  - **Tarefas de cuidado:** CRUD.
  - **Minha conta:** meus dados, e "Excluir minha conta" com confirmação explicando a anonimização.
- [x] **Passo 3: `#/mais/painel`** (`painel.js`), na ordem:
  - cartões de adesão geral, doses atrasadas e "N de M compartilharam a Zarit";
  - barras de "Quem carrega o cuidado" (%);
  - linha da média móvel de 7 dias das horas por pessoa;
  - barras de adesão por período;
  - "Chance de atraso: noite X% × dia Y%";
  - média, mediana e moda das horas por turno e da Zarit;
  - as correlações, com a interpretação em palavras ("forte e positiva: quem faz mais noites tende a ter mais sobrecarga");
  - equilíbrio da rede (desvio padrão e coeficiente de variação).
  
  Todo valor `null` mostra "Dados insuficientes". Rodapé: "Dados de demonstração simulados" quando estiver no modo demo ou com o seed.
- [x] **Passo 4: Dados coletados:** a tabela "dado · por que coletamos · quem vê · por quanto tempo", com as linhas das seções 8 e 11 do design (cadastro; dados de cuidado; Zarit; sessão de 7 dias; auditoria de 6 meses; Banco ao vivo só na memória). Mais os direitos ("ver meus dados", "excluir minha conta"), a base legal (consentimento, art. 11, I da LGPD), "dados guardados no Brasil" e o aviso "não substitui orientação médica".
- [x] **Passo 5: Banco ao vivo:** a lista de `GET /api/demo/sql`, atualizada a cada 2 s enquanto a tela está aberta, com uma etiqueta colorida por tipo (INSERT, SELECT, UPDATE, DELETE), o SQL em fonte monoespaçada e o tempo em ms. No modo demo, o `demo.js` simula entradas coerentes com o que o usuário fez.
- [x] **Passo 6 — Verificar:** `node --check`. No navegador, logado como Marta (coordenadora):
  - o painel desenha todos os gráficos sem erro no console;
  - logado como Paulo, "Painel da rede" não aparece;
  - o Banco ao vivo mostra um UPDATE depois de um "Dei o remédio".
- [x] **Passo 7:** commit `feat(telas): Mais, painel, dados coletados e banco ao vivo`.

### Tarefa A7: Java — projeto Maven, modelo e regras puras (com testes)

**Arquivos:**
- Criar: `codigo/pom.xml`, `codigo/config.properties.exemplo`, `model/*` (abaixo), `model/alerta/*`, `service/Limites.java`, `service/Estatistica.java`, `service/EscalaRegras.java`, `service/DoseRegras.java`, `service/SinalVitalRegras.java`, `service/ZaritCalculadora.java`
- Testes: `src/test/java/br/com/cuidaquemcuida/model/TurnoTest.java`, `model/RegraHorarioTest.java`, `model/PeriodoTest.java`, `service/EstatisticaTest.java`, `service/EscalaRegrasTest.java`, `service/DoseRegrasTest.java`, `service/SinalVitalRegrasTest.java`, `service/ZaritCalculadoraTest.java`

**Interfaces (produz):**
- `pom.xml`:
  - `maven.compiler.release` 21; UTF-8;
  - dependências `org.glassfish.jersey.containers:jersey-container-grizzly2-http:3.1.5`, `org.glassfish.jersey.inject:jersey-hk2:3.1.5`, `org.glassfish.jersey.media:jersey-media-json-jackson:3.1.5`, `com.fasterxml.jackson.datatype:jackson-datatype-jsr310` (mesma versão do Jackson que o Jersey traz; conferir com `mvn dependency:tree` na B2), `org.postgresql:postgresql:42.7.3`, `org.junit.jupiter:junit-jupiter:5.10.2` (test);
  - plugins `maven-surefire-plugin:3.2.5` e `exec-maven-plugin:3.1.0` (`mainClass` `br.com.cuidaquemcuida.App`).
- `config.properties.exemplo`: `db.url=jdbc:postgresql://HOST:5432/postgres?sslmode=require`, `db.usuario=postgres.SEU_REF`, `db.senha=COLOQUE_AQUI`, `porta=8080`.
- `model`:
  - `abstract class Pessoa {Long id; String nome; LocalDate dataNascimento}`;
  - `Cuidador extends Pessoa {email, telefone, senhaHash, senhaSalt, genero, ativo}`;
  - `Paciente extends Pessoa {condicao, precisa24h, observacoes, responsavelNome, responsavelParentesco, codigoConvite}`;
  - `record MembroRede(long pessoaId, long pacienteId, Papel papel, Vinculo vinculo, boolean ativo, boolean compartilhaZarit)`;
  - enums `Papel {COORDENADOR, MEMBRO}`, `Vinculo {FAMILIAR, VIZINHO, AMIGO, OUTRO}`, `StatusTurno {PLANEJADO, REALIZADO, CANCELADO}`, `StatusDose {PENDENTE, DADA, ATRASADA, NAO_DADA}`, `TipoSinal {PRESSAO, GLICEMIA, TEMPERATURA, SATURACAO, FREQUENCIA_CARDIACA}`, `FaixaZarit {BAIXA, MODERADA, ALTA}`, `TipoRegra {INTERVALO, HORARIOS_FIXOS, DIAS_ALTERNADOS}`;
  - `enum Periodo {MADRUGADA, MANHA, TARDE, NOITE; static Periodo de(LocalTime h)}`;
  - `class Turno {Long id; long pacienteId; Long pessoaId; LocalDateTime inicio, fim; StatusTurno status; long minutos(); boolean sobrepoe(Turno o); boolean noturno()}`. O construtor lança `IllegalArgumentException` se `!fim.isAfter(inicio)`;
  - `class Medicamento`, `Dose`, `SinalVital`, `FaixaSinal`, `TarefaCuidado` (com `TipoSinal tipoSinal`, que pode ser null), `ExecucaoTarefa`, `AvaliacaoZarit`, com os campos das tabelas da A3;
  - `abstract class RegraHorario {LocalDate inicio; LocalDate fim; abstract List<LocalDateTime> horariosEntre(LocalDateTime de, LocalDateTime ate)}`, devolvendo em ordem, sem repetição, dentro de `[de, ate)` e respeitando inicio e fim;
  - `RegraIntervalo(int intervaloHoras, LocalTime primeiraDose)`, contando a partir de `inicio` + `primeiraDose`;
  - `RegraHorariosFixos(List<LocalTime>)`;
  - `RegraDiasAlternados(List<LocalTime>)`, só nos dias em que `ChronoUnit.DAYS.between(inicio, dia) % 2 == 0`.
- `model/alerta`:
  - `abstract class Alerta {TipoAlerta tipo; long pacienteId; long destinatarioId; String referencia; abstract String mensagem(); abstract int prioridade()}`;
  - `enum TipoAlerta`, com os 10 valores do CHECK da A3;
  - subclasses `AlertaMedicacao`, `AlertaSinalVital`, `AlertaTurnoVago`, `AlertaConflito`, `AlertaSobrecarga`, `AlertaPedidoAjuda`, cada uma com a mensagem em português simples. Prioridades: PEDIDO_AJUDA 100, SINAL_* 90, DOSE_NAO_DADA 80, DOSE_ATRASADA 70, TURNO_VAGO 60, CONFLITO 50, SOBRECARGA 40, TAREFA_ATRASADA 30, DOSE_PROXIMA 20.
- `service`:
  - `final class Limites`, com as constantes das restrições globais;
  - `Estatistica` (estática): `media(List<Double>)`, `mediana`, `moda` (menor valor entre os mais frequentes), `desvioPadrao` (populacional), `coeficienteVariacao`, `mediaMovel(List<Double> serie, int janela)` (média dos até `janela` últimos, inclusive o atual), `pearson(double[] x, double[] y)`, `zScore(double valor, List<Double> historico)`. **Entrada vazia, n < 2 ou variância zero devolvem `Double.NaN`**;
  - `EscalaRegras` (estática), com os records `Conflito(Turno a, Turno b)`, `Bloco(LocalDateTime inicio, LocalDateTime fim, long minutosTrabalhados)` e `Intervalo(LocalDateTime inicio, LocalDateTime fim)` e o enum `NivelSobrecarga {OK, ATENCAO, ALERTA}`:
    - `conflitos(List<Turno>)`: ordena e varre, em O(n log n);
    - `conflitosIngenuo(List<Turno>)`: O(n²), mantido para comparação;
    - `blocosSemFolga(List<Turno>)`;
    - `horasNaJanela(List<Turno>, LocalDateTime fim, int dias)`: recorta os turnos na janela;
    - `nivel(double horas7d, double horasSeguidas)`;
    - `periodosDescobertos(List<Turno> doPaciente, LocalDateTime de, LocalDateTime ate)`;
    - `sugerirCobertura(Turno vago, Map<Long, List<Turno>> turnosPorPessoa, LocalDateTime agora)`, que devolve uma `List<Long>`;
  - `DoseRegras`: `static StatusDose status(LocalDateTime previsto, LocalDateTime dadaEm, boolean marcadaNaoDada, LocalDateTime agora)` e `static boolean podeRegistrar(StatusDose atual)` (só PENDENTE);
  - `SinalVitalRegras`: `foraDaFaixa(double valor, FaixaSinal faixa)` e `foraDaCurva(double valor, List<Double> historico)`;
  - `ZaritCalculadora`: `static int pontuar(int[] respostas)` (exige 12 valores de 0 a 4, senão `IllegalArgumentException`) e `static FaixaZarit faixa(int pontuacao)`.

- [x] **Passo 1: escrever os testes** (asserções obrigatórias; com `assertEquals` em `double`, tolerância de 1e-9):
  - `PeriodoTest`: `de(05:59)`=MADRUGADA, `de(06:00)`=MANHA, `de(11:59)`=MANHA, `de(12:00)`=TARDE, `de(18:00)`=NOITE, `de(23:59)`=NOITE, `de(00:00)`=MADRUGADA.
  - `TurnoTest`:
    - 22:00 do dia 1 às 06:00 do dia 2: `minutos()`=480 e `noturno()`=true;
    - 20:00–23:00: `noturno()`=false (só 1 h na janela);
    - 03:00–09:00: `noturno()`=true;
    - fim igual ao início lança `IllegalArgumentException`;
    - 22–06 e 05–07 do dia seguinte: `sobrepoe`=true;
    - 06–14 e 14–22: `sobrepoe`=false (encostados não conflitam).
  - `RegraHorarioTest`:
    - intervalo de 8 h com primeira dose 06:00, num dia inteiro: [06:00, 14:00, 22:00];
    - horários fixos 08:00 e 20:00 em 2 dias: 4 horários;
    - dias alternados com início no dia 1: dia 1 sim, dia 2 não, dia 3 sim;
    - fora de `[inicio, fim]`: lista vazia;
    - `geracaoIdempotente`: duas chamadas com o mesmo período devolvem listas iguais.
  - `EstatisticaTest`:
    - `media([2,4,4,4,5,5,7,9])`=5.0 e `desvioPadrao`=2.0;
    - `mediana([3,1,2])`=2.0 e `mediana([1,2,3,4])`=2.5;
    - `moda([1,2,2,3])`=2.0 e `moda([1,1,2,2])`=1.0;
    - `mediaMovel([1,2,3,4,5],3)`=[1.0,1.5,2.0,3.0,4.0];
    - `pearson([1,2,3,4,5],[2,4,6,8,10])`=1.0 e `pearson([1,2,3,4,5],[10,8,6,4,2])`=-1.0;
    - `pearson` com n=1 é NaN; `pearson` com x constante é NaN; `media([])` é NaN;
    - `zScore(7,[1,2,3,4,5,6,7,8,9])` > 0.
  - `EscalaRegrasTest`:
    - `conflitos` e `conflitosIngenuo` devolvem o mesmo conjunto para 3 turnos com 1 sobreposição;
    - turno 22–06 conflita com 05–07;
    - `blocosSemFolga` com 06–14, 22–06 e 06–14 do dia seguinte dá 1 bloco de 24 h trabalhadas;
    - com 06–14 e 06–14 do dia seguinte (16 h de folga) dá 2 blocos;
    - `nivel(45,10)`=ATENCAO, `nivel(61,10)`=ALERTA, `nivel(30,37)`=ALERTA, `nivel(44,24)`=OK;
    - `periodosDescobertos` com turnos 06–14 e 14–22, num dia de 06:00 às 06:00 do dia seguinte, devolve [22:00–06:00];
    - `sugerirCobertura` exclui quem tem conflito e ordena pelas horas em 7 dias, de forma crescente.
  - `DoseRegrasTest`:
    - previsto 08:00 e dada 08:29 → DADA; 08:30 → DADA; 08:31 → ATRASADA;
    - sem registro com agora 10:01 → NAO_DADA; agora 09:59 → PENDENTE;
    - marcada como não dada → NAO_DADA;
    - `naoRegistraDoseJaResolvida`: `podeRegistrar` é false para DADA, ATRASADA e NAO_DADA, e true para PENDENTE.
  - `SinalVitalRegrasTest`:
    - 6 medições no histórico → `foraDaCurva` false para qualquer valor;
    - histórico [130,128,132,129,131,130,127,133] e valor 175 → true; valor 131 → false;
    - `foraDaFaixa(160, faixa 90–150)` → true.
  - `ZaritCalculadoraTest`:
    - doze 2 → 24 e ALTA;
    - doze 0 → 0 e BAIXA;
    - `faixa(10)`=BAIXA, `faixa(11)`=MODERADA, `faixa(20)`=MODERADA, `faixa(21)`=ALTA;
    - 11 respostas lança exceção; um valor 5 lança exceção.
- [x] **Passo 2:** implementar o modelo e as regras com as assinaturas acima. Detalhes:
  - `conflitos` ordena por `inicio` e compara cada turno com o de **maior fim** visto até ali;
  - `blocosSemFolga` ordena e junta turnos cujo intervalo é menor que `Limites.FOLGA_MIN_HORAS`;
  - `horasSeguidas` é a soma de `minutosTrabalhados` do bloco.
- [x] **Passo 3 — Verificar:** **adiado para a B2** (`mvn test`). Aqui, o revisor confere a coerência entre os testes e as assinaturas e a ausência de erro de compilação aparente.
- [x] **Passo 4:** commit `feat(java): modelo e regras de negócio com testes`.

### Tarefa A8: Java — infraestrutura (servidor, conexão, segurança)

**Arquivos:**
- Criar: `App.java`, `infra/Config.java`, `infra/Conexao.java`, `infra/Sql.java`, `infra/LogSql.java`, `infra/Senha.java`, `infra/JsonConfig.java`, `infra/ApiException.java`, `infra/ErroMapper.java`, `infra/AuthFilter.java`, `infra/Autorizacao.java`
- Testes: `infra/SenhaTest.java`, `infra/LogSqlTest.java`, `infra/AutorizacaoTest.java`

**Interfaces (produz):**
- `App.main`:
  - define o fuso `America/Sao_Paulo`;
  - monta um `ResourceConfig` com `packages("br.com.cuidaquemcuida")`;
  - sobe `GrizzlyHttpServerFactory.createHttpServer(URI.create("http://0.0.0.0:" + porta + "/api/"), config, false)`;
  - adiciona `new CLStaticHttpHandler(App.class.getClassLoader(), "/web/")` em `"/"`;
  - dá `start()` e imprime "CuidaQuemCuida rodando em http://localhost:PORTA".
- `Config.get(String chave)`: lê `config.properties` da pasta atual; se faltar, a variável de ambiente (`DB_URL`, `DB_USUARIO`, `DB_SENHA`, `PORTA`).
- `Conexao.abrir()`: devolve uma `Connection` via `DriverManager`.
- `Sql`: `static <T> List<T> listar(String sql, Mapeador<T> m, Object... params)`, `static <T> Optional<T> um(...)`, `static int executar(String sql, Object... params)` (devolve as linhas afetadas), `static long inserir(String sql, Object... params)` (devolve o id por `RETURNING id`). Toda chamada mede o tempo e chama `LogSql.registrar`. `Mapeador<T>` é a interface funcional `T mapear(ResultSet rs) throws SQLException`.
- `LogSql`: `static void registrar(String sql, long ms)` (o tipo é a primeira palavra do SQL em maiúsculas; guarda as últimas 50) e `static List<EntradaSql> ultimos()`, com `record EntradaSql(LocalDateTime quando, String tipo, String sql, long ms)`, a mais nova primeiro.
- `Senha`: `static String novoSalt()`, `static String hash(String senha, String saltBase64)`, `static boolean confere(String senha, String saltBase64, String hashBase64)` (comparação com `MessageDigest.isEqual`).
- `ApiException(int status, String mensagem)` com `Map<String,Object> extra` opcional (os `conflitos` do 409). `ErroMapper`:
  - `ApiException` vira `{"erro":...,+extra}`;
  - `IllegalArgumentException` vira 400 com a mensagem;
  - qualquer outra vira 500 "Erro interno. Tente de novo." e registra no console.
- `JsonConfig implements ContextResolver<ObjectMapper>`: registra `JavaTimeModule`, desliga `WRITE_DATES_AS_TIMESTAMPS` e não serializa campos null em DTOs de entrada.
- `AuthFilter implements ContainerRequestFilter`:
  - deixa passar sem token `GET saude`, `POST auth/login` e `POST pessoas`;
  - nas demais rotas, valida o token na `SessaoDao` (que não pode estar expirado), senão lança 401;
  - grava `req.setProperty("pessoaId", id)`.
- `Autorizacao`: `static Optional<Papel> papel(List<MembroRede> redes, long pacienteId)` (pura); `static Papel exigirMembro(long pessoaId, long pacienteId)` (403 "Você não faz parte da rede deste paciente"); `static void exigirCoordenador(long pessoaId, long pacienteId)` (403 "Só o coordenador pode fazer isso").

- [x] **Passo 1: testes:**
  - `SenhaTest`:
    - `confere("demo1234", SALT_SEED, HASH_SEED)` true, com os valores da A3, passo 3;
    - `confere("errada", SALT_SEED, HASH_SEED)` false;
    - dois `novoSalt()` diferentes;
    - `hash` determinístico para o mesmo salt.
  - `LogSqlTest`:
    - depois de 60 registros, `ultimos().size()`=50 e o primeiro é o mais novo;
    - `registrar("  select 1",1)` tem tipo `SELECT`.
  - `AutorizacaoTest`:
    - `papel` de uma rede com o paciente 1 como MEMBRO dá MEMBRO para o paciente 1 e vazio para o paciente 2;
    - membro inativo dá vazio.
- [x] **Passo 2:** implementar conforme as interfaces.
- [x] **Passo 3 — Verificar:** adiado para a B2.
- [x] **Passo 4:** commit `feat(java): servidor, conexão, log de SQL e segurança`.

### Tarefa A9: Java — DAOs, serviços e recursos da API

**Arquivos:**
- Criar:
  - `dao/PessoaDao`, `PacienteDao`, `MembroRedeDao`, `ConsentimentoDao`, `SessaoDao`, `TurnoDao`, `MedicamentoDao`, `DoseDao`, `SinalVitalDao`, `TarefaDao`, `ZaritDao`, `AlertaDao`, `AuditoriaDao`, `EstatisticaDao`;
  - `service/ContaService`, `RedeService`, `EscalaService`, `MedicacaoService`, `SinalVitalService`, `TarefaService`, `ZaritService`, `AlertaService`, `HojeService`, `EstatisticaService`;
  - `resource/` um `*Resource` por grupo da A2 e `resource/dto/` (records de entrada e saída com os nomes de campo da A2).
- Testes: `service/EstatisticaServiceTest.java`

**Interfaces:**
- Consome: `Sql`, `Autorizacao`, `ApiException` (A8) e as regras e o modelo (A7).
- Produz: as rotas da A2, exatamente.

- [x] **Passo 1: teste** `EstatisticaServiceTest.nanViraNull`: `EstatisticaService.paraJson(Double.NaN)` é `null`; `paraJson(0.5)` é 0.5; `paraJson(Double.POSITIVE_INFINITY)` é `null`.
- [x] **Passo 2: DAOs.** Um por tabela ou grupo, todo SQL via `Sql`, sempre com `?`. Obrigatórios:
  - **`DoseDao.marcarDada(long id, long pessoaId)`:** `UPDATE dose SET ... WHERE id=? AND status='PENDENTE'`. Se afetar 0 linhas, o serviço lê quem registrou e lança 409 "Essa dose já foi registrada por {nome}".
  - **`DoseDao.garantirDoses(long medicamentoId, List<LocalDateTime>)`:** `INSERT ... ON CONFLICT (medicamento_id, previsto_para) DO NOTHING`. O mesmo para as execuções de tarefa.
  - **`EstatisticaDao`, com SQL que apareça no vídeo:**
    - adesão por remédio e por período com `GROUP BY` (Fase 6);
    - carga por pessoa com `JOIN` entre turno e pessoa (Fase 5);
    - "acima da média" com **subconsulta** `HAVING sum(horas) > (SELECT avg(...) ...)` (Fase 6).
- [x] **Passo 3: serviços**, com as regras do design:
  - **`ContaService`:** cadastro (salt, hash, consentimento TERMO_USUARIO v1.0; o e-mail é guardado em minúsculas); login (token aleatório de 32 bytes em Base64 URL-safe, expiração em 7 dias, auditoria LOGIN); `excluir` (anonimiza conforme o design, seção 11; apaga as avaliações Zarit; bloqueia com 409 o único coordenador de rede com outros membros; apaga o paciente quando a pessoa é o último membro).
  - **`RedeService`:** criar paciente (código de 6 caracteres sem ambiguidade, de `ABCDEFGHJKLMNPQRSTUVWXYZ23456789`, gerado de novo se já existir; quem cria vira COORDENADOR; consentimento DADOS_PACIENTE com `responsavel_nome`); entrar com código; renovar o convite; membros com horas em 7 dias.
  - **`EscalaService`:** criar, editar e assumir rodam `EscalaRegras.conflitos` sobre os turnos da pessoa (409 com a lista); `analise` junta conflitos, períodos descobertos (só se `precisa24h`) e sobrecarga por membro; sugestões.
  - **`MedicacaoService`:** monta a `RegraHorario` a partir da linha do banco; `garantirDoses` do dia; na leitura, uma dose PENDENTE que `DoseRegras.status` diz ser NAO_DADA é atualizada.
  - **`SinalVitalService`:** ao registrar, calcula fora da faixa e fora da curva (histórico do mesmo tipo e paciente, sem o valor novo) e devolve o campo `alerta`.
  - **`ZaritService`:** pontua, grava a avaliação e as respostas; `proximaSugerida` = última + 14 dias; `pedirAjuda` grava alertas.
  - **`AlertaService.gerar(long pessoaId, long pacienteId, LocalDateTime agora)`:** calcula os alertas pelos destinatários da tabela do design (seção 4.2), grava com `ON CONFLICT DO NOTHING` e devolve os não lidos.
  - **`HojeService`:** turno atual ou próximo, mais os itens do dia (doses e execuções de tarefa, inclusive as de medição, com `tipoSinal`), em ordem de horário. Com turno em andamento, mostra os itens do turno; sem turno, as pendências do dia.
  - **`EstatisticaService`:** monta a resposta da A2 com `Estatistica` e `EstatisticaDao`, passando cada `double` por `paraJson`. A Zarit usa só quem tem `compartilha_zarit` true. Pearson por avaliação: x = número de turnos noturnos da pessoa (em todas as redes) nos 14 dias antes da avaliação; y = pontuação (e qualidade do sono).
  - **Auditoria:** toda inserção, alteração e exclusão nos serviços chama `AuditoriaDao.registrar(pessoaId, acao, tabela, id, detalhe)`.
- [x] **Passo 4: recursos JAX-RS** conforme a A2. Toda rota com `{id}` de paciente chama `Autorizacao.exigirMembro` ou `exigirCoordenador` antes de qualquer coisa. Rotas de turno, dose, tarefa e medicamento pelo próprio id descobrem o `pacienteId` dono e checam do mesmo jeito.
- [x] **Passo 5 — Verificar:** adiado para a B2 (compilar e testar) e a B4 (de ponta a ponta). Aqui, o revisor compara cada rota da A2 com o recurso correspondente.
- [x] **Passo 6:** commit `feat(java): DAOs, serviços e API`.

### Tarefa A10: Diagramas, casos de uso e wireframes (versão 1)

**Arquivos:**
- Criar:
  - `documentacao/01-diagramas/Arquitetura.md` (copiar e detalhar o flowchart do design);
  - `Diagrama de Classes.md` (`classDiagram` com herança de `Pessoa`, polimorfismo de `Alerta` e de `RegraHorario`, e as associações);
  - `Casos de Uso.md` (`flowchart` com os atores Coordenador e Membro e cerca de 14 casos, mais uma ficha por caso no formato do Lab da Fase 2: nome, ator, pré-condição, fluxo principal, fluxos alternativos, pós-condição);
  - `Fluxo - Dar o Remédio.md`, `Fluxo - Montar a Escala.md`, `Fluxo - Bem-estar e Pedido de Ajuda.md` (`flowchart` de atividades com decisões);
  - `documentacao/02-wireframes/Wireframes.md` + `wireframes.html` (todas as telas em baixa fidelidade, em cinza, a partir dos esboços aprovados em `.superpowers/brainstorm/`).

- [x] **Passo 1:** escrever os diagramas. Todos com o cabeçalho "Versão 1 (planejada) — data" e links para [[Design da Solução]], [[API]] e as notas relacionadas.
- [x] **Passo 2:** `wireframes.html`, com 9 telas de celular lado a lado: Login, Hoje, Escala, Novo turno, Bem-estar (pergunta), Bem-estar (resultado alto), Mais, Painel, Dados coletados. `Wireframes.md` descreve cada tela (objetivo, elementos, decisões de acessibilidade) e manda abrir o HTML.
- [x] **Passo 3 — Verificar:** abrir os `.md` no Obsidian (ou no modo leitura) e confirmar que todo bloco Mermaid desenha sem erro de sintaxe. Abrir o `wireframes.html` no navegador.
- [x] **Passo 4:** commit `docs: diagramas, casos de uso e wireframes v1`.

### Tarefa A11: Notas técnicas (módulos, classes e funções)

**Arquivos:**
- Criar:
  - `documentacao/03-especificacoes-tecnicas/Regras de Negócio.md`, `Estatística.md`, `Mapa do Código.md`;
  - `modulos/` com 8 notas: Cadastros e Rede, Escala, Medicação, Sinais Vitais, Protocolo de Cuidado, Bem-estar, Painel Estatístico, Infraestrutura e Segurança;
  - `classes/` com uma nota por classe Java (menos os DTOs, que ficam numa nota única `DTOs da API.md`);
  - `funcoes/` com uma nota por função de regra: `conflitos`, `conflitosIngenuo`, `blocosSemFolga`, `horasNaJanela`, `nivel`, `periodosDescobertos`, `sugerirCobertura`, `horariosEntre`, `DoseRegras.status`, `foraDaCurva`, `pontuar`, `mediaMovel`, `pearson`, `desvioPadrao`, `zScore`, `Senha.hash`, `garantirDoses`, `marcarDada`.

- [x] **Passo 1:** formato de cada nota de classe: frontmatter (`tipo: classe`, `camada`, `arquivo`), "Para que serve", "Campos principais", "Métodos" (com `[[link]]` para a nota da função quando houver), "Usa" e "É usada por" (links), "Conceito do curso" (por exemplo, "Herança — Fase 3").
- [x] **Passo 2:** formato de cada nota de função: assinatura, o que faz, regra do design (link para [[Regras de Negócio]]), exemplo de entrada e saída tirado do teste, complexidade quando for relevante (`conflitos`: O(n log n) × O(n²)), trecho de código curto e o teste que a cobre.
- [x] **Passo 3:** cada nota de módulo liga as telas (arquivo JS), os recursos, os serviços, os DAOs, as tabelas e os casos de uso daquele módulo. `Mapa do Código.md` liga tudo por camada.
- [x] **Passo 4 — Verificar:** no Obsidian, a visão de grafo mostra as notas ligadas, sem notas de classe órfãs. Busca por `[[` sem destino: só podem sobrar notas previstas na A12.
- [x] **Passo 5:** commit `docs: notas técnicas de módulos, classes e funções`.

### Tarefa A12: Outros materiais, ágil e roteiros

**Arquivos:**
- Criar em `documentacao/04-outros-materiais/`: `Problema e Evidências.md`, `Personas.md`, `Concorrentes.md`, `ODS.md`, `LGPD, Segurança e Acessibilidade.md`, `Testes e Validação.md`, `Formulário Zarit (validação).md`, `Diário de Desafios.md`, `Registro de Decisões.md`, `Conteúdos do Curso.md`, `agil/Métodos Ágeis.md`, `agil/Backlog.md`, `agil/Sprint 1 - Construção.md`
- Criar em `videos/`: `Roteiro - Pitch.md`, `Roteiro - Técnico.md`, `links.txt`

- [x] **Passo 1:** notas de produto, a partir das seções 1, 11, 15 e 16 do design, com as fontes da pesquisa de 13/11 (os mesmos links da conversa de design: Lotsa, App Cuidar, Alzheimer.App, cuidaemcasa, UNA-SUS, Febraz/Humanis, SciELO Scazufca, PMC ZBI-12, PNAD 2022/2019). Personas: Marta (coordenadora), Paulo (filho que trabalha), João (vizinho idoso, pouca intimidade com tecnologia).
- [x] **Passo 2:** `Backlog.md` com as histórias de usuário ("Como ..., quero ..., para ...") e o critério de aceite, uma por funcionalidade. `Métodos Ágeis.md` explica o Scrum usado: papéis (Luis PO, Gabriel SM), eventos, artefatos e a ligação com a Fase 1. `Sprint 1 - Construção.md` registra as datas reais da Parte A.
- [x] **Passo 3:** `Testes e Validação.md`: os testes JUnit (tabela com nome e o que prova), os cenários de aceite manuais (um por história, com as colunas "esperado" e "obtido" em branco para a B4) e as métricas de sucesso. `Formulário Zarit (validação).md`: o texto pronto para montar no Google Forms (termo curto de participação anônima, as 12 perguntas, as 2 de sono e "você cuida de quem?") e a tabela para registrar os resultados reais com data.
- [x] **Passo 4:** `Diário de Desafios.md`: um modelo de entrada (problema, o que tentamos, decisão, trecho, data) e **só os desafios que de fato aconteceram até aqui** (por exemplo: o PC sem Java obrigou a separar as telas em modo demonstração; contar a verdade sobre isso). Os previstos ficam numa seção separada "A acompanhar". `Registro de Decisões.md`: as decisões da seção 19 do design, mais as da Parte A, com data.
- [x] **Passo 5:** `Roteiro - Pitch.md`: 3:00 com marcação de tempo:
  - 0:00 história da Marta e dado do IBGE;
  - 0:30 o problema;
  - 0:50 a solução;
  - 1:30 o diferencial contra os concorrentes;
  - 1:55 os ODS 3, 5 e 10;
  - 2:20 a validação;
  - 2:35 o roadmap (app nas lojas, pulseira IoT, UBS);
  - 2:50 a chamada final.
  
  Cada trecho com texto falado, o que aparece na tela e uma sugestão de imagem. **Sem mostrar a implementação.**
  
  `Roteiro - Técnico.md`: 3:00, cada item com o item do edital entre parênteses:
  - 0:00 sistema rodando no modo celular (Java em funcionamento);
  - 0:25 inserção, leitura, alteração e exclusão com o Banco ao vivo e o Supabase (armazenamento e requisições);
  - 1:00 Dados coletados (dados e tratamento);
  - 1:20 conceitos: diagrama de classes, herança e polimorfismo, DAO com `PreparedStatement`, JAX-RS, DER (conteúdos do ano);
  - 2:10 dois desafios reais do diário;
  - 2:45 testes JUnit passando.
  
  `links.txt`: duas linhas, `Pitch: <link>` e `Técnico: <link>`.
- [x] **Passo 6 — Verificar:** abrir a seção "Checklist do edital" do design: todo item aponta para uma nota que agora existe.
- [x] **Passo 7:** commit `docs: materiais de produto, ágil, validação e roteiros`. Atualizar o "Estado atual" do `AGENTS.md` e o `Kanban.md`.

### Tarefa A13: Revisão final da Parte A e preparação para casa

- [x] **Passo 1:** revisor independente: (a) compara cada rota da A2 com o `demo.js` e com os recursos Java; (b) procura erro de compilação aparente no Java (import faltando, tipo errado, assinatura divergente entre as tarefas); (c) procura qualquer menção a IA nos entregáveis (`grep -ri "claude\|inteligência artificial\| IA "` em `documentacao/`, `videos/`, `README.md`, `codigo/src`). Corrigir o que achar.
- [x] **Passo 2:** atualizar o `AGENTS.md` ("Estado atual: Parte A concluída em <data>; próximo passo: B1") e o Kanban.
- [x] **Passo 3:** commit `chore: revisão da parte A`.
- [ ] **Passo 4: levar o projeto para casa.** Copiar a pasta `C:\CuidaQuemCuida` **inteira** (inclusive a pasta oculta `.git`) para um pendrive ou nuvem pessoal. Ou, se tiver conta no GitHub: criar um repositório **privado** vazio e rodar `git remote add origin <url>` e `git push -u origin HEAD`. Não copiar `codigo/config.properties` (ainda nem existe).

---

# PARTE B — Em casa (PC com IntelliJ)

> **Para quem chegar agora:** leia `AGENTS.md`, depois o design (`documentacao/03-especificacoes-tecnicas/Design da Solução.md`), depois o contrato da API (`API.md`). Siga a partir do primeiro passo não marcado. **Regra de ouro:** se algo falhar, anote no `Diário de Desafios.md` (problema, o que tentou, decisão, data). Essas entradas viram o trecho de desafios do vídeo técnico.

### Tarefa B1: Preparar o ambiente

- [ ] **Passo 1:** instalar o **IntelliJ IDEA Community Edition** (site oficial da JetBrains, gratuito).
- [ ] **Passo 2:** colocar a pasta do projeto (pendrive ou nuvem) em `C:\CuidaQuemCuida`, ou clonar do GitHub.
- [ ] **Passo 3:** no IntelliJ: **File → Open →** escolher a pasta `C:\CuidaQuemCuida\codigo` (a que tem o `pom.xml`) → "Trust project". Ele reconhece o projeto Maven.
- [ ] **Passo 4:** **File → Project Structure → Project → SDK → Download JDK →** versão **21**, fornecedor **Eclipse Temurin** → Download. Language level: 21.
- [ ] **Passo 5:** na barra lateral direita, abrir **Maven** e clicar em **Reload All Maven Projects** (as setas circulares). Esperar baixar as dependências (precisa de internet).
- [ ] **Passo 6 — Verificar:** a aba Maven mostra `cuidaquemcuida` sem ícone vermelho. Em **Maven → Lifecycle**, aparecem `compile` e `test`.
- [ ] **Passo 7:** anotar no Kanban a data real.

### Tarefa B2: Compilar e passar nos testes

- [ ] **Passo 1:** **Maven → Lifecycle → compile** (duplo clique). Esperado: `BUILD SUCCESS`.
- [ ] **Passo 2: se der erro de compilação** (o Java da Parte A foi escrito sem compilar, então isso é esperado):
  1. A janela "Run" mostra `[ERROR] /caminho/Arquivo.java:[linha,coluna] mensagem`. Clicar no link abre a linha.
  2. Erros comuns e correções:
     - `cannot find symbol`: import faltando ou nome divergente; usar Alt+Enter → Import, ou alinhar com a assinatura do plano;
     - `incompatible types`: ajustar ao tipo do plano;
     - `package ... does not exist`: dependência do `pom.xml`; recarregar o Maven.
  3. Se usar uma IA para ajudar: colar o erro **e** o conteúdo do `AGENTS.md`, e pedir a correção **mínima** que mantém as assinaturas deste plano.
  4. Repetir até `BUILD SUCCESS`. Cada erro difícil vira uma entrada no diário.
- [ ] **Passo 3:** **Maven → Lifecycle → test.** Esperado: `Tests run: N, Failures: 0, Errors: 0` e `BUILD SUCCESS`.
- [ ] **Passo 4: se um teste falhar:** primeiro confirmar se o **teste** está de acordo com as restrições globais deste plano (os valores ali são a regra). Se estiver, corrigir o **código**, não o teste. Se `SenhaTest.confere(...)` falhar, o hash do seed está errado: gerar de novo com `Senha.novoSalt()` e `Senha.hash("demo1234", salt)` (um `main` temporário) e atualizar o `03-dados-demo.sql` e o teste.
- [ ] **Passo 5:** conferir a versão do Jackson: no terminal do IntelliJ, `mvn dependency:tree | findstr jackson`. Se o `jackson-datatype-jsr310` estiver numa versão diferente do `jackson-databind`, igualar no `pom.xml`.
- [ ] **Passo 6:** print da janela de testes verde, salvo em `documentacao/04-outros-materiais/imagens/testes-verdes.png`. Vai para o vídeo técnico e para "Testes e Validação".
- [ ] **Passo 7:** commit `fix: ajustes de compilação e testes` (se houve mudança).

### Tarefa B3: Banco no Supabase e configuração

- [ ] **Passo 1:** em supabase.com, com a conta **pessoal**: **New project** → nome `cuidaquemcuida` → criar uma senha forte e **guardar num lugar seguro** → região **South America (São Paulo)** → plano Free → Create.
- [ ] **Passo 2:** **SQL Editor → New query →** colar e rodar, um de cada vez, na ordem: `banco/00-apagar-tabelas.sql`, `01-criar-tabelas.sql`, `02-ligar-rls.sql`, `03-dados-demo.sql`. Cada um precisa terminar com "Success".
- [ ] **Passo 3 — Verificar:** rodar `select count(*) from pessoa;` (deve dar 4) e `select status, count(*) from dose group by status;` (DADA, ATRASADA, NAO_DADA e PENDENTE). Em **Table Editor**, cada tabela aparece com o cadeado de RLS ligado.
- [ ] **Passo 4:** pegar a conexão em **Connect** (botão no topo) **→ Session pooler**. Ela vem como `postgresql://postgres.ABCDEF:[YOUR-PASSWORD]@aws-0-sa-east-1.pooler.supabase.com:5432/postgres`. Converter para o formato do `config.properties`:
  - `db.url=jdbc:postgresql://aws-0-sa-east-1.pooler.supabase.com:5432/postgres?sslmode=require` (o host é o que aparecer para você);
  - `db.usuario=postgres.ABCDEF` (a parte antes do `:`);
  - `db.senha=` a senha do Passo 1;
  - `porta=8080`.
- [ ] **Passo 5:** copiar `codigo/config.properties.exemplo` para `codigo/config.properties` e preencher. **Esse arquivo nunca vai para o Git** (já está no `.gitignore`; conferir com `git status`, que não pode listá-lo).
- [ ] **Passo 6:** rodar: **Maven → Plugins → exec → exec:java**, ou abrir `App.java` e clicar no ▶ verde ao lado do `main`. Esperado no console: "CuidaQuemCuida rodando em http://localhost:8080". Se der "Connection refused" ou "timeout", conferir se a URL é a do **Session pooler**, e não a "Direct connection" (que só funciona em IPv6).
- [ ] **Passo 7 — Verificar:** abrir `http://localhost:8080/api/saude` no navegador (deve mostrar `{"ok":true}`). Abrir `http://localhost:8080`: **sem** a faixa "Modo demonstração".
- [ ] **Passo 8:** se o projeto Supabase ficar 7 dias sem uso, ele pausa; reativar em **Project → Restore**.

### Tarefa B4: Teste de ponta a ponta (telas + API real)

- [ ] **Passo 1:** com o sistema rodando, seguir os cenários de aceite de `Testes e Validação.md` e preencher a coluna "obtido". No mínimo:
  - login com Marta;
  - Hoje mostra os itens;
  - "Dei o remédio" muda o status e aparece no Banco ao vivo como UPDATE;
  - criar um turno sobreposto dá a mensagem de conflito;
  - a Escala mostra o domingo vago e a sobrecarga da Marta com sugestão;
  - registrar pressão 180 gera o alerta "fora da faixa";
  - responder a Zarit;
  - o painel mostra os gráficos;
  - logado como João, `http://localhost:8080/api/pacientes/999` dá 403 ou 404, e o Painel não aparece;
  - criar uma conta nova, entrar com o código `LURD26` e virar membro;
  - excluir essa conta: o nome vira "Pessoa removida".
- [ ] **Passo 2: duas pessoas na mesma dose:** abrir uma janela normal (Marta) e uma anônima (Paulo) e tocar "Dei o remédio" na mesma dose nas duas. A segunda mostra "Essa dose já foi registrada por Marta Souza".
- [ ] **Passo 3: no celular de verdade** (mesmo Wi-Fi): no PC, rodar `ipconfig` e anotar o "Endereço IPv4" (por exemplo, 192.168.0.10). No celular, abrir `http://192.168.0.10:8080`. Se o Windows perguntar sobre o firewall do Java, permitir em **rede privada**. Conferir os botões grandes e a leitura confortável.
- [ ] **Passo 4:** os itens com `[CONFERIR]` no `zarit-perguntas.json` precisam ser conferidos com a fonte (Scazufca 2002) e corrigidos.
- [ ] **Passo 5:** cada falha encontrada: corrigir, anotar no diário (se foi um desafio de verdade), fazer o commit e repetir o cenário.
- [ ] **Passo 6:** validação com pessoas (seção 12 do design): montar o Google Forms a partir de `Formulário Zarit (validação).md`, aplicar a 2 ou 3 cuidadores reais e registrar os resultados **reais** com a data. Teste de uso: uma pessoa marca um remédio no celular sem ajuda; anotar o que aconteceu.

### Tarefa B5: Diagramas finais e material extra

- [ ] **Passo 1:** instalar o **DBeaver Community**. Nova conexão PostgreSQL com os dados do `config.properties` (host, porta 5432, banco `postgres`, usuário e senha; na aba SSL, "require"). Abrir **Schemas → public → Tables →** botão direito **→ View Diagram**. Exportar como PNG para `documentacao/01-diagramas/imagens/der-final.png`.
- [ ] **Passo 2:** em cada nota de diagrama, acrescentar a seção "Versão final (implementada) — data", com o diagrama atualizado se o código mudou, e a lista "O que mudou desde a v1 e por quê" (as decisões vão também para o `Registro de Decisões.md`).
- [ ] **Passo 3:** imagens dos diagramas Mermaid: abrir https://mermaid.live, colar cada bloco e usar **Actions → PNG**. Salvar em `documentacao/01-diagramas/imagens/`.
- [ ] **Passo 4:** wireframes em imagem: abrir o `documentacao/02-wireframes/wireframes.html`, fazer um print de cada tela (Win+Shift+S) e salvar em `documentacao/02-wireframes/imagens/`. Prints das telas reais rodando vão para o mesmo lugar, com o sufixo `-real`.
- [ ] **Passo 5 (opcional, acabamento):** graphify sobre a pasta `codigo/src`, com a saída **fora** do vault (por exemplo, `C:\cqc-graphify\`). Salvar a imagem do grafo em `documentacao/04-outros-materiais/imagens/grafo-codigo.png`.
- [ ] **Passo 6:** commit `docs: diagramas finais e imagens`.

### Tarefa B6: Gravar os vídeos

- [ ] **Passo 1:** antes de gravar, resetar os dados: rodar no SQL Editor `00`, `01`, `02` e `03` de novo. Reiniciar o sistema (isso zera o Banco ao vivo).
- [ ] **Passo 2: vídeo técnico** (até 3:00), seguindo `videos/Roteiro - Técnico.md`. Gravar a tela com a **Xbox Game Bar** (Win+Alt+R) ou o OBS Studio. Modo celular no navegador: F12 → ícone de celular (Ctrl+Shift+M) → iPhone 12 Pro. Mostrar o Supabase (Table Editor) atualizando depois de cada ação. Mostrar no IntelliJ os trechos do roteiro e os testes verdes.
- [ ] **Passo 3: vídeo pitch** (até 3:00), seguindo `videos/Roteiro - Pitch.md`. Montar no Canva ou no CapCut com textos, infográficos, imagens reais e roadmap. **Sem mostrar código.**
- [ ] **Passo 4:** conferir a duração (**no máximo 3:00 cada**). Publicar no YouTube como **Não listado**. Colar os links em `videos/links.txt`.
- [ ] **Passo 5:** atualizar `Sprint 2/3` em `agil/` com as datas reais, a revisão e a retrospectiva.

### Tarefa B7: Empacotar e entregar (até 19/11/2026)

- [ ] **Passo 1: carimbo de auditoria.** Abrir cada `.js` em `codigo/src/main/resources/web/js/` (e qualquer `.py`, `.ps1`). Se houver um bloco de comentário com `[CLAUDE-CODE-AUDIT]` no topo, apagar o bloco inteiro e salvar. Conferir com a busca do IntelliJ (Ctrl+Shift+F por `CLAUDE-CODE-AUDIT`): 0 resultados.
- [ ] **Passo 2: PDF da documentação.** No Obsidian, criar a nota `Documentação Completa.md` com, em ordem: título, equipe, sumário e os embeds `![[Design da Solução]]`, `![[Arquitetura]]`, `![[Diagrama do Banco]]`, `![[Diagrama de Classes]]`, `![[Casos de Uso]]`, os três fluxos, `![[Wireframes]]`, `![[API]]`, `![[Regras de Negócio]]`, `![[Estatística]]`, `![[Problema e Evidências]]`, `![[Personas]]`, `![[Concorrentes]]`, `![[ODS]]`, `![[LGPD, Segurança e Acessibilidade]]`, `![[Testes e Validação]]`, `![[Métodos Ágeis]]`, `![[Diário de Desafios]]`, `![[Registro de Decisões]]` e `![[Conteúdos do Curso]]`. Depois, **⋯ → Export to PDF** e salvar como `Documentacao-CuidaQuemCuida.pdf` na raiz. Conferir se os diagramas Mermaid aparecem desenhados no PDF; se não aparecerem, usar as imagens da B5 no lugar.
- [ ] **Passo 3: busca final por menção a IA** (Ctrl+Shift+F no IntelliJ ou busca do Obsidian, sem diferenciar maiúsculas): `claude`, `inteligência artificial`, `chatgpt`, `copilot` nas pastas que vão no zip. Zero resultados.
- [ ] **Passo 4: montar o zip.** Criar a pasta `C:\entrega-cqc\` e copiar para ela: `Documentacao-CuidaQuemCuida.pdf`, `README.md`, a pasta `documentacao/`, a pasta `videos/` (com `links.txt`), a pasta `banco/` e a pasta `codigo/` **sem** `target/` e **sem** `config.properties`. **Não** copiar `docs/`, `AGENTS.md`, `.superpowers/`, `.obsidian/`, `.git/`. Botão direito na pasta → **Compactar para arquivo ZIP** → `CuidaQuemCuida-2SIOA.zip`.
- [ ] **Passo 5 — Verificar o zip:** abrir o zip e conferir:
  - (a) `videos/links.txt` com os 2 links, que abrem numa janela anônima;
  - (b) nenhum arquivo `config.properties`;
  - (c) o PDF abre;
  - (d) as pastas 01 a 04 da documentação estão completas.
- [ ] **Passo 6:** enviar na **plataforma FIAP ON → Atividades** e conferir a confirmação do envio. **Prazo: 19/11/2026.**
- [ ] **Passo 7:** commit `chore: entrega` e o "Estado atual: entregue em <data>" no `AGENTS.md`.
