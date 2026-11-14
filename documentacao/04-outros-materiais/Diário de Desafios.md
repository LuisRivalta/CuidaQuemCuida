---
titulo: Diário de Desafios
tags: [engenharia, desafios]
---

# Diário de Desafios

Um registro por problema **real** encontrado durante o projeto: o problema, o que tentamos, o que decidimos, o trecho que mostra a solução e a data. Os dois melhores vão para o vídeo técnico ([[Roteiro - Técnico]]). Ver também [[Registro de Decisões]].

**Modelo de entrada:**
> **Problema:** ... · **O que tentamos:** ... · **Decisão:** ... · **Trecho:** ... · **Data:** ...

---

## 1. Detectar conflito de turnos com eficiência (13/11/2026) ⭐ vídeo
- **Problema:** para recusar um turno sobreposto, é preciso comparar os turnos da pessoa. Comparar todos com todos cresce ao quadrado: O(n²).
- **O que tentamos:** a primeira ideia foi ordenar pelo início e comparar cada turno só com o de "maior fim visto até ali". Ao escrever os testes, vimos que ela **perde pares**: se um turno longo (6h–23h) cobre outros dois que também se sobrepõem entre si (8h–12h e 10h–14h), o par do meio não é encontrado.
- **Decisão:** ordenar pelo início e varrer mantendo uma **fila de prioridade (pelo fim) com os turnos ainda abertos**. Ela encontra todos os pares em O(n log n + k). A versão ingênua ficou no código só para o teste provar que as duas dão o mesmo resultado.
- **Trecho:** [[conflitos]] (`EscalaRegras.conflitos`); testes `versaoRapidaAchaTodosOsParesQuandoUmTurnoLongoCobreOutros` e `versaoRapidaEVersaoIngenuaAchamOsMesmosConflitos`.
- **Conteúdo do curso:** Fase 6, "Matematizando a eficiência".

## 2. Duas pessoas registrando a mesma dose (13/11/2026) ⭐ vídeo
- **Problema:** numa rede, a filha e o vizinho podem tocar em "Dei o remédio" quase ao mesmo tempo. Ler o status e depois gravar deixa uma janela em que os dois leem "pendente", e um sobrescreve o registro do outro.
- **Decisão:** a condição vai **dentro do próprio UPDATE** (`WHERE id = ? AND status = 'PENDENTE'`), e o Java olha quantas linhas foram alteradas. Zero linhas = alguém registrou antes → 409 "Essa dose já foi registrada por Marta Souza".
- **Trecho:** [[registrar dose]]; o mesmo padrão em "assumir turno vago" (`WHERE pessoa_id IS NULL`) e "tarefa feita" (`WHERE feita_em IS NULL`).

## 3. Um computador da equipe sem Java (13/11/2026)
- **Problema:** o computador usado para começar a construção não tem Java e não permite instalar programas.
- **O que tentamos:** procurar algum JDK já instalado no disco (não havia nenhum).
- **Decisão:** separar o trabalho. As telas ganharam um **modo demonstração**, com o contrato da API inteiro em memória (`demo.js`), e foram construídas e testadas nesse computador, com um roteiro automático e fotos num navegador. O Java foi escrito com os testes primeiro, e a compilação e os testes ficaram para o computador com Java.
- **Ganho extra:** o modo demonstração permite apresentar as telas mesmo sem internet ou sem o banco.

## 4. Telas travando ao carregar (13/11/2026)
- **Problema:** o arquivo principal das telas (`app.js`) carregava as telas com espera no topo do módulo, e as telas importavam o `app.js` de volta. Com módulos JavaScript, esse ciclo faz um esperar pelo outro para sempre.
- **Decisão:** separar o registro das telas num módulo próprio (`rotas.js`), que as telas importam sem criar o ciclo.

## 5. Defeitos que só apareceram olhando as telas (13/11/2026)
Achados ao fotografar automaticamente as 16 telas em tamanho de celular:
- **Topo e menu aparecendo na tela de login:** o CSS dava `display` a esses elementos e isso anulava o atributo `hidden`. Correção: uma regra global `[hidden] { display: none !important; }`.
- **A palavra "null" escrita na tela:** a função nativa `replaceChildren`, ao receber `null`, escreve o texto "null". Correção: uma função `preencher()` que ignora os vazios, usada em todas as telas.
- **Gráfico com horas negativas** na demonstração: a série simulada passava de zero. Correção: limitar a zero.
- **Tabela de "Dados coletados" cortada no celular:** 4 colunas não cabiam. Correção: um cartão por dado.

## 6. Coluna nula lida errado do banco (13/11/2026)
- **Problema:** no JDBC, `rs.wasNull()` responde sobre a **última coluna lida**. No mapeamento do turno, a coluna `pessoa_id` era lida e só depois de ler outras colunas se perguntava `wasNull()`. Um turno vago viraria "pessoa 0".
- **Decisão:** guardar o resultado logo depois de ler a coluna (`Long pessoaId = rs.wasNull() ? null : pessoa;`).
- **Trecho:** `TurnoDao.mapear`.

## 7. Rotas do paciente sumindo, um risco do JAX-RS (13/11/2026)
- **Problema:** o JAX-RS escolhe **um único recurso raiz** pelo caminho. Uma classe com `@Path("pacientes/{id}")` "roubaria" pedidos como `/pacientes/1/membros`, e a outra classe nunca seria consultada (404).
- **Decisão:** todas as rotas `/pacientes/**` numa só classe (`PacienteResource`), que só delega aos serviços.

## 8. Acesso às fontes da Escala Zarit (13/11/2026)
- **Problema:** as páginas dos artigos com o texto oficial em português não abriram na rede usada (erro de certificado).
- **Decisão:** o texto das 12 perguntas foi escrito a partir da tradução brasileira e marcado como **não conferido** (`"conferido": false`). A conferência com a fonte original ficou como passo obrigatório antes de gravar o vídeo (Tarefa B4).

## 9. Tela em branco depois de atualizar as telas (14/11/2026)
- **Problema:** depois de atualizar os módulos JavaScript, o navegador continuou usando uma versão antiga de `ui.js` guardada no cache. A tela de login importava uma função nova (`deHtml`), que não existia no arquivo antigo. O navegador acusou "does not provide an export named 'deHtml'", e a tela ficou em branco.
- **O que tentamos:** recarregar a página do jeito normal não resolveu, porque o navegador manteve o arquivo do cache.
- **Decisão:** recarregar ignorando o cache (Ctrl+F5) sempre que as telas forem atualizadas, e desligar o cache no roteiro automático de fotos. A orientação ficou anotada para o dia da gravação. Uma melhoria possível, ainda não feita, é o servidor mandar o cabeçalho `Cache-Control`.

## 10. Registrar rápido sem perder a segurança (14/11/2026) ⭐ vídeo
- **Problema:** tocar em "Dei o remédio" precisa ser instantâneo (quem cuida tem pressa), mas um toque errado num remédio é grave, a internet cai e a API não tem rota para corrigir um registro.
- **O que tentamos:**
  1. Registrar na hora e redesenhar a tela inteira: a pessoa perdia o lugar e não tinha como voltar atrás.
  2. Um "Desfazer" de 5 s no aviso do rodapé: na revisão de usabilidade apareceu que um segundo registro apagava o "Desfazer" do primeiro e que a atualização automática redesenhava a tela por cima.
- **Decisão:**
  - o registro aparece na hora, mas fica guardado no navegador (uma fila por pessoa) e só vai ao servidor depois de 15 s para remédio, ou 8 s para o resto, com "Desfazer" no próprio item e o tempo à vista;
  - sair do app envia na hora;
  - sem internet, o registro fica na fila e é enviado depois;
  - a tela não se redesenha enquanto há registro esperando, e fica travada ao voltar ao app até chegar a versão nova.
- **Trecho:** `registrarComDesfazer`, `enviar` e `atualizar` em `codigo/src/main/resources/web/js/telas/hoje.js`.

## 11. Divergência no item final da Zarit (14/11/2026)

- **Problema:** a pergunta final usava o item 21 da escala completa. O Quadro 1 do estudo brasileiro de 2019 usa o item 22, sobre a intensidade da sobrecarga percebida.
- **O que tentamos:** cruzamos a seleção do estudo com a Tabela 1 da tradução de Scazufca e conferimos o tipo de resposta de cada item.
- **Decisão:** usar o item 22 com opções de intensidade, mantendo os escores de 0 a 4. A redação segue adaptada para autoaplicação. Referências em [[Escala Zarit]].

## 12. Compilação limpa com servidor em execução (14/11/2026)

- **Problema:** no Windows, o `mvn clean test` não conseguiu apagar `target/classes/web/js/ui.js` enquanto o servidor servia os arquivos.
- **O que tentamos:** repetimos o comando com Temurin 21 e confirmamos a falha na etapa `clean`.
- **Decisão:** parar o servidor antes de limpar, rodar `mvn clean test` e subir novamente com `mvn compile exec:java`. A compilação limpa passou com os 64 testes.

## 13. Navegação rápida depois do login (14/11/2026)

- **Problema:** ao entrar e abrir o questionário imediatamente, o teste do navegador em uma execução deixou de encontrar as respostas da primeira pergunta. As telas compartilhavam o mesmo elemento, inclusive quando uma consulta da tela anterior ainda estava em andamento.
- **O que tentamos:** reproduzimos o fluxo de login, mudança imediata de tela e abertura da primeira pergunta.
- **Decisão:** cada navegação recebe um elemento de conteúdo próprio. A interface ignora retornos que já perderam a conexão com a página. O teste repetido completou as 12 perguntas e exibiu 48 pontos.

## A acompanhar (previstos, ainda não aconteceram)
- Conexão com o Supabase: a conexão direta só funciona em IPv6; usar o "Session pooler".
