package br.com.cuidaquemcuida.dao;

import br.com.cuidaquemcuida.infra.Sql;
import br.com.cuidaquemcuida.model.StatusDose;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Consultas do painel estatístico feitas no próprio banco (Fase 5 e 6: junções, agrupamentos,
 * totais, subconsultas). As medidas que precisam de lógica (média móvel, Pearson, z-score) ficam no Java.
 */
public final class EstatisticaDao {

    /** Quantas doses foram dadas no horário ({@code acertos}) de um total, agrupadas por uma chave. */
    public record Contagem(String chave, long acertos, long total) {
        public double taxa() {
            return total == 0 ? Double.NaN : (double) acertos / total;
        }
    }

    public record HorasPorPessoa(long pessoaId, String nome, double horas) {
    }

    public record DoseResolvida(LocalDateTime previstoPara, StatusDose status) {
    }

    private EstatisticaDao() {
    }

    /** Adesão por remédio: GROUP BY com contagem condicional (Fase 6). */
    public static List<Contagem> adesaoPorMedicamento(long pacienteId, LocalDateTime de, LocalDateTime ate) {
        return Sql.listar("""
                SELECT m.nome,
                       COUNT(*) FILTER (WHERE d.status = 'DADA') AS no_horario,
                       COUNT(*) AS total
                  FROM dose d
                  JOIN medicamento m ON m.id = d.medicamento_id
                 WHERE m.paciente_id = ? AND d.previsto_para >= ? AND d.previsto_para < ?
                 GROUP BY m.nome
                 ORDER BY m.nome
                """, rs -> new Contagem(rs.getString(1), rs.getLong(2), rs.getLong(3)), pacienteId, de, ate);
    }

    /** Adesão por período do dia: agrupa por uma expressão CASE. */
    public static List<Contagem> adesaoPorPeriodo(long pacienteId, LocalDateTime de, LocalDateTime ate) {
        return Sql.listar("""
                SELECT CASE WHEN EXTRACT(HOUR FROM d.previsto_para) < 6  THEN 'MADRUGADA'
                            WHEN EXTRACT(HOUR FROM d.previsto_para) < 12 THEN 'MANHA'
                            WHEN EXTRACT(HOUR FROM d.previsto_para) < 18 THEN 'TARDE'
                            ELSE 'NOITE' END AS periodo,
                       COUNT(*) FILTER (WHERE d.status = 'DADA') AS no_horario,
                       COUNT(*) AS total
                  FROM dose d
                  JOIN medicamento m ON m.id = d.medicamento_id
                 WHERE m.paciente_id = ? AND d.previsto_para >= ? AND d.previsto_para < ?
                 GROUP BY 1
                """, rs -> new Contagem(rs.getString(1), rs.getLong(2), rs.getLong(3)), pacienteId, de, ate);
    }

    /** Horas de cuidado de cada pessoa no período: JOIN turno × pessoa e soma recortada nas bordas. */
    public static List<HorasPorPessoa> cargaPorPessoa(long pacienteId, LocalDateTime de, LocalDateTime ate) {
        return Sql.listar("""
                SELECT p.id, p.nome,
                       SUM(EXTRACT(EPOCH FROM (LEAST(t.fim, ?) - GREATEST(t.inicio, ?))) / 3600.0) AS horas
                  FROM turno t
                  JOIN pessoa p ON p.id = t.pessoa_id
                 WHERE t.paciente_id = ? AND t.status <> 'CANCELADO' AND t.inicio < ? AND t.fim > ?
                 GROUP BY p.id, p.nome
                 ORDER BY horas DESC
                """, rs -> new HorasPorPessoa(rs.getLong(1), rs.getString(2), rs.getDouble(3)), ate, de, pacienteId, ate, de);
    }

    /** Quem fez mais horas que a média da rede: HAVING com subconsulta (Fase 6). */
    public static List<String> acimaDaMedia(long pacienteId, LocalDateTime de, LocalDateTime ate) {
        return Sql.listar("""
                SELECT p.nome
                  FROM turno t
                  JOIN pessoa p ON p.id = t.pessoa_id
                 WHERE t.paciente_id = ? AND t.status <> 'CANCELADO' AND t.inicio >= ? AND t.inicio < ?
                 GROUP BY p.id, p.nome
                HAVING SUM(EXTRACT(EPOCH FROM (t.fim - t.inicio))) >
                       (SELECT AVG(soma)
                          FROM (SELECT SUM(EXTRACT(EPOCH FROM (t2.fim - t2.inicio))) AS soma
                                  FROM turno t2
                                 WHERE t2.paciente_id = ? AND t2.status <> 'CANCELADO' AND t2.pessoa_id IS NOT NULL
                                   AND t2.inicio >= ? AND t2.inicio < ?
                                 GROUP BY t2.pessoa_id) AS por_pessoa)
                 ORDER BY p.nome
                """, rs -> rs.getString(1), pacienteId, de, ate, pacienteId, de, ate);
    }

    /** Hora do dia com mais doses atrasadas (a moda, calculada no SQL). */
    public static Optional<Integer> horaComMaisAtrasos(long pacienteId, LocalDateTime de, LocalDateTime ate) {
        return Sql.um("""
                SELECT EXTRACT(HOUR FROM d.previsto_para)::int AS hora
                  FROM dose d
                  JOIN medicamento m ON m.id = d.medicamento_id
                 WHERE m.paciente_id = ? AND d.status = 'ATRASADA' AND d.previsto_para >= ? AND d.previsto_para < ?
                 GROUP BY 1
                 ORDER BY COUNT(*) DESC, 1
                 LIMIT 1
                """, rs -> rs.getInt(1), pacienteId, de, ate);
    }

    /** Doses já resolvidas (dadas, atrasadas ou não dadas), para calcular a chance de atraso no Java. */
    public static List<DoseResolvida> dosesResolvidas(long pacienteId, LocalDateTime de, LocalDateTime ate) {
        return Sql.listar("""
                SELECT d.previsto_para, d.status
                  FROM dose d
                  JOIN medicamento m ON m.id = d.medicamento_id
                 WHERE m.paciente_id = ? AND d.status <> 'PENDENTE' AND d.previsto_para >= ? AND d.previsto_para < ?
                """, rs -> new DoseResolvida(rs.getObject(1, LocalDateTime.class), StatusDose.valueOf(rs.getString(2))), pacienteId, de, ate);
    }
}
