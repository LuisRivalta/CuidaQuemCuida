package br.com.cuidaquemcuida.resource;

import br.com.cuidaquemcuida.model.FaixaZarit;
import br.com.cuidaquemcuida.model.Papel;
import br.com.cuidaquemcuida.model.Periodo;
import br.com.cuidaquemcuida.model.StatusDose;
import br.com.cuidaquemcuida.model.StatusTurno;
import br.com.cuidaquemcuida.model.TipoRegra;
import br.com.cuidaquemcuida.model.TipoSinal;
import br.com.cuidaquemcuida.model.Vinculo;
import br.com.cuidaquemcuida.model.alerta.TipoAlerta;
import br.com.cuidaquemcuida.service.EscalaRegras;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

/**
 * Formatos de entrada e saída da API (records viram JSON pelo Jackson).
 * Os nomes dos campos seguem exatamente documentacao/03-especificacoes-tecnicas/API.md.
 */
public final class Dtos {

    private Dtos() {
    }

    // ---------------------------------------------------------------- login e pessoas
    public record LoginEntrada(String email, String senha) {
    }

    public record PessoaResumo(long id, String nome, String email) {
    }

    public record LoginSaida(String token, PessoaResumo pessoa) {
    }

    public record CadastroEntrada(String nome, String email, String senha, String telefone, LocalDate dataNascimento,
                                  String genero, Boolean aceiteTermo, String versaoTermo) {
    }

    public record RedeDto(long pacienteId, String pacienteNome, Papel papel, Vinculo vinculo, boolean compartilhaZarit) {
    }

    public record PessoaDto(long id, String nome, String email, String telefone, LocalDate dataNascimento, String genero,
                            List<RedeDto> redes) {
    }

    // ---------------------------------------------------------------- pacientes e rede
    public record PacienteResumo(long id, String nome, String condicao, Papel papel) {
    }

    public record PacienteEntrada(String nome, LocalDate dataNascimento, String condicao, Boolean precisa24h, String observacoes,
                                  String responsavelNome, String responsavelParentesco, Boolean declaracaoAutorizacao) {
    }

    public record PacienteDto(long id, String nome, LocalDate dataNascimento, String condicao, boolean precisa24h,
                              String observacoes, String responsavelNome, String responsavelParentesco, String codigoConvite) {
    }

    public record PacienteCriado(long id, String nome, String codigoConvite) {
    }

    public record EntrarEntrada(String codigo, Vinculo vinculo) {
    }

    public record EntrarSaida(long pacienteId, String pacienteNome) {
    }

    public record ConviteSaida(String codigoConvite) {
    }

    public record MembroDto(long pessoaId, String nome, Papel papel, Vinculo vinculo, double horas7d) {
    }

    public record PapelEntrada(Papel papel) {
    }

    public record CompartilharEntrada(Boolean compartilha) {
    }

    public record CompartilharSaida(boolean compartilha) {
    }

    // ---------------------------------------------------------------- escala
    public record TurnoEntrada(Long pessoaId, LocalDateTime inicio, LocalDateTime fim, StatusTurno status) {
    }

    public record TurnoDto(long id, Long pessoaId, String pessoaNome, LocalDateTime inicio, LocalDateTime fim,
                           StatusTurno status, boolean noturno) {
    }

    public record TurnoCurto(long id, LocalDateTime inicio, LocalDateTime fim) {
    }

    public record SugestaoDto(long pessoaId, String nome, double horas7d) {
    }

    public record ConflitoDto(TurnoDto turnoA, TurnoDto turnoB) {
    }

    public record IntervaloDto(LocalDateTime inicio, LocalDateTime fim) {
    }

    public record SobrecargaDto(long pessoaId, String nome, double horas7d, double horasSeguidas, EscalaRegras.NivelSobrecarga nivel) {
    }

    public record AnaliseDto(List<ConflitoDto> conflitos, List<IntervaloDto> vagos, List<SobrecargaDto> sobrecarga) {
    }

    // ---------------------------------------------------------------- medicação
    public record RegraDto(TipoRegra tipo, Integer intervaloHoras, LocalTime primeiraDose, List<LocalTime> horarios,
                           LocalDate inicio, LocalDate fim) {
    }

    public record MedicamentoDto(Long id, String nome, String dosagem, String via, String instrucoes, Boolean ativo, RegraDto regra) {
    }

    public record DoseDto(long id, long medicamentoId, String medicamentoNome, String dosagem, LocalDateTime previstoPara,
                          StatusDose status, LocalDateTime dadaEm, String dadaPorNome, String observacao) {
    }

    public record RegistroDoseEntrada(String observacao, String motivo) {
    }

    // ---------------------------------------------------------------- sinais vitais
    public record SinalEntrada(TipoSinal tipo, Double valor, Double valor2, LocalDateTime medidoEm) {
    }

    public record SinalDto(long id, TipoSinal tipo, double valor, Double valor2, LocalDateTime medidoEm, String medidoPorNome,
                           String alerta) {
    }

    public record FaixaDto(TipoSinal tipo, Double minimo, Double maximo) {
    }

    // ---------------------------------------------------------------- tarefas
    public record TarefaDto(Long id, String titulo, String orientacao, Integer recorrenciaHoras, LocalTime primeiraVez,
                            TipoSinal tipoSinal, Boolean ativa) {
    }

    public record ExecucaoDto(long id, long tarefaId, String titulo, String orientacao, TipoSinal tipoSinal,
                              LocalDateTime previstaPara, LocalDateTime feitaEm, String feitaPorNome) {
    }

    // ---------------------------------------------------------------- bem-estar (Zarit)
    public record ZaritEntrada(int[] respostas, Double horasSono, Integer qualidadeSono) {
    }

    public record ZaritCriada(long id, int pontuacao, FaixaZarit faixa, LocalDateTime respondidaEm) {
    }

    public record AvaliacaoDto(long id, int pontuacao, FaixaZarit faixa, LocalDateTime respondidaEm, Double horasSono,
                               Integer qualidadeSono) {
    }

    public record MinhasZarit(List<AvaliacaoDto> avaliacoes, LocalDate proximaSugerida) {
    }

    public record PedirAjudaEntrada(List<Long> pacienteIds) {
    }

    public record PedirAjudaSaida(int alertasCriados) {
    }

    // ---------------------------------------------------------------- hoje e alertas
    public record AlertaDto(long id, TipoAlerta tipo, String mensagem, int prioridade, LocalDateTime criadoEm, boolean lido) {
    }

    public record ItemHoje(String tipo, long id, LocalDateTime horario, String titulo, String detalhe, String status,
                           TipoSinal tipoSinal) {
    }

    public record PacienteNome(long id, String nome) {
    }

    public record HojeDto(PacienteNome paciente, TurnoCurto turnoAtual, TurnoCurto proximoTurno, List<ItemHoje> itens,
                          List<AlertaDto> alertas) {
    }

    // ---------------------------------------------------------------- estatísticas
    public record TaxaNome(String nome, Double taxa) {
    }

    public record TaxaPeriodo(Periodo periodo, Double taxa) {
    }

    public record Adesao(Double geral, List<TaxaNome> porMedicamento, List<TaxaPeriodo> porPeriodo) {
    }

    public record Carga(String nome, Double horas, Double percentual) {
    }

    public record Equilibrio(Double desvioPadrao, Double coeficienteVariacao) {
    }

    public record PontoSerie(LocalDate data, Double valor) {
    }

    public record SerieDto(String nome, List<PontoSerie> serie) {
    }

    public record Medidas(Double media, Double mediana, Double moda) {
    }

    public record Chance(Double noturno, Double diurno) {
    }

    public record ZaritEstatistica(int compartilharam, int total, Double media, Double mediana, Double moda,
                                   Double pearsonNoturnosZarit, Double pearsonNoturnosSono) {
    }

    public record EstatisticasDto(int periodoDias, Adesao adesao, List<Carga> cargaPorPessoa, List<String> acimaDaMedia,
                                  Equilibrio equilibrio, List<SerieDto> mediaMovelHoras, Medidas horasPorTurno,
                                  Integer horaComMaisAtrasos, Chance chanceAtraso, ZaritEstatistica zarit) {
    }
}
