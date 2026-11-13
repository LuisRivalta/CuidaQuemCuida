package br.com.cuidaquemcuida.dao;

import br.com.cuidaquemcuida.infra.Sql;
import br.com.cuidaquemcuida.model.ExecucaoTarefa;
import br.com.cuidaquemcuida.model.TarefaCuidado;
import br.com.cuidaquemcuida.model.TipoSinal;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

/** Protocolo de cuidado (tabelas {@code tarefa_cuidado} e {@code execucao_tarefa}). */
public final class TarefaDao {

    private static final String COLUNAS = "id, paciente_id, titulo, orientacao, recorrencia_horas, primeira_vez, tipo_sinal, ativa";

    private TarefaDao() {
    }

    private static TarefaCuidado mapear(ResultSet rs) throws SQLException {
        String tipo = rs.getString("tipo_sinal");
        return new TarefaCuidado(rs.getLong("id"), rs.getLong("paciente_id"), rs.getString("titulo"), rs.getString("orientacao"),
                rs.getInt("recorrencia_horas"), rs.getObject("primeira_vez", LocalTime.class),
                tipo == null ? null : TipoSinal.valueOf(tipo), rs.getBoolean("ativa"));
    }

    private static ExecucaoTarefa mapearExecucao(ResultSet rs) throws SQLException {
        long por = rs.getLong("feita_por");
        Long feitaPor = rs.wasNull() ? null : por;
        return new ExecucaoTarefa(rs.getLong("id"), rs.getLong("tarefa_id"), rs.getObject("prevista_para", LocalDateTime.class),
                rs.getObject("feita_em", LocalDateTime.class), feitaPor);
    }

    public static List<TarefaCuidado> doPaciente(long pacienteId) {
        return Sql.listar("SELECT " + COLUNAS + " FROM tarefa_cuidado WHERE paciente_id = ? ORDER BY primeira_vez, titulo",
                TarefaDao::mapear, pacienteId);
    }

    public static Optional<TarefaCuidado> porId(long id) {
        return Sql.um("SELECT " + COLUNAS + " FROM tarefa_cuidado WHERE id = ?", TarefaDao::mapear, id);
    }

    public static long inserir(TarefaCuidado t) {
        return Sql.inserir("""
                INSERT INTO tarefa_cuidado (paciente_id, titulo, orientacao, recorrencia_horas, primeira_vez, tipo_sinal, ativa)
                VALUES (?, ?, ?, ?, ?, ?, ?) RETURNING id
                """, t.getPacienteId(), t.getTitulo(), t.getOrientacao(), t.getRecorrenciaHoras(), t.getPrimeiraVez(), t.getTipoSinal(), t.isAtiva());
    }

    public static void atualizar(TarefaCuidado t) {
        Sql.executar("""
                UPDATE tarefa_cuidado SET titulo = ?, orientacao = ?, recorrencia_horas = ?, primeira_vez = ?, tipo_sinal = ?, ativa = ?
                 WHERE id = ?
                """, t.getTitulo(), t.getOrientacao(), t.getRecorrenciaHoras(), t.getPrimeiraVez(), t.getTipoSinal(), t.isAtiva(), t.getId());
    }

    public static void apagar(long id) {
        Sql.executar("DELETE FROM tarefa_cuidado WHERE id = ?", id);
    }

    /** Cria as execuções previstas que ainda não existem (UNIQUE impede duplicar). */
    public static void garantirExecucoes(long tarefaId, List<LocalDateTime> horarios) {
        for (LocalDateTime prevista : horarios) {
            Sql.executar("INSERT INTO execucao_tarefa (tarefa_id, prevista_para) VALUES (?, ?) ON CONFLICT (tarefa_id, prevista_para) DO NOTHING",
                    tarefaId, prevista);
        }
    }

    public static List<ExecucaoTarefa> execucoesNoDia(long pacienteId, LocalDate dia) {
        return Sql.listar("""
                SELECT e.id, e.tarefa_id, e.prevista_para, e.feita_em, e.feita_por
                  FROM execucao_tarefa e
                  JOIN tarefa_cuidado t ON t.id = e.tarefa_id
                 WHERE t.paciente_id = ? AND e.prevista_para >= ? AND e.prevista_para < ?
                 ORDER BY e.prevista_para
                """, TarefaDao::mapearExecucao, pacienteId, dia.atStartOfDay(), dia.plusDays(1).atStartOfDay());
    }

    public static Optional<ExecucaoTarefa> execucaoPorId(long id) {
        return Sql.um("SELECT id, tarefa_id, prevista_para, feita_em, feita_por FROM execucao_tarefa WHERE id = ?",
                TarefaDao::mapearExecucao, id);
    }

    /** Marca como feita só se ainda não foi. Devolve 0 se outra pessoa marcou antes. */
    public static int marcarFeita(long id, long pessoaId, LocalDateTime quando) {
        return Sql.executar("UPDATE execucao_tarefa SET feita_em = ?, feita_por = ? WHERE id = ? AND feita_em IS NULL", quando, pessoaId, id);
    }

    /** Ao mudar a tarefa, as execuções futuras ainda não feitas são refeitas pela regra nova. */
    public static void apagarFuturasNaoFeitas(long tarefaId, LocalDateTime aPartirDe) {
        Sql.executar("DELETE FROM execucao_tarefa WHERE tarefa_id = ? AND feita_em IS NULL AND prevista_para >= ?", tarefaId, aPartirDe);
    }
}
