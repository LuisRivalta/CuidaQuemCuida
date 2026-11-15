# CuidaQuemCuida

## Direção visual

O céu acompanha a hora em que a rede cuida. No login, a paisagem apresenta a marca e dá lugar ao formulário. Em Hoje, o arco do turno mostra o tempo restante e o cartão seguinte apresenta a próxima ação. Nas telas internas, use a cor e a hierarquia desses componentes para apoiar a tarefa da página.

## Cores

| Papel | Claro | Noturno |
|---|---|---|
| Fundo | `#fff4ec` | `#121830` |
| Superfície principal | `#ffffff` | `#1c2340` |
| Superfície secundária | `#f4ece1` | `#252d4d` |
| Texto | `#1e2a47` | `#f3ecdf` |
| Texto de apoio | `#586179` | `#b8bed3` |
| Ação principal | `#1e2a47` | `#ffd2b8` |
| Foco | `#1e2a47` | `#ffd2b8` |
| Confirmação | `#2f6b4f` sobre `#e3efe5` | `#9fd3b2` sobre `#1f3a33` |
| Atenção | `#8a4b00` sobre `#ffecd2` | `#ffc976` sobre `#3a2e18` |
| Erro e urgência | `#a8321e` sobre `#fde6df` | `#ff9c86` sobre `#3d2026` |

Coral `#ef8a62` e sálvia `#7aa98a` compõem o símbolo dos dois corações. O céu troca sua paleta de manhã, à tarde, à noite e de madrugada. O tema noturno acompanha a preferência do aparelho ou o horário entre 18h e 6h.

## Tipografia e medidas

- Young Serif para títulos e números em destaque. Lexend para navegação, formulários e leitura. Use Georgia e as fontes do sistema como reserva.
- Texto base de 18 px, definido em percentual para acompanhar a preferência do navegador. Controles têm alvos de pelo menos 48 px e foco visível.
- Margem lateral de 20 px. Cantos de 20 px para superfícies e 28 px para cartões em destaque. Use sombras suaves e a elevação maior para o cartão Agora, o login e a navegação.
- A coluna de leitura tem até 720 px. Em computador, o login usa duas colunas e o menu fica à esquerda.

## Componentes

- Nas páginas internas, o título aparece sobre o fundo da página. Use superfícies com borda fina para formulários e grupos de conteúdo. Na Escala, as linhas têm divisórias e os dias vazios podem ser consultados em um grupo recolhido.
- Em Mais, agrupe cadastro, ficha e convite em Pacientes. Na Escala, identifique o paciente atual e a opção ativa entre Todos os turnos e Meus turnos.
- O cartão Agora mostra uma ação principal. Anteponha a orientação ou o horário à ação quando a pessoa precisar conferir algo antes de registrar.
- O caminho do dia usa horário, texto de estado e ícone. Mantenha os registros feitos recolhidos, disponíveis para consultar.
- Avisos devem indicar o que ocorreu e a ação possível. Mostre erros de campo junto ao formulário e preserve o conteúdo já preenchido.
- Use ícones SVG com traço de 2 px e rótulos de texto para ações. Mantenha estados de interação distinguíveis com teclado e sem depender de cor.
- O login mantém a marca inteira em telas estreitas. O botão que revela a senha tem espaço próprio ao lado do campo. Na demonstração, as quatro pessoas da família Souza têm seus papéis descritos.

## Movimento

Use a entrada dos corações, o arco e as confirmações para orientar a atenção. Respeite a preferência de movimento reduzido. O conteúdo e as ações precisam funcionar sem GSAP.

Implementação em `codigo/src/main/resources/web/css/estilo.css`. Variações do céu e componentes em [[Redesenho - Sistema Visual]].
