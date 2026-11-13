package br.com.cuidaquemcuida.dao;

import br.com.cuidaquemcuida.infra.Sql;
import br.com.cuidaquemcuida.model.Dose;
import br.com.cuidaquemcuida.model.StatusDose;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/** Doses previstas e registradas (tabela {@code dose}). */
public final class DoseDao {

    private static final String COLUNAS = "d.id, d.medicamento_id, d.previsto_para, d.dada_em, d.dada_por, d.status, d.observacao";

    private DoseDao() {
    }

    private static Dose mapear(ResultSet rs) throws SQLException {
        Dose d = new Dose(rs.getLong("id"), rs.getLong("medicamento_id"), rs.getObject("previsto_para", LocalDateTime.class),
                StatusDose.valueOf(rs.getString("status")));
        d.setDadaEm(rs.getObject("dada_em", LocalDateTime.class));
        long por = rs.getLong("dada_por");
        d.setDadaPor(rs.wasNull() ? null : por);
        d.setObservacao(rs.getString("observacao"));
        return d;
    }

    /** Cria as doses previstas que ainda não existem. A UNIQUE (medicamento_id, previsto_para) impede duplicar. */
    public static void garantir(long medicamentoId, List<LocalDateTime> horarios) {
        for (LocalDateTime previsto : horarios) {
            Sql.executar("INSERT INTO dose (medicamento_id, previsto_para) VALUES (?, ?) ON CONFLICT (medicamento_id, previsto_para) DO NOTHING",
                    medicamentoId, previsto);
        }
    }

    public static List<Dose> doPacienteNoDia(long pacienteId, LocalDate dia) {
        return Sql.listar("SELECT " + COLUNAS + """
                 FROM dose d
                 JOIN medicamento m ON m.id = d.medicamento_id
                WHERE m.paciente_id = ? AND d.previsto_para >= ? AND d.previsto_para < ?
                ORDER BY d.previsto_para
                """, DoseDao::mapear, pacienteId, dia.atStartOfDay(), dia.plusDays(1).atStartOfDay());
    }

    public static Optional<Dose> porId(long id) {
        return Sql.um("SELECT " + COLUNAS + " FROM dose d WHERE d.id = ?", DoseDao::mapear, id);
    }

    /**
     * Registra a dose só se ainda estiver pendente. Devolve 0 se outra pessoa registrou antes:
     * assim duas pessoas tocando "Dei o remédio" ao mesmo tempo não sobrescrevem uma à outra.
     */
    public static int registrar(long id, StatusDose status, LocalDateTime dadaEm, long pessoaId, String observacao) {
        return Sql.executar("UPDATE dose SET status = ?, dada_em = ?, dada_por = ?, observacao = ? WHERE id = ? AND status = 'PENDENTE'",
                status, dadaEm, pessoaId, observacao, id);
    }

    /** Passaram 2 h sem registro: a dose vira não dada. */
    public static void marcarNaoDadaPorTempo(long id) {
        Sql.executar("UPDATE dose SET status = 'NAO_DADA' WHERE id = ? AND status = 'PENDENTE'", id);
    }

    /** Ao mudar a regra do remédio, as doses futuras ainda pendentes são refeitas pela regra nova. */
    public static void apagarPendentesFuturas(long medicamentoId, LocalDateTime aPartirDe) {
        Sql.executar("DELETE FROM dose WHERE medicamento_id = ? AND status = 'PENDENTE' AND previsto_para >= ?", medicamentoId, aPartirDe);
    }
}
