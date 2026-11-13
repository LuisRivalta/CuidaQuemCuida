---
titulo: Conteúdos do Curso
tags: [curso, conteudos]
---

# Conteúdos do ano letivo usados no projeto

O vídeo técnico precisa "apontar quais conceitos aprendidos foram utilizados na implementação" e ilustrar com exemplos reais. Esta é a lista, com o lugar exato de cada um. Ver [[Mapa do Código]] e [[Roteiro - Técnico]].

| Fase | Capítulo / conteúdo | Onde está no CuidaQuemCuida | Para mostrar no vídeo |
|---|---|---|---|
| 1 Agile | Scrum na prática | Sprints, backlog, Kanban, revisão e retrospectiva | [[Métodos Ágeis]], [[Kanban]] |
| 1 | Desvendando a cabeça do usuário | Personas que guiaram as decisões | [[Personas]] |
| 1 | Benditos gráficos do dia a dia | Painel com Chart.js, paleta para daltonismo | Tela do painel |
| 1 | Está na média ou na moda? | Média, mediana e moda das horas por turno e da Zarit; horário com mais atrasos | [[Estatística]] |
| 2 OOP | Entendendo o ponto de vista do usuário; Lab: casos de uso | 16 casos de uso com fichas | [[Casos de Uso]] |
| 2 | Diagramas para simplificar fluxos | 3 fluxos de atividades | [[Fluxo - Dar o Remédio]] |
| 2 | Pensando software orientado a objetos; diagrama de classes | Modelo do domínio, alertas, regras | [[Diagrama de Classes]] |
| 2 | Programando classes, objetos e métodos | `Turno.sobrepoe()`, `Turno.noturno()`, `TarefaCuidado.horariosDoDia()` | [[Turno]] |
| 2 | Quando as partes se conversam | Telas → recursos → serviços → DAOs (camadas) | [[Arquitetura]] |
| 2 | Spreadable data | Desvio padrão e coeficiente de variação da carga | [[desvioPadrao]] |
| 2 | Qual é a chance de...? | Chance de atraso à noite × de dia | [[EstatisticaService]] |
| 3 DB | Escondendo com classe! (encapsulamento) | Atributos privados com validação no construtor e no setter | [[Pessoa]], [[Turno]] |
| 3 | Herança em classes? Polimorfismo em objetos? | `Pessoa` → `Cuidador`/`Paciente`; `RegraHorario` → 3 regras; `Alerta` → 7 alertas | [[horariosEntre]], [[Alerta]] |
| 3 | Modelo entidade-relacionamento; modelagem avançada | DER com 17 tabelas; N:N `membro_rede` | [[Diagrama do Banco]] |
| 3 | Aprendendo a armazenar de maneira correta | Normalização (`resposta_zarit` em linhas; `regra_horario` 1:1) | [[Diagrama do Banco]] |
| 3 | Definindo as estruturas físicas; SQL kickstart | DDL com `CHECK`, `UNIQUE`, chaves estrangeiras e índices | `banco/01-criar-tabelas.sql` |
| 3 | Cybersecurity e ISO 27000; direito digital | Hash de senha, token, RLS, `PreparedStatement`, consentimento | [[LGPD, Segurança e Acessibilidade]] |
| 4 Prototyping | Interfaces gráficas em front-end não integrado | Telas HTML, CSS e JS que consomem a API | `web/` |
| 4 | Quando o café javanês consulta o oráculo | JDBC: conexão, `PreparedStatement`, `ResultSet` (em PostgreSQL) | [[Sql]], [[TurnoDao]] |
| 4 | Inserção, atualização e exclusão de dados | CRUD completo (turnos, remédios, tarefas...); Banco ao vivo mostra cada comando | Tela Banco ao vivo |
| 5 | API RESTful e JAX-RS; criação de recursos RESTful | Jersey + Grizzly; 13 classes de recurso; códigos 200/201/204/400/401/403/404/409 | [[API]], [[PacienteResource]] |
| 5 | É fora da curva! | z-score dos sinais vitais | [[foraDaCurva]] |
| 5 | LGPD; auditoria de sistemas | Dados coletados, consentimento, anonimização, tabela `auditoria` | [[AuditoriaDao]] |
| 5 | Consultas SQL básicas e relacionais (junções) | `JOIN` turno × pessoa, dose × medicamento | [[EstatisticaDao]] |
| 6 | Análise com SQL: agrupamentos, totais e métricas | `GROUP BY` com `COUNT(*) FILTER` (adesão) | [[EstatisticaDao]] |
| 6 | SQL profissional: subconsultas | `HAVING SUM(...) > (SELECT AVG(...))` (acima da média) | [[EstatisticaDao]] |
| 6 | Matematizando a eficiência; ordenação | Conflitos O(n²) → O(n log n) com fila de prioridade | [[conflitos]] |
| 6 | IoT | Roadmap: pulseira que envia os sinais vitais sozinha | [[Roteiro - Pitch]] |

**Ficaram de fora de propósito:** blockchain, redes, engenharia social, recursão e árvores, porque não têm uso natural neste problema. As views do Oracle (Fase 7) ainda não foram estudadas.
