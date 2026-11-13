package br.com.cuidaquemcuida.dao;

import br.com.cuidaquemcuida.infra.Sql;
import br.com.cuidaquemcuida.model.AvaliacaoZarit;
import br.com.cuidaquemcuida.model.FaixaZarit;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/** Avaliações da Escala Zarit (tabelas {@code avaliacao_zarit} e {@code resposta_zarit}). Dado de saúde privado. */
public final class ZaritDao {

    private static final String COLUNAS = "a.id, a.pessoa_id, a.respondida_em, a.pontuacao, a.faixa, a.horas_sono, a.qualidade_sono";

    private ZaritDao() {
    }

    private static AvaliacaoZarit mapear(ResultSet rs) throws SQLException {
        double horas = rs.getDouble("horas_sono");
        Double horasSono = rs.wasNull() ? null : horas;
        int qualidade = rs.getInt("qualidade_sono");
        Integer qualidadeSono = rs.wasNull() ? null : qualidade;
        return new AvaliacaoZarit(rs.getLong("id"), rs.getLong("pessoa_id"), rs.getObject("respondida_em", LocalDateTime.class),
                null, rs.getInt("pontuacao"), FaixaZarit.valueOf(rs.getString("faixa")), horasSono, qualidadeSono);
    }

    /** Grava a avaliação e as 12 respostas (chame dentro de Sql.transacao). */
    public static long inserir(AvaliacaoZarit a) {
        long id = Sql.inserir("""
                INSERT INTO avaliacao_zarit (pessoa_id, respondida_em, pontuacao, faixa, horas_sono, qualidade_sono)
                VALUES (?, ?, ?, ?, ?, ?) RETURNING id
                """, a.getPessoaId(), a.getRespondidaEm(), a.getPontuacao(), a.getFaixa(), a.getHorasSono(), a.getQualidadeSono());
        int[] respostas = a.getRespostas();
        for (int item = 1; item <= respostas.length; item++) {
            Sql.executar("INSERT INTO resposta_zarit (avaliacao_id, item, valor) VALUES (?, ?, ?)", id, item, respostas[item - 1]);
        }
        return id;
    }

    /** Avaliações da pessoa, da mais recente para a mais antiga. */
    public static List<AvaliacaoZarit> daPessoa(long pessoaId) {
        return Sql.listar("SELECT " + COLUNAS + " FROM avaliacao_zarit a WHERE a.pessoa_id = ? ORDER BY a.respondida_em DESC",
                ZaritDao::mapear, pessoaId);
    }

    public static Optional<AvaliacaoZarit> porId(long id) {
        return Sql.um("SELECT " + COLUNAS + " FROM avaliacao_zarit a WHERE a.id = ?", ZaritDao::mapear, id);
    }

    /** Só a própria pessoa apaga. Devolve 0 se a avaliação não é dela. */
    public static int apagar(long id, long pessoaId) {
        return Sql.executar("DELETE FROM avaliacao_zarit WHERE id = ? AND pessoa_id = ?", id, pessoaId);
    }

    public static void apagarDaPessoa(long pessoaId) {
        Sql.executar("DELETE FROM avaliacao_zarit WHERE pessoa_id = ?", pessoaId);
    }

    /** Avaliações de quem escolheu compartilhar a pontuação com o coordenador desta rede (consentimento). */
    public static List<AvaliacaoZarit> compartilhadasDaRede(long pacienteId) {
        return Sql.listar("SELECT " + COLUNAS + """
                 FROM avaliacao_zarit a
                 JOIN membro_rede m ON m.pessoa_id = a.pessoa_id
                WHERE m.paciente_id = ? AND m.ativo AND m.compartilha_zarit
                ORDER BY a.respondida_em
                """, ZaritDao::mapear, pacienteId);
    }
}
