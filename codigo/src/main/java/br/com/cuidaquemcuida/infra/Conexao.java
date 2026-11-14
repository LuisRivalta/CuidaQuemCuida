package br.com.cuidaquemcuida.infra;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingQueue;

/**
 * Conexões JDBC com o PostgreSQL (Supabase). Abrir uma conexão nova a cada comando custaria centenas de
 * milissegundos (TLS até o servidor), então as conexões livres são reaproveitadas. Só se confere se a conexão
 * ainda está viva quando ela ficou parada por mais de 30 s (conferir sempre seria uma ida extra ao banco por comando).
 * ponytail: pool mínimo sem limite de espera; trocar por HikariCP se houver muitos acessos simultâneos.
 */
public final class Conexao {

    private static final int MAX_LIVRES = 8;
    private static final long CONFERIR_SE_PARADA_MS = 30_000;

    private record Livre(Connection conexao, long devolvidaEm) {
    }

    private static final BlockingQueue<Livre> LIVRES = new LinkedBlockingQueue<>();

    private Conexao() {
    }

    /** Pega uma conexão (reaproveitada se ainda estiver boa). Devolva com {@link #devolver}. */
    public static Connection pegar() throws SQLException {
        Livre livre;
        while ((livre = LIVRES.poll()) != null) {
            boolean recente = System.currentTimeMillis() - livre.devolvidaEm() < CONFERIR_SE_PARADA_MS;
            if (!livre.conexao().isClosed() && (recente || livre.conexao().isValid(2))) {
                return livre.conexao();
            }
            fecharSemErro(livre.conexao());
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
            if (LIVRES.size() >= MAX_LIVRES) {
                fecharSemErro(conexao);
            } else {
                LIVRES.offer(new Livre(conexao, System.currentTimeMillis()));
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
