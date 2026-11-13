package br.com.cuidaquemcuida.infra;

import java.time.LocalDateTime;
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Deque;
import java.util.List;
import java.util.Locale;

/**
 * Guarda na memória os últimos 50 comandos SQL executados, para a tela "Banco ao vivo".
 * Os valores não aparecem (ficam como "?"), porque vão separados do comando no PreparedStatement.
 */
public final class LogSql {

    private static final int MAXIMO = 50;
    private static final Deque<EntradaSql> ENTRADAS = new ArrayDeque<>();

    public record EntradaSql(LocalDateTime quando, String tipo, String sql, long ms) {
    }

    private LogSql() {
    }

    public static void registrar(String sql, long ms) {
        String compacto = sql.replaceAll("\\s+", " ").trim();
        int espaco = compacto.indexOf(' ');
        String tipo = (espaco < 0 ? compacto : compacto.substring(0, espaco)).toUpperCase(Locale.ROOT);
        synchronized (ENTRADAS) {
            ENTRADAS.addFirst(new EntradaSql(LocalDateTime.now().withNano(0), tipo, compacto, ms));
            while (ENTRADAS.size() > MAXIMO) {
                ENTRADAS.removeLast();
            }
        }
    }

    /** Do mais novo para o mais antigo. */
    public static List<EntradaSql> ultimos() {
        synchronized (ENTRADAS) {
            return new ArrayList<>(ENTRADAS);
        }
    }
}
