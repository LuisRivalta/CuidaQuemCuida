---
tipo: classe
camada: infra
arquivo: codigo/src/main/java/br/com/cuidaquemcuida/infra/Sql.java
tags: [classe, infra]
---

# Sql

**Classe** da camada **Infraestrutura** · `codigo/src/main/java/br/com/cuidaquemcuida/infra/Sql.java`

## Para que serve
Acesso ao banco por JDBC (Fase 4). Todo comando usa PreparedStatement com "?", o que impede injeção de SQL (Fase 3, cybersecurity). Cada comando é medido e registrado no `LogSql`. Comandos dentro de `#transacao` usam a mesma conexão e são confirmados juntos (ou desfeitos juntos).

## Tipos internos
`interface Mapeador`

## Métodos
| Método | O que faz |
|---|---|
| `listar(String sql, Mapeador<T> mapeador, Object... parametros) → estático <T> List<T>` |  |
| `um(String sql, Mapeador<T> mapeador, Object... parametros) → estático <T> Optional<T>` |  |
| `executar(String sql, Object... parametros) → estático int` | INSERT, UPDATE ou DELETE. Devolve quantas linhas foram afetadas. |
| `inserir(String sql, Object... parametros) → estático long` | INSERT terminado em "RETURNING id". Devolve o id gerado. |
| `transacao(Supplier<T> trabalho) → estático <T> T` | Executa vários comandos como uma unidade: ou todos são gravados, ou nenhum. |

## Usa
[[ApiException]], [[Conexao]], [[LogSql]]

## É usada por
[[AlertaDao]], [[AuditoriaDao]], [[ConsentimentoDao]], [[ContaService]], [[DoseDao]], [[EstatisticaDao]], [[MedicacaoService]], [[MedicamentoDao]], [[MembroRedeDao]], [[PacienteDao]], [[PessoaDao]], [[RedeService]], [[SessaoDao]], [[SinalVitalDao]], [[SinalVitalService]], [[TarefaDao]], [[TarefaService]], [[TurnoDao]], [[ZaritDao]], [[ZaritService]]

## Conceito do curso
JDBC com PreparedStatement (Fase 4: "Quando o café javanês consulta o oráculo"); impede injeção de SQL (Fase 3: cybersecurity)

---
Ver também: [[Mapa do Código]] · [[Diagrama de Classes]] · [[Arquitetura]]
