---
target: tela Hoje
total_score: 26
max_score: 40
na_heuristics: 
p0_count: 1
p1_count: 3
target_identity: "file:C:\\CuidaQuemCuida\\codigo\\src\\main\\resources\\web\\js\\telas\\hoje.js"
target_fingerprint: "sha256:a77694ae852a5c94696260bb6e42fac0fd411b0ce01d88a7e07835bb97ee1aaa"
target_path: "C:\\CuidaQuemCuida\\codigo\\src\\main\\resources\\web\\js\\telas\\hoje.js"
timestamp: 2026-11-14T13-19-19Z
slug: codigo-src-main-resources-web-js-telas-hoje-js
---
Método: duas avaliações separadas (A: revisão de design · B: detector nos arquivos e na tela renderizada, celular e computador)

# Critique da tela Hoje (14/11/2026)

## Nota de saúde do design
| # | Heurística | Nota | Problema principal |
|---|---|---|---|
| 1 | Visibilidade do estado | 3 | Confirmação da ação ótima; a tela não se atualiza sozinha (o "3h50" não diminui, não mostra o que outra pessoa fez) |
| 2 | Correspondência com o mundo real | 3 | "3h50" se confunde com hora; "Próximo" para algo atrasado; a Marta lê sobre si em terceira pessoa |
| 3 | Controle e liberdade | 2 | Sem desfazer; tarefa sem "não deu para fazer"; volta ao topo depois de cada registro |
| 4 | Consistência | 3 | "Próximo" × "Agora"; horas em dois formatos; "Posso cobrir" com o mesmo peso de "Dei o remédio" |
| 5 | Prevenção de erros | 2 | Tela parada abre risco de remédio em dobro; medição sem unidade nem faixa; linhas com alvo de 32 px |
| 6 | Reconhecer em vez de lembrar | 3 | "Dado" sem quem nem quando; fora do turno os feitos somem |
| 7 | Flexibilidade e eficiência | 2 | Vários itens no mesmo horário pedem um ciclo inteiro cada (recarregar, voltar ao topo) |
| 8 | Estética e minimalismo | 3 | Céu com ~55% da primeira tela; contagem é o maior texto; a mesma dose aparece 3 vezes |
| 9 | Recuperação de erros | 2 | Erro só no aviso de 5 s no rodapé; "(opcional)" obrigatório em "Outro motivo" |
| 10 | Ajuda | 3 | "Como fazer" bom; sem orientação em dose atrasada ou valor fora da faixa |
| **Total** | | **26/40** | **Aceitável** |

## Veredito de especificidade
Revisão: a metade de cima (céu, arco do turno, verbos de cuidado) é deste produto; a de baixo (cartão com ícone, linha do tempo de checks) é padrão de app de saúde. A rede, que é o diferencial, não aparece: nenhum nome, e o arco não diz quem assume.
Detector: 1 achado (`cream-palette`, fundo `#fff4ec`) nos arquivos e nas telas renderizadas de celular e computador. O fundo foi escolha do Luis na Fase 0 e tem exceção para o `index.html`; nas varreduras renderizadas a exceção não vale, porque o detector lê uma URL. O detector não pegou o alvo de 32 px nem os textos abaixo de 18 px: o piso dele é 11 px, e os 18 px e 48 px são regras do projeto.
Camada visual: não disponível (só navegador sem janela).

## O que funciona
1. O arco do turno dá forma ao revezamento; "reduzir movimento" é respeitado.
2. Uma ação em destaque, com verbo; o "Não foi dado" escolhe o motivo sem culpa e sem digitar.
3. Estado com texto e ícone, não só cor; o "Como fazer" é ajuda de verdade.

## Problemas prioritários
- [P0] O destaque pega o pendente mais antigo, e a tarefa nunca vence. À noite manda uma tarefa de 12 h atrás e esconde o antibiótico das 22:00. Correção: o destaque passa a ser (1) dose dentro da janela de 120 min, (2) item da hora atual, (3) tarefa atrasada só sem ocorrência mais nova; as superadas vão para um grupo recolhido "Ficou para trás (n)". Comando: /impeccable harden
- [P1] Registrar o remédio não tem rede de proteção. Correção: atualizar ao voltar para a tela e a cada minuto ("atualizado às"); recarregar depois de conflito (409); redesenhar no lugar, sem voltar ao topo; "Desfazer" por 5 s; "Dado por Marta · 06:12" (os dados não vêm no `/hoje`: buscar à parte ou registrar decisão). Comando: /impeccable harden
- [P1] A noite só existe no céu. Correção: modo noturno de verdade (tokens noturnos pelo período e pela preferência de modo escuro, mais o theme-color). Comando: /impeccable colorize
- [P1] "Cuidar de quem cuida" virou uma linha com "Ok". Correção: sobrecarga de quem vê fala com a pessoa, com "Pedir ajuda à rede", no topo; sem "Posso cobrir" para quem está sobrecarregado; um só botão preenchido; sem alerta repetindo o destaque; "Entendi" no lugar de "Ok". Comando: /impeccable clarify
- [P2] A primeira tela é do céu e o botão encosta no menu; "3h50" ambíguo. Correção: céu compacto no celular; cartão mais acima; "faltam 3 h 50 min · até 14:00". Comando: /impeccable layout

## Alertas por persona
- Marta: a tela clara ofusca de madrugada; "dei o remédio das 20h?" sem resposta clara; alerta do cansaço em terceira pessoa, com "Posso cobrir".
- Paulo: "Feito" para tarefa que não pode fazer; não sabe quem está com a Lurdes; tela parada leva a remédio em dobro.
- João: summary de 32 px e "Como fazer" de ~24 px; textos de 13 a 15 px; sem desfazer; "Ok" parece confirmação.
- Casey: volta ao topo depois de cada registro.
- Sam: os avisos `role=alert` são relidos a cada registro; três "Ok" com o mesmo nome acessível; erro não ligado ao campo.
- Riley: vírgula decimal pode chegar vazia; "(opcional)" obrigatório; contagem e data paradas.

## Observações menores
`font-size` em px no html (112.5% respeita a escolha do usuário); "feitos" conta o "Não dado"; falta o aviso médico na Hoje; medição sem unidade e mínima da pressão não obrigatória; "Dei o remédio" ativo com o formulário aberto; botão desabilitado sem sinal de carregando; coluna de 720 px no computador.

## Perguntas para pensar
1. O arco poderia mostrar quem assume o próximo turno?
2. Tarefa de 2 em 2 h que passou há 12 h ainda é tarefa, ou é aviso para a coordenadora?
3. Quem está há 88 h sem folga deveria ver "Posso cobrir"?
4. Se a noite é o uso mais comum, por que o padrão é o modo de dia?
