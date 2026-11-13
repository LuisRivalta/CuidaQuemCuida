---
tipo: classe
camada: resource
arquivo: codigo/src/main/java/br/com/cuidaquemcuida/resource/Dtos.java
tags: [classe, resource]
---

# Dtos

**Classe** da camada **API REST (JAX-RS)** · `codigo/src/main/java/br/com/cuidaquemcuida/resource/Dtos.java`

## Para que serve
Formatos de entrada e saída da API (records viram JSON pelo Jackson). Os nomes dos campos seguem exatamente documentacao/03-especificacoes-tecnicas/API.md.

## Tipos internos
`record LoginEntrada`, `record PessoaResumo`, `record LoginSaida`, `record CadastroEntrada`, `record RedeDto`, `record PessoaDto`, `record PacienteResumo`, `record PacienteEntrada`, `record PacienteDto`, `record PacienteCriado`, `record EntrarEntrada`, `record EntrarSaida`, `record ConviteSaida`, `record MembroDto`, `record PapelEntrada`, `record CompartilharEntrada`, `record CompartilharSaida`, `record TurnoEntrada`, `record TurnoDto`, `record TurnoCurto`, `record SugestaoDto`, `record ConflitoDto`, `record IntervaloDto`, `record SobrecargaDto`, `record AnaliseDto`, `record RegraDto`, `record MedicamentoDto`, `record DoseDto`, `record RegistroDoseEntrada`, `record SinalEntrada`, `record SinalDto`, `record FaixaDto`, `record TarefaDto`, `record ExecucaoDto`, `record ZaritEntrada`, `record ZaritCriada`, `record AvaliacaoDto`, `record MinhasZarit`, `record PedirAjudaEntrada`, `record PedirAjudaSaida`, `record AlertaDto`, `record ItemHoje`, `record PacienteNome`, `record HojeDto`, `record TaxaNome`, `record TaxaPeriodo`, `record Adesao`, `record Carga`, `record Equilibrio`, `record PontoSerie`, `record SerieDto`, `record Medidas`, `record Chance`, `record ZaritEstatistica`, `record EstatisticasDto`

## Métodos
| Método | O que faz |
|---|---|
| `LoginEntrada(String email, String senha) → record` |  |
| `PessoaResumo(long id, String nome, String email) → record` |  |
| `LoginSaida(String token, PessoaResumo pessoa) → record` |  |
| `CadastroEntrada(String nome, String email, String senha, String telefone, LocalDate dataNascimento, String genero, Boolean aceiteTermo, String versaoTermo) → record` |  |
| `RedeDto(long pacienteId, String pacienteNome, Papel papel, Vinculo vinculo, boolean compartilhaZarit) → record` |  |
| `PessoaDto(long id, String nome, String email, String telefone, LocalDate dataNascimento, String genero, List<RedeDto> redes) → record` |  |
| `PacienteResumo(long id, String nome, String condicao, Papel papel) → record` |  |
| `PacienteEntrada(String nome, LocalDate dataNascimento, String condicao, Boolean precisa24h, String observacoes, String responsavelNome, String responsavelParentesco, Boolean declaracaoAutorizacao) → record` |  |
| `PacienteDto(long id, String nome, LocalDate dataNascimento, String condicao, boolean precisa24h, String observacoes, String responsavelNome, String responsavelParentesco, String codigoConvite) → record` |  |
| `PacienteCriado(long id, String nome, String codigoConvite) → record` |  |
| `EntrarEntrada(String codigo, Vinculo vinculo) → record` |  |
| `EntrarSaida(long pacienteId, String pacienteNome) → record` |  |
| `ConviteSaida(String codigoConvite) → record` |  |
| `MembroDto(long pessoaId, String nome, Papel papel, Vinculo vinculo, double horas7d) → record` |  |
| `PapelEntrada(Papel papel) → record` |  |
| `CompartilharEntrada(Boolean compartilha) → record` |  |
| `CompartilharSaida(boolean compartilha) → record` |  |
| `TurnoEntrada(Long pessoaId, LocalDateTime inicio, LocalDateTime fim, StatusTurno status) → record` |  |
| `TurnoDto(long id, Long pessoaId, String pessoaNome, LocalDateTime inicio, LocalDateTime fim, StatusTurno status, boolean noturno) → record` |  |
| `TurnoCurto(long id, LocalDateTime inicio, LocalDateTime fim) → record` |  |
| `SugestaoDto(long pessoaId, String nome, double horas7d) → record` |  |
| `ConflitoDto(TurnoDto turnoA, TurnoDto turnoB) → record` |  |
| `IntervaloDto(LocalDateTime inicio, LocalDateTime fim) → record` |  |
| `SobrecargaDto(long pessoaId, String nome, double horas7d, double horasSeguidas, EscalaRegras.NivelSobrecarga nivel) → record` |  |
| `AnaliseDto(List<ConflitoDto> conflitos, List<IntervaloDto> vagos, List<SobrecargaDto> sobrecarga) → record` |  |
| `RegraDto(TipoRegra tipo, Integer intervaloHoras, LocalTime primeiraDose, List<LocalTime> horarios, LocalDate inicio, LocalDate fim) → record` |  |
| `MedicamentoDto(Long id, String nome, String dosagem, String via, String instrucoes, Boolean ativo, RegraDto regra) → record` |  |
| `DoseDto(long id, long medicamentoId, String medicamentoNome, String dosagem, LocalDateTime previstoPara, StatusDose status, LocalDateTime dadaEm, String dadaPorNome, String observacao) → record` |  |
| `RegistroDoseEntrada(String observacao, String motivo) → record` |  |
| `SinalEntrada(TipoSinal tipo, Double valor, Double valor2, LocalDateTime medidoEm) → record` |  |
| `SinalDto(long id, TipoSinal tipo, double valor, Double valor2, LocalDateTime medidoEm, String medidoPorNome, String alerta) → record` |  |
| `FaixaDto(TipoSinal tipo, Double minimo, Double maximo) → record` |  |
| `TarefaDto(Long id, String titulo, String orientacao, Integer recorrenciaHoras, LocalTime primeiraVez, TipoSinal tipoSinal, Boolean ativa) → record` |  |
| `ExecucaoDto(long id, long tarefaId, String titulo, String orientacao, TipoSinal tipoSinal, LocalDateTime previstaPara, LocalDateTime feitaEm, String feitaPorNome) → record` |  |
| `ZaritEntrada(int[] respostas, Double horasSono, Integer qualidadeSono) → record` |  |
| `ZaritCriada(long id, int pontuacao, FaixaZarit faixa, LocalDateTime respondidaEm) → record` |  |
| `AvaliacaoDto(long id, int pontuacao, FaixaZarit faixa, LocalDateTime respondidaEm, Double horasSono, Integer qualidadeSono) → record` |  |
| `MinhasZarit(List<AvaliacaoDto> avaliacoes, LocalDate proximaSugerida) → record` |  |
| `PedirAjudaEntrada(List<Long> pacienteIds) → record` |  |
| `PedirAjudaSaida(int alertasCriados) → record` |  |
| `AlertaDto(long id, TipoAlerta tipo, String mensagem, int prioridade, LocalDateTime criadoEm, boolean lido) → record` |  |
| `ItemHoje(String tipo, long id, LocalDateTime horario, String titulo, String detalhe, String status, TipoSinal tipoSinal) → record` |  |
| `PacienteNome(long id, String nome) → record` |  |
| `HojeDto(PacienteNome paciente, TurnoCurto turnoAtual, TurnoCurto proximoTurno, List<ItemHoje> itens, List<AlertaDto> alertas) → record` |  |
| `TaxaNome(String nome, Double taxa) → record` |  |
| `TaxaPeriodo(Periodo periodo, Double taxa) → record` |  |
| `Adesao(Double geral, List<TaxaNome> porMedicamento, List<TaxaPeriodo> porPeriodo) → record` |  |
| `Carga(String nome, Double horas, Double percentual) → record` |  |
| `Equilibrio(Double desvioPadrao, Double coeficienteVariacao) → record` |  |
| `PontoSerie(LocalDate data, Double valor) → record` |  |
| `SerieDto(String nome, List<PontoSerie> serie) → record` |  |
| `Medidas(Double media, Double mediana, Double moda) → record` |  |
| `Chance(Double noturno, Double diurno) → record` |  |
| `ZaritEstatistica(int compartilharam, int total, Double media, Double mediana, Double moda, Double pearsonNoturnosZarit, Double pearsonNoturnosSono) → record` |  |
| `EstatisticasDto(int periodoDias, Adesao adesao, List<Carga> cargaPorPessoa, List<String> acimaDaMedia, Equilibrio equilibrio, List<SerieDto> mediaMovelHoras, Medidas horasPorTurno, Integer horaComMaisAtrasos, Chance chanceAtraso, ZaritEstatistica zarit) → record` |  |

## Usa
[[EscalaRegras]], [[FaixaZarit]], [[Papel]], [[Periodo]], [[StatusDose]], [[StatusTurno]], [[TipoAlerta]], [[TipoRegra]], [[TipoSinal]], [[Vinculo]]

## É usada por
[[AlertaDao]], [[AlertaResource]], [[AlertaService]], [[AuthResource]], [[ContaService]], [[DoseResource]], [[EscalaService]], [[EstatisticaService]], [[ExecucaoResource]], [[HojeResource]], [[HojeService]], [[MedicacaoService]], [[MedicamentoResource]], [[PacienteDao]], [[PacienteResource]], [[PessoaDao]], [[PessoaResource]], [[RedeService]], [[SinalVitalService]], [[TarefaResource]], [[TarefaService]], [[TurnoResource]], [[ZaritResource]], [[ZaritService]]

## Conceito do curso
Records como formato da API (JSON)

---
Ver também: [[Mapa do Código]] · [[Diagrama de Classes]] · [[Arquitetura]]
