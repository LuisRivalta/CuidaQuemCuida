# CuidaQuemCuida

Rede de apoio e revezamento para cuidadores familiares.
**"Os apps que existem cuidam do paciente. O CuidaQuemCuida cuida também de quem cuida."**

Projeto da Global Solution 2º semestre/2026 (tema CitizenTech) — FIAP, Sistemas de Informação, turma **2SIOA**.

**Equipe:** Luis (Product Owner) e Gabriel Vilela (Scrum Master e validação).

## O que faz
- Organiza a **escala de revezamento** entre familiares e vizinhos voluntários: detecta conflito de horário, turno vago e sobrecarga, e sugere quem pode cobrir.
- Gera os **horários de medicação**, inclusive os complexos (de 8 em 8 horas, horários fixos, dias alternados), e registra quem deu cada dose.
- Registra **sinais vitais**, com alerta de valor fora da faixa ou fora do padrão do próprio paciente.
- Guia as **tarefas de cuidado** (mudar de posição, hidratação, higiene), com orientação de como fazer.
- Mede a **sobrecarga do cuidador** com a Escala Zarit (versão de 12 itens), com privacidade e pedido de ajuda à rede.
- Mostra um **painel estatístico**: adesão aos remédios, quem carrega o cuidado, média móvel de horas, correlação entre turnos noturnos e sobrecarga.

## Tecnologias
- **Java 21** com **Maven**
- API REST com **JAX-RS (Jersey) + Grizzly**
- **JDBC** com `PreparedStatement`
- **PostgreSQL** (Supabase, região São Paulo)
- Telas em **HTML, CSS e JavaScript** puros, pensadas para celular, com gráficos em **Chart.js**
- Testes com **JUnit 5**

Justificativas na especificação: `documentacao/03-especificacoes-tecnicas/Design da Solução.md`.

## Como rodar

### Pré-requisitos
- JDK 21 e Maven, ou o IntelliJ IDEA Community (que traz o Maven e baixa o JDK).
- Um banco PostgreSQL (por exemplo, um projeto gratuito no Supabase).

### Passos
1. **Banco:** rode, nesta ordem, os scripts da pasta `banco/`: `00-apagar-tabelas.sql`, `01-criar-tabelas.sql`, `02-ligar-rls.sql`, `03-dados-demo.sql`.
2. **Configuração:** copie `codigo/config.properties.exemplo` para `codigo/config.properties` e preencha a URL, o usuário e a senha do banco. Esse arquivo não vai para o Git.
3. **Testes:** dentro de `codigo/`, rode `mvn test`.
4. **Sistema:** dentro de `codigo/`, rode `mvn compile exec:java`.
5. Abra **http://localhost:8080** no navegador ou no celular (pelo IP do computador, na mesma rede Wi-Fi).

### Logins de demonstração
Todos com a senha `demo1234`:

| Pessoa | E-mail | Papel |
|---|---|---|
| Marta Souza | `marta@demo.cqc` | Coordenadora da rede |
| Paulo Souza | `paulo@demo.cqc` | Membro (filho) |
| Ana Souza | `ana@demo.cqc` | Membro (neta) |
| João Pereira | `joao@demo.cqc` | Membro (vizinho) |

### Modo demonstração das telas
As telas também funcionam **sem a API**, com dados de exemplo em memória. Elas entram nesse modo quando não são servidas pela porta 8080, ou com `?modo=demo` no endereço. Por exemplo, dentro de `codigo/src/main/resources/web`, rode `python -m http.server 8000` e abra `http://localhost:8000`. Uma faixa avisa "Modo demonstração".

### Instalar na tela inicial

Em um navegador compatível, abra o endereço em HTTPS e use a opção de instalar ou adicionar à tela inicial. No computador, também é possível testar a instalação em `http://localhost:8080`. A instalação abre o CuidaQuemCuida em uma janela própria. O app usa a conexão com o servidor para consultar e salvar os dados de cuidado.

Ao publicar a API atrás de HTTPS, configure o endereço inicial para encaminhar à página com `?modo=api`. O manifesto abre o endereço inicial em cada instalação.

## Documentação
Toda a documentação está em `documentacao/` (diagramas, wireframes, especificações técnicas e outros materiais). Comece pelo `documentacao/Mapa do Projeto.md` ou pela compilação `documentacao/Documentação Completa.md`.
