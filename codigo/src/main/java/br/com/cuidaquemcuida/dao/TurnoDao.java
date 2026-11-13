package br.com.cuidaquemcuida.dao;

import br.com.cuidaquemcuida.infra.Sql;
import br.com.cuidaquemcuida.model.StatusTurno;
import br.com.cuidaquemcuida.model.Turno;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/** Escala de revezamento (tabela {@code turno}). */
public final class TurnoDao {

    private static final String COLUNAS = "id, paciente_id, pessoa_id, inicio, fim, status";

    private TurnoDao() {
    }

    private static Turno mapear(ResultSet rs) throws SQLException {
        long pessoa = rs.getLong("pessoa_id");
        Long pessoaId = rs.wasNull() ? null : pessoa;   // wasNull vale para a última coluna lida: logo depois do getLong
        return new Turno(rs.getLong("id"), rs.getLong("paciente_id"), pessoaId,
                rs.getObject("inicio", LocalDateTime.class), rs.getObject("fim", LocalDateTime.class),
                StatusTurno.valueOf(rs.getString("status")));
    }

    /** Turnos do paciente que começam entre [de, ate). */
    public static List<Turno> queComecamEntre(long pacienteId, LocalDateTime de, LocalDateTime ate) {
        return Sql.listar("SELECT " + COLUNAS + " FROM turno WHERE paciente_id = ? AND status <> 'CANCELADO' AND inicio >= ? AND inicio < ? ORDER BY inicio",
                TurnoDao::mapear, pacienteId, de, ate);
    }

    /** Turnos do paciente que encostam em [de, ate) (inclusive os que começaram antes). */
    public static List<Turno> doPaciente(long pacienteId, LocalDateTime de, LocalDateTime ate) {
        return Sql.listar("SELECT " + COLUNAS + " FROM turno WHERE paciente_id = ? AND status <> 'CANCELADO' AND inicio < ? AND fim > ? ORDER BY inicio",
                TurnoDao::mapear, pacienteId, ate, de);
    }

    /** Turnos da pessoa em todas as redes que encostam em [de, ate). É a carga dela. */
    public static List<Turno> daPessoa(long pessoaId, LocalDateTime de, LocalDateTime ate) {
        return Sql.listar("SELECT " + COLUNAS + " FROM turno WHERE pessoa_id = ? AND status <> 'CANCELADO' AND inicio < ? AND fim > ? ORDER BY inicio",
                TurnoDao::mapear, pessoaId, ate, de);
    }

    public static Optional<Turno> porId(long id) {
        return Sql.um("SELECT " + COLUNAS + " FROM turno WHERE id = ?", TurnoDao::mapear, id);
    }

    public static long inserir(Turno t) {
        return Sql.inserir("INSERT INTO turno (paciente_id, pessoa_id, inicio, fim, status) VALUES (?, ?, ?, ?, ?) RETURNING id",
                t.getPacienteId(), t.getPessoaId(), t.getInicio(), t.getFim(), t.getStatus());
    }

    public static void atualizar(Turno t) {
        Sql.executar("UPDATE turno SET pessoa_id = ?, inicio = ?, fim = ?, status = ? WHERE id = ?",
                t.getPessoaId(), t.getInicio(), t.getFim(), t.getStatus(), t.getId());
    }

    /** Assume um turno vago. Devolve 0 se alguém assumiu antes (a condição "pessoa_id IS NULL" evita os dois ao mesmo tempo). */
    public static int assumir(long id, long pessoaId) {
        return Sql.executar("UPDATE turno SET pessoa_id = ? WHERE id = ? AND pessoa_id IS NULL", pessoaId, id);
    }

    public static void apagar(long id) {
        Sql.executar("DELETE FROM turno WHERE id = ?", id);
    }
}
