---
titulo: Redesenho — ferramentas e verificação
data: 2026-11-14
tags: [redesenho, ferramentas, impeccable, testes]
---

# Ferramentas e verificação do redesenho

Como o redesenho foi feito e conferido. Voltar para [[Redesenho - Passagem]].

## Ferramentas de design (Claude Code)
O trabalho foi feito no **Claude Code**, com dois plugins de design instalados:

| Plugin | Marketplace (repositório) | Para quê |
|---|---|---|
| **Impeccable** 4.9.1, com hooks | `pbakaus/impeccable`, nome `impeccable@impeccable` | fluxo de design: `init`, `critique`, `document`, `polish`, `audit` etc.; detector automático de "cara de tela genérica" depois de cada edição |
| **UI/UX Pro Max** 2.15.0 | `nextlevelbuilder/ui-ux-pro-max-skill`, nome `ui-ux-pro-max@ui-ux-pro-max-skill` | consulta de paletas e pares de fontes (foi usado na escolha das fontes) |

**Instalação numa máquina nova** (no terminal do Claude Code):
```
/plugin marketplace add pbakaus/impeccable
/plugin install impeccable@impeccable
/plugin marketplace add nextlevelbuilder/ui-ux-pro-max-skill
/plugin install ui-ux-pro-max@ui-ux-pro-max-skill
```
Depois, `/reload-skills`. Os comandos ficam como `/impeccable:impeccable <comando> [alvo]`.

**Sem o Claude Code ou sem os plugins:** as notas [[Redesenho - Sistema Visual]] e [[Redesenho - Tela Hoje]] descrevem o sistema e as regras. Dá para seguir o plano à mão. As notas de cada critique ([[Critique Hoje - rodada 4 (30 de 40)]] e outras) mostram o formato da avaliação: 10 heurísticas de Nielsen de 0 a 4, P0 a P3, personas.

## Motor da Impeccable (engine)
- Vários comandos (`context`, `detect`, `critique-storage`, `concept-seed`, `live`) precisam do motor `impeccable-windows-x64.exe`, versão **0.1.24**.
- O launcher (`.../skills/impeccable/scripts/impeccable.cmd`) baixa sozinho na primeira vez, de `https://github.com/pbakaus/impeccable/releases/download/engine-v0.1.24/impeccable-windows-x64.exe`.
- **Na rede da empresa, o download pelo `curl` falhou** ("CRYPT_E_NO_REVOCATION_CHECK" e depois "Connection was reset"). O Luis baixou pelo navegador. A impressão digital SHA-256 foi conferida contra o `engine-checksums.txt` do plugin: `c4e71217677f53beaabec1cd4823a9bb2587355615f1170cf5508e69be4587bc`. O arquivo foi copiado para `C:\Users\luisgfr\.impeccable\bin\0.1.24\impeccable.exe`.
- **Numa máquina nova:** rode `impeccable.cmd engine-probe` (deve responder `impeccable-engine 0.1.24`). Se o download falhar, baixe pelo navegador e salve como `%USERPROFILE%\.impeccable\bin\0.1.24\impeccable.exe`. O launcher confere o SHA-256 antes de usar.
- **Sem o motor, a Impeccable funciona em modo reduzido** (segue as regras à mão). Foi assim na Hoje e no login até o motor ser instalado.

## Arquivos da Impeccable no projeto
- `PRODUCT.md` (raiz): contexto do produto, que todos os comandos leem. Foi gravado na Fase 1 com as respostas do Luis ([[PRODUCT]]).
- `.impeccable/config.json`: exceções do detector, cada uma com o motivo:
  - `cream-palette` no `index.html`, porque o fundo pêssego `#fff4ec` foi escolha do Luis;
  - `tiny-text` e `undersized-ui-text` na folha `documentacao/02-wireframes/wireframes.html`, que tem telas em miniatura e vira imagem.
- `.impeccable/critique/`: relatórios de cada critique. **O Git ignora essa pasta** (só o `ignore.md` iria). As cópias ficaram em `docs/redesenho/critiques/`.
- `.impeccable/hook.cache.json`: cache local do hook, também fora do Git.
- **Ainda não existem** (Fase 3): `DESIGN.md` e `.impeccable/design.json`.

## Como rodar um critique
- **Comando:** `/impeccable:impeccable critique codigo/src/main/resources/web/js/telas/<tela>.js`.
- **Método:** duas avaliações independentes, em subagentes separados, que não veem o resultado uma da outra:
  - **A, revisão de design:** lê o `critique-rubric.md` da Impeccable, o `PRODUCT.md`, o código e as fotos. Dá nota de 0 a 4 nas 10 heurísticas, avalia carga cognitiva, jornada emocional, de 3 a 5 problemas P0 a P3 com o comando que corrige cada um e as personas (Marta, Paulo, João e as da rubrica).
  - **B, detector:**
    - `impeccable detect --json <arquivos>` (código de saída 0 = limpo, 2 = achados);
    - nas telas renderizadas: `detect --json --viewport 390x844 "http://127.0.0.1:8000/#/login"` para telas públicas, ou `detect --cdp <porta> --target <rota> --json` para telas que exigem login (ver o script abaixo).
- **Depois:**
  1. juntar as duas avaliações num relatório;
  2. salvar com `impeccable critique-storage write <arquivo> <corpo.md>` (variável `IMPECCABLE_CRITIQUE_META` com nota, máximo, P0 e P1);
  3. ver a tendência com `critique-storage trend <arquivo> 5`;
  4. fazer de 2 a 4 perguntas ao Luis (prioridade, escopo, intenção);
  5. aplicar as correções escolhidas.
- **Meta da Fase 2:** nota ≥ 28/40, nenhum P1 e o ok do Luis.

## Scripts de verificação (pasta `ferramentas/`, fora da entrega)
Precisam de **Node 22 ou mais novo** (nesta máquina: v26) e do **Edge ou Chrome**. Para usar outro navegador, defina a variável `CQC_NAVEGADOR` com o caminho do executável. Os dois usam a porta de depuração local, só em 127.0.0.1.

1. **`ferramentas/fotografa-telas__Claude_Code_MS125_luisgfr.mjs`**
   - `node ferramentas/fotografa-telas__Claude_Code_MS125_luisgfr.mjs http://127.0.0.1:8000 <pasta-saida>`
   - **Fotos da tela Hoje:**
     - `01` celular de dia (Marta);
     - `02` "Não foi dado", quando houver remédio pendente;
     - `03` noite (fuso de Tóquio, o que adianta o relógio em 12 h);
     - `10` turno da noite do Paulo com "Estava dormindo";
     - `06` modo escuro de dia;
     - `07` logo depois de registrar ("Desfazer");
     - `04` Paulo fora do turno;
     - `08` letra a 150%;
     - `09` primeira tela num 360×640;
     - `05` computador.
   - **Com `login` no fim:** só a tela de entrada (`10-login-celular`, `11-login-noite`, `12-login-computador`), mais um teste do botão "Entrar como Paulo".
   - **Também confere:** erros do console, conteúdo passando da largura, "null/undefined/NaN" na tela e se as fontes e o GSAP carregaram. Grava `erros.txt`.
   - **Desliga o cache do navegador** e recarrega a página a cada entrada (`?n=`), para não misturar dados de demonstração entre os passos.
   - **Os dados de demonstração dependem do relógio.** A foto `02` só mostra o formulário se houver remédio pendente no turno da Marta naquele horário, e a `10`, só se o remédio das 22h ainda estiver pendente. Perto da meia-noite de Tóquio (12h em Brasília), os dados mudam de dia.
2. **`ferramentas/mantem-tela-aberta__Claude_Code_MS125_luisgfr.mjs`**
   - `node ferramentas/mantem-tela-aberta__Claude_Code_MS125_luisgfr.mjs http://127.0.0.1:8000 9335 390 844 /hoje <pasta-perfil> light`
   - Entra como Marta, vai para a rota e fica aberto. Use com `impeccable detect --cdp 9335 --target hoje --json`. O último argumento pode ser `dark`, para o tema escuro.
   - Para fechar, encerre o processo (com Ctrl+C ou fechando o terminal).
   - Nesta máquina, os navegadores sem janela eram iniciados em segundo plano, um por porta: 9335 celular claro, 9336 celular escuro, 9337 computador.

## Outras conferências usadas
- `node --check <arquivo.js>`: sintaxe de cada módulo depois de editar.
- **Detector depois de cada edição:** o hook `PostToolUse` da Impeccable roda sozinho. Ele avisa "Design hook scanned … No deterministic design-quality issues found" ou lista os achados para triagem: corrigir, criar uma exceção com motivo, ou deixar com uma justificativa.
- **Fotos sempre olhadas uma a uma** antes de mostrar ao Luis, em celular de 390 px, computador de 1280 px, noite e escuro.

## Regras do PC da empresa (Bitdefender)
Valem para quem continuar nesta mesma máquina.
- Não passar código como texto a um interpretador (`node -e`, `python -c`): escrever num arquivo e rodar o arquivo.
- Não criar nem alterar scripts pelo shell (redirecionamento, `Set-Content`): usar o editor.
- Não baixar e rodar executáveis por conta própria. O motor da Impeccable foi baixado pelo Luis, e a impressão digital foi conferida.
- Os scripts criados levam o sufixo `__Claude_Code_MS125_luisgfr` e um registro no sistema de auditoria do Luis. Isso não vale para os arquivos entregáveis. O filtro `semcarimbo` do Git tira o cabeçalho de auditoria nos commits.
