package br.com.cuidaquemcuida.infra;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.function.Supplier;

/**
 * Acesso ao banco por JDBC (Fase 4). Todo comando usa PreparedStatement com "?", o que impede
 * injeção de SQL (Fase 3, cybersecurity). Cada comando é medido e registrado no {@link LogSql}.
 * Comandos dentro de {@link #transacao} usam a mesma conexão e são confirmados juntos (ou desfeitos juntos).
 */
public final class Sql {

    /** Transforma a linha atual do ResultSet num objeto. */
    @FunctionalInterface
    public interface Mapeador<T> {
        T mapear(ResultSet rs) throws SQLException;
    }

    @FunctionalInterface
    private interface ComConexao<T> {
        T executar(Connection conexao) throws SQLException;
    }

    private static final ThreadLocal<Connection> TRANSACAO = new ThreadLocal<>();

    private Sql() {
    }

    public static <T> List<T> listar(String sql, Mapeador<T> mapeador, Object... parametros) {
        return usar(conexao -> {
            try (PreparedStatement ps = preparar(conexao, sql, parametros)) {
                long inicio = System.nanoTime();
                try (ResultSet rs = ps.executeQuery()) {
                    List<T> lista = new ArrayList<>();
                    while (rs.next()) {
                        lista.add(mapeador.mapear(rs));
                    }
                    registrar(sql, inicio);
                    return lista;
                }
            }
        });
    }

    public static <T> Optional<T> um(String sql, Mapeador<T> mapeador, Object... parametros) {
        List<T> lista = listar(sql, mapeador, parametros);
        return lista.isEmpty() ? Optional.empty() : Optional.of(lista.get(0));
    }

    /** INSERT, UPDATE ou DELETE. Devolve quantas linhas foram afetadas. */
    public static int executar(String sql, Object... parametros) {
        return usar(conexao -> {
            try (PreparedStatement ps = preparar(conexao, sql, parametros)) {
                long inicio = System.nanoTime();
                int linhas = ps.executeUpdate();
                registrar(sql, inicio);
                return linhas;
            }
        });
    }

    /** INSERT terminado em "RETURNING id". Devolve o id gerado. */
    public static long inserir(String sql, Object... parametros) {
        return usar(conexao -> {
            try (PreparedStatement ps = preparar(conexao, sql, parametros)) {
                long inicio = System.nanoTime();
                try (ResultSet rs = ps.executeQuery()) {
                    registrar(sql, inicio);
                    if (!rs.next()) {
                        throw new SQLException("O INSERT não devolveu o id (falta RETURNING id?)");
                    }
                    return rs.getLong(1);
                }
            }
        });
    }

    /** Executa vários comandos como uma unidade: ou todos são gravados, ou nenhum. */
    public static <T> T transacao(Supplier<T> trabalho) {
        if (TRANSACAO.get() != null) {
            return trabalho.get();   // já está dentro de uma transação
        }
        Connection conexao = null;
        try {
            conexao = Conexao.pegar();
            conexao.setAutoCommit(false);
            TRANSACAO.set(conexao);
            T resultado = trabalho.get();
            conexao.commit();
            return resultado;
        } catch (SQLException e) {
            throw traduzir(e);
        } finally {
            TRANSACAO.remove();
            if (conexao != null) {
                Conexao.devolver(conexao);   // desfaz o que não foi confirmado
            }
        }
    }

    private static <T> T usar(ComConexao<T> trabalho) {
        Connection daTransacao = TRANSACAO.get();
        try {
            if (daTransacao != null) {
                return trabalho.executar(daTransacao);
            }
            Connection conexao = Conexao.pegar();
            try {
                return trabalho.executar(conexao);
            } finally {
                Conexao.devolver(conexao);
            }
        } catch (SQLException e) {
            throw traduzir(e);
        }
    }

    private static PreparedStatement preparar(Connection conexao, String sql, Object... parametros) throws SQLException {
        PreparedStatement ps = conexao.prepareStatement(sql);
        for (int i = 0; i < parametros.length; i++) {
            Object valor = parametros[i];
            if (valor == null) {
                ps.setNull(i + 1, Types.NULL);
            } else if (valor instanceof Enum<?> e) {
                ps.setString(i + 1, e.name());
            } else {
                ps.setObject(i + 1, valor);   // LocalDate, LocalDateTime e LocalTime vão direto (JDBC 4.2)
            }
        }
        return ps;
    }

    private static void registrar(String sql, long inicioNanos) {
        LogSql.registrar(sql, (System.nanoTime() - inicioNanos) / 1_000_000);
    }

    /** Erros do banco viram mensagens que a pessoa entende. */
    private static RuntimeException traduzir(SQLException e) {
        String estado = e.getSQLState() == null ? "" : e.getSQLState();
        return switch (estado) {
            case "23505" -> new ApiException(409, "Esse registro já existe");
            case "23503" -> new ApiException(400, "Registro relacionado não encontrado");
            case "23514", "22P02", "22007", "22008" -> new ApiException(400, "Algum dado está fora do permitido");
            default -> new IllegalStateException("Erro ao acessar o banco de dados: " + e.getMessage(), e);
        };
    }
}
