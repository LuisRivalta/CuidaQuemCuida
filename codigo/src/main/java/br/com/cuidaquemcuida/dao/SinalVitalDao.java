package br.com.cuidaquemcuida.dao;

import br.com.cuidaquemcuida.infra.Sql;
import br.com.cuidaquemcuida.model.FaixaSinal;
import br.com.cuidaquemcuida.model.SinalVital;
import br.com.cuidaquemcuida.model.TipoSinal;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDateTime;
import java.util.List;

/** Sinais vitais e faixas de alerta (tabelas {@code sinal_vital} e {@code faixa_sinal}). */
public final class SinalVitalDao {

    private static final String COLUNAS = "id, paciente_id, tipo, valor, valor2, medido_em, medido_por";

    private SinalVitalDao() {
    }

    private static SinalVital mapear(ResultSet rs) throws SQLException {
        double valor2 = rs.getDouble("valor2");
        Double segundo = rs.wasNull() ? null : valor2;
        long por = rs.getLong("medido_por");
        Long medidoPor = rs.wasNull() ? null : por;
        return new SinalVital(rs.getLong("id"), rs.getLong("paciente_id"), TipoSinal.valueOf(rs.getString("tipo")),
                rs.getDouble("valor"), segundo, rs.getObject("medido_em", LocalDateTime.class), medidoPor);
    }

    /** Medições do período, de um tipo ou de todos (tipo nulo). */
    public static List<SinalVital> doPaciente(long pacienteId, TipoSinal tipo, LocalDateTime de, LocalDateTime ate) {
        if (tipo == null) {
            return Sql.listar("SELECT " + COLUNAS + " FROM sinal_vital WHERE paciente_id = ? AND medido_em >= ? AND medido_em < ? ORDER BY medido_em",
                    SinalVitalDao::mapear, pacienteId, de, ate);
        }
        return Sql.listar("SELECT " + COLUNAS + " FROM sinal_vital WHERE paciente_id = ? AND tipo = ? AND medido_em >= ? AND medido_em < ? ORDER BY medido_em",
                SinalVitalDao::mapear, pacienteId, tipo, de, ate);
    }

    /** Valores anteriores do mesmo tipo (para saber se o novo está "fora da curva"). */
    public static List<Double> valoresAnteriores(long pacienteId, TipoSinal tipo) {
        return Sql.listar("SELECT valor FROM sinal_vital WHERE paciente_id = ? AND tipo = ?", rs -> rs.getDouble(1), pacienteId, tipo);
    }

    public static long inserir(SinalVital s) {
        return Sql.inserir("INSERT INTO sinal_vital (paciente_id, tipo, valor, valor2, medido_em, medido_por) VALUES (?, ?, ?, ?, ?, ?) RETURNING id",
                s.getPacienteId(), s.getTipo(), s.getValor(), s.getValor2(), s.getMedidoEm(), s.getMedidoPor());
    }

    public static List<FaixaSinal> faixas(long pacienteId) {
        return Sql.listar("SELECT paciente_id, tipo, minimo, maximo FROM faixa_sinal WHERE paciente_id = ? ORDER BY tipo", rs -> {
            double minimo = rs.getDouble("minimo");
            Double min = rs.wasNull() ? null : minimo;
            double maximo = rs.getDouble("maximo");
            Double max = rs.wasNull() ? null : maximo;
            return new FaixaSinal(rs.getLong("paciente_id"), TipoSinal.valueOf(rs.getString("tipo")), min, max);
        }, pacienteId);
    }

    /** Troca todas as faixas do paciente (chame dentro de Sql.transacao). */
    public static void substituirFaixas(long pacienteId, List<FaixaSinal> faixas) {
        Sql.executar("DELETE FROM faixa_sinal WHERE paciente_id = ?", pacienteId);
        for (FaixaSinal f : faixas) {
            Sql.executar("INSERT INTO faixa_sinal (paciente_id, tipo, minimo, maximo) VALUES (?, ?, ?, ?)",
                    pacienteId, f.tipo(), f.minimo(), f.maximo());
        }
    }
}
