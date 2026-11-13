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

## A acompanhar (previstos, ainda não aconteceram)
- Conexão com o Supabase: a conexão direta só funciona em IPv6; usar o "Session pooler".
- Versões das bibliotecas Jackson alinhadas pelo `jackson-bom` (conferir com `mvn dependency:tree`).
- Erros de compilação na primeira execução do Java (código escrito sem compilador): registrar aqui os que aparecerem.
