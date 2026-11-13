package br.com.cuidaquemcuida.infra;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingQueue;

/**
 * Conexões JDBC com o PostgreSQL (Supabase). Abrir uma conexão nova a cada comando custaria centenas de
 * milissegundos (TLS até o servidor), então as conexões livres são reaproveitadas.
 * ponytail: pool mínimo sem limite de espera; trocar por HikariCP se houver muitos acessos simultâneos.
 */
public final class Conexao {

    private static final int MAX_LIVRES = 8;
    private static final BlockingQueue<Connection> LIVRES = new LinkedBlockingQueue<>();

    private Conexao() {
    }

    /** Pega uma conexão (reaproveitada se ainda estiver válida). Devolva com {@link #devolver}. */
    public static Connection pegar() throws SQLException {
        Connection conexao;
        while ((conexao = LIVRES.poll()) != null) {
            if (conexao.isValid(2)) {
                return conexao;
            }
            fecharSemErro(conexao);
        }
        return DriverManager.getConnection(
                Config.obrigatorio("db.url"), Config.obrigatorio("db.usuario"), Config.obrigatorio("db.senha"));
    }

    public static void devolver(Connection conexao) {
        try {
            if (conexao.isClosed()) {
                return;
            }
            if (!conexao.getAutoCommit()) {
                conexao.rollback();
                conexao.setAutoCommit(true);
            }
            if (!LIVRES.offer(conexao) || LIVRES.size() > MAX_LIVRES) {
                LIVRES.remove(conexao);
                fecharSemErro(conexao);
            }
        } catch (SQLException e) {
            fecharSemErro(conexao);
        }
    }

    /** Testa a conexão ao iniciar o sistema e explica o problema em português, se houver. */
    public static void testar() {
        try {
            Connection conexao = pegar();
            devolver(conexao);
            System.out.println("Banco de dados conectado.");
        } catch (SQLException | IllegalStateException e) {
            System.out.println("ATENÇÃO: não foi possível conectar ao banco: " + e.getMessage());
            System.out.println("Confira o config.properties. No Supabase, use a conexão \"Session pooler\" (a direta só funciona em IPv6).");
        }
    }

    private static void fecharSemErro(Connection conexao) {
        try {
            conexao.close();
        } catch (SQLException ignorado) {
            // a conexão já estava quebrada
        }
    }
}
