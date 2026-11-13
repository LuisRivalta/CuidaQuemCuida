---
titulo: Roteiro — Vídeo Técnico
duracao: até 3:00
tags: [video, tecnico]
---

# Roteiro — Vídeo Técnico (até 3:00)

Entrega 2 do [[Edital GS 2026]] (vale nota). Cada bloco cita o item do edital entre parênteses. **Antes de gravar:** rodar de novo os scripts `banco/00` a `03` no Supabase e reiniciar o sistema (Tarefa B6). Gravar com a Xbox Game Bar (Win+Alt+R) ou o OBS. Para o modo celular no navegador: F12 → Ctrl+Shift+M → iPhone 12 Pro. Material de apoio: [[Conteúdos do Curso]], [[Diário de Desafios]], [[Arquitetura]].

| Tempo | O que mostrar | O que falar | Item do edital |
|---|---|---|---|
| **0:00–0:25** | Terminal/IntelliJ: `mvn exec:java` → "CuidaQuemCuida rodando em http://localhost:8080". Navegador em modo celular: login como Paulo → tela Hoje | "Este é o CuidaQuemCuida rodando: uma aplicação Java 21 que sobe um servidor Grizzly com uma API REST em JAX-RS (Jersey) e entrega as telas pensadas para o celular." | Sistema Java em funcionamento |
| **0:25–1:00** | Em duas metades da tela: o celular e a tela **Banco ao vivo** (ou a tabela `dose` no Supabase). 1) "Dei o remédio" → aparece o **UPDATE**. 2) Escala: criar turno → **INSERT**; criar sobreposto → 409. 3) Excluir o turno → **DELETE**. 4) Abrir o painel → os **SELECT** com `GROUP BY` | "Cada ação vira um comando SQL, sempre com PreparedStatement: os valores vão separados, como esses pontos de interrogação, o que impede injeção de SQL. Aqui, inserção, leitura, atualização e exclusão." | Armazenamento e requisições ao banco |
| **1:00–1:20** | Tela **Dados coletados** + trecho do termo no cadastro | "Coletamos dados de saúde, que são sensíveis pela LGPD. Por isso: consentimento destacado, cada pessoa vê só a rede dela, a escala de bem-estar é privada, senhas com hash PBKDF2, dados guardados no Brasil, e quem exclui a conta é anonimizado." | Dados coletados e como são tratados |
| **1:20–2:10** | 1) [[Diagrama de Classes]]: `Pessoa` → `Cuidador`/`Paciente`. 2) Código: `RegraHorario.horariosEntre()` e as 3 subclasses (polimorfismo). 3) `TurnoDao` com `PreparedStatement` e `ResultSet` (JDBC). 4) `PacienteResource` com `@Path`, `@GET`, `@POST` (JAX-RS). 5) [[Diagrama do Banco]] com a N:N `membro_rede`. 6) `EstatisticaDao`: `GROUP BY` e subconsulta no `HAVING` | "Usamos o que aprendemos no ano: orientação a objetos com encapsulamento, herança e polimorfismo; diagramas de classes, de casos de uso e o DER; JDBC; API REST com JAX-RS; e SQL com junções, agrupamentos e subconsultas para o painel estatístico." | Conceitos do ano letivo, com trechos de código |
| **2:10–2:45** | **Desafio 1:** [[conflitos]]: a versão O(n²) × a versão com fila de prioridade O(n log n), e o teste que prova que dão o mesmo resultado. **Desafio 2:** [[registrar dose]]: duas janelas tocando na mesma dose → "já registrada por Marta" e o `WHERE status = 'PENDENTE'` | "Primeiro desafio: detectar conflito de turnos com eficiência. Nossa primeira ideia perdia casos; a solução foi uma fila de prioridade, que passou de O(n²) para O(n log n). Segundo desafio: duas pessoas registrando o mesmo remédio ao mesmo tempo. Resolvemos colocando a condição dentro do próprio UPDATE." | Desafios técnicos e soluções |
| **2:45–3:00** | IntelliJ: rodar os testes → **62 de 62 verdes** | "As regras de negócio têm 62 testes automáticos com JUnit, escritos antes do código." | Testado e validado |

## Dicas
- Ensaiar com cronômetro: 3:00 passa rápido. Cortar falas, não blocos.
- Aumentar a fonte do IntelliJ (Ctrl+Shift+A → "Increase font size") e o zoom do navegador para 125%.
- Se algum desafio diferente acontecer na Sprint 2 (registrado no [[Diário de Desafios]]), ele pode substituir o desafio 2.

## Checklist
- [ ] Duração ≤ 3:00
- [ ] Mostra o Java rodando, as 4 operações no banco, os dados coletados, os conceitos com código, 2 desafios e os testes
- [ ] Dados resetados antes de gravar
- [ ] Link em `videos/links.txt`
