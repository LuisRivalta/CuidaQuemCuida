package br.com.cuidaquemcuida.dao;

import br.com.cuidaquemcuida.infra.Sql;
import br.com.cuidaquemcuida.service.Limites;
import java.time.LocalDateTime;
import java.util.Optional;

/** Sessões de login (tabela {@code sessao}). */
public final class SessaoDao {

    private SessaoDao() {
    }

    public static void criar(String token, long pessoaId) {
        Sql.executar("INSERT INTO sessao (token, pessoa_id, expira_em) VALUES (?, ?, ?)",
                token, pessoaId, LocalDateTime.now().plusDays(Limites.SESSAO_DIAS));
    }

    /** Dono do token, se a sessão existe, não expirou e a conta está ativa. */
    public static Optional<Long> pessoaDoToken(String token) {
        return Sql.um("""
                SELECT s.pessoa_id
                  FROM sessao s
                  JOIN pessoa p ON p.id = s.pessoa_id
                 WHERE s.token = ? AND s.expira_em > ? AND p.ativo
                """, rs -> rs.getLong(1), token, LocalDateTime.now());
    }

    public static void apagar(String token) {
        Sql.executar("DELETE FROM sessao WHERE token = ?", token);
    }

    public static void apagarDaPessoa(long pessoaId) {
        Sql.executar("DELETE FROM sessao WHERE pessoa_id = ?", pessoaId);
    }
}
