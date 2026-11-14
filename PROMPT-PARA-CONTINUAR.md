---
titulo: Prompt para continuar
data: 2026-11-14
tags: [passagem, prompt]
---

# Prompt para continuar o projeto

> **Atualização de 14/11/2026:** use o estado atual de [[AGENTS]]. As três decisões do login foram resolvidas e o redesenho foi implementado. A verificação local já cobriu a interface, os 64 testes Java e a integração com PostgreSQL. Retome pelas pendências do Supabase, da validação e da entrega. O prompt abaixo registra o ponto de partida da sessão.

> Arquivo de trabalho da equipe. **Não vai no .zip de entrega.** Atualizado em 14/11/2026, no fim da sessão em que a tela Hoje foi fechada e o login teve o 1º critique.

## 1. Antes de colar o prompt (máquina nova)
1. Clonar o repositório privado: `git clone https://github.com/LuisRivalta/CuidaQuemCuida.git C:\CuidaQuemCuida`. É preciso ter acesso: o Luis adiciona a pessoa como colaboradora no GitHub.
2. Abrir a pasta `C:\CuidaQuemCuida` no Obsidian (o vault é a raiz) e no Claude Code (ou na IA que for usar).
3. **No Claude Code, de preferência,** instalar os plugins de design usados até aqui:
   ```
   /plugin marketplace add pbakaus/impeccable
   /plugin install impeccable@impeccable
   /plugin marketplace add nextlevelbuilder/ui-ux-pro-max-skill
   /plugin install ui-ux-pro-max@ui-ux-pro-max-skill
   /reload-skills
   ```
   O motor da Impeccable baixa sozinho na primeira vez. Se a rede barrar, siga [[Redesenho - Ferramentas e Verificação]].
4. **Para ver as telas,** na raiz do projeto:
   - rodar `python -m http.server 8000 --bind 127.0.0.1 --directory codigo/src/main/resources/web`;
   - abrir `http://127.0.0.1:8000`, apertar **Ctrl+F5** e tocar em "Entrar como Marta".
5. **Para tirar as fotos de conferência:** Node 22+ e Edge ou Chrome (ver `ferramentas/`).

## 2. O prompt (copie tudo o que está dentro do bloco)

```
Você vai continuar o projeto CuidaQuemCuida: trabalho da faculdade FIAP (Global Solution 2026, tema
CitizenTech, turma 2SIOA), feito em dupla pelo Luis (Product Owner) e pelo Gabriel Vilela. É uma rede de
apoio e revezamento para cuidadores familiares. A ENTREGA É ATÉ 19/11/2026 e não existe entrega atrasada.

ONDE PARAMOS (14/11/2026): estamos no meio do REDESENHO VISUAL DAS TELAS, que roda antes da Parte B.
- A tela Hoje está fechada: 4 rodadas de critique da Impeccable, nota 26 → 27 → 29 → 30/40.
- A tela de login foi redesenhada e teve 1 critique (26/40, 2 P1 e 3 P2). As correções estão paradas
  esperando 3 decisões do Luis.
- As outras 16 telas funcionam, mas ainda têm o layout antigo.
- Prazo do redesenho: 15/11/2026. De 16/11 a 19/11 é a Parte B (Java, Supabase, vídeos, entrega).

LEIA, NESTA ORDEM, ANTES DE QUALQUER AÇÃO (o projeto é um vault do Obsidian; tudo em .md com [[links]]):
1. AGENTS.md (raiz): regras invioláveis, onde está cada coisa, estado atual, pendências.
2. docs/redesenho/Redesenho - Passagem.md: o estado exato, as decisões pendentes e os próximos passos.
3. docs/superpowers/plans/2026-11-14-redesenho-telas.md: o plano do redesenho (fases 0 a 6, com
   checkboxes e o "Andamento").
4. PRODUCT.md (raiz): usuários, propósito, marca fixa, acessibilidade.
5. docs/redesenho/Redesenho - Sistema Visual.md: cores, letras, componentes, movimento, tema noturno.
6. docs/redesenho/Redesenho - Tela Hoje.md e docs/redesenho/Redesenho - Tela Login.md.
7. docs/redesenho/Redesenho - Ferramentas e Verificação.md: Impeccable, detector, critique, scripts de fotos.
8. docs/redesenho/Redesenho - Diário da Sessão 14-11.md: o porquê de cada escolha, com as palavras do Luis.
9. Para a Parte B, depois: docs/superpowers/plans/2026-11-13-cuidaquemcuida.md (Tarefas B1 a B7),
   documentacao/03-especificacoes-tecnicas/Design da Solução.md e API.md.

PRIMEIRA COISA A FAZER: fazer ao Luis (ou a quem estiver comigo) as 3 perguntas pendentes do login, com
opções, e esperar a resposta:
 (1) escopo das correções: os 5 problemas / só os 2 P1 / os 2 P1 + a família de exemplo contando a
     história no pitch;
 (2) login lembrado (hoje fechar a aba pede login de novo, mas a sessão do servidor vale 7 dias):
     caixa "Continuar conectado" marcada por padrão / sempre lembrar / deixar como está;
 (3) senha esquecida (a API não tem recuperação): texto honesto, sem rota / não mostrar nada / criar a
     rota na Parte B (muda o contrato e vai para o Registro de Decisões).
Depois: corrigir o login, fotografar, rodar o detector e mostrar. Então seguir o plano: Fase 3 (DESIGN.md
com /impeccable:impeccable document), Fase 4 (uma tela por vez: Escala, Bem-estar e Zarit com a tela de
respiração, Painel, Mais, Paciente, Pessoas, Sinais, Tarefas, Dados/Banco/Conta, Cadastros), Fase 5
(audit, harden, adapt, polish) e Fase 6 (documentação).

REGRAS QUE NÃO PODEM SER QUEBRADAS:
- NÃO citar IA, Claude, ChatGPT ou qualquer ferramenta de IA nos arquivos entregáveis (documentacao/,
  videos/, README.md, codigo/, banco/). Commits SEM linha de coautoria.
- Datas sempre reais. Desafios técnicos só os que aconteceram de verdade (anotar no
  documentacao/04-outros-materiais/Diário de Desafios.md).
- Correções mínimas: NÃO mudar o contrato da API (API.md), o js/demo.js nem as assinaturas do Java. Se uma
  mudança for inevitável, registrar no documentacao/04-outros-materiais/Registro de Decisões.md.
- A senha do banco nunca vai para arquivo versionado (só codigo/config.properties, que está no .gitignore).
- UMA TELA POR VEZ: mostrar a tela pronta (no navegador ou em fotos) e ESPERAR o ok antes da próxima. A
  escolha de direção e ferramentas é do Luis. Decisões de produto: perguntar, com opções e uma
  recomendação.
- Manter o sistema visual (Redesenho - Sistema Visual): céu por período, tema noturno, Young Serif +
  Lexend, ícones SVG (nunca emoji), alvos de 48 px, texto base 18 px, "reduzir movimento" respeitado.
- Marca fixa: os dois corações (coral #ef8a62 e sálvia #7aa98a), o nome CuidaQuemCuida e a frase "Quem
  cuida também precisa de cuidado.". Tratamento de gênero pelo campo `genero` do cadastro (neutro sem
  informação). O texto das perguntas da Zarit não muda.
- Depois de atualizar o código, recarregar o navegador com Ctrl+F5 (o cache de módulos JS deixa a tela em
  branco).
- Documentação no Obsidian: a cada passo, atualizar o "Andamento" do plano, a nota de passagem
  (docs/redesenho/), o Registro de Decisões, o Diário de Desafios (se houver desafio real), o Kanban
  (documentacao/04-outros-materiais/agil/Kanban.md) e a seção "Estado atual" do AGENTS.md.
- Commits pequenos e por assunto. Push só quando o Luis pedir. Nunca forçar push.
- Não entram no .zip: docs/, AGENTS.md, PRODUCT.md, PROMPT-PARA-CONTINUAR.md, ferramentas/ e .impeccable/.

COMO CONFERIR AS TELAS:
- Servidor local: python -m http.server 8000 --bind 127.0.0.1 --directory codigo/src/main/resources/web
  (modo demonstração; na porta 8080, com o Java, usa a API real).
- Fotos automáticas:
  node ferramentas/fotografa-telas__Claude_Code_MS125_luisgfr.mjs http://127.0.0.1:8000 <pasta> [login]
  Olhe as fotos uma a uma antes de mostrar: celular 390 px, computador 1280 px, noite, modo escuro,
  letra a 150%, 360x640.
- Detector da Impeccable:
  - nos arquivos: impeccable detect --json <arquivos>;
  - nas telas com login: ferramentas/mantem-tela-aberta__Claude_Code_MS125_luisgfr.mjs + detect --cdp
    <porta> --target <rota> --json.
- Critique: /impeccable:impeccable critique <arquivo da tela>, com duas avaliações separadas (revisão de
  design com as 10 heurísticas de Nielsen + detector). Meta: nota ≥ 28/40, sem P0/P1, e o ok do Luis.
- Se o Claude Code ou a Impeccable não estiverem disponíveis, siga as notas do Sistema Visual e as regras
  acima à mão, e use os relatórios em docs/redesenho/critiques/ como modelo de avaliação.

Responda em português do Brasil. Comece confirmando que leu os arquivos e resuma em 5 linhas onde
paramos; depois faça as 3 perguntas do login.
```

## 3. Se for continuar direto na Parte B (sem terminar o redesenho)
Use o prompt da seção "Prompt pronto para a Parte B" do [[AGENTS]] e avise que o redesenho ficou incompleto. As telas antigas funcionam com o visual novo herdado, e o estado está em [[Redesenho - Passagem]].
