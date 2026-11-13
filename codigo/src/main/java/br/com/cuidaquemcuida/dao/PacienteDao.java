package br.com.cuidaquemcuida.dao;

import br.com.cuidaquemcuida.infra.Sql;
import br.com.cuidaquemcuida.model.Paciente;
import br.com.cuidaquemcuida.model.Papel;
import br.com.cuidaquemcuida.resource.Dtos.PacienteResumo;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/** Pessoas cuidadas (tabela {@code paciente}). */
public final class PacienteDao {

    private static final String COLUNAS = """
            id, nome, data_nascimento, condicao, precisa_24h, observacoes, responsavel_nome, responsavel_parentesco, codigo_convite
            """;

    private PacienteDao() {
    }

    private static Paciente mapear(ResultSet rs) throws SQLException {
        Paciente p = new Paciente(rs.getLong("id"), rs.getString("nome"), rs.getObject("data_nascimento", LocalDate.class),
                rs.getString("responsavel_nome"), rs.getString("responsavel_parentesco"));
        p.setCondicao(rs.getString("condicao"));
        p.setPrecisa24h(rs.getBoolean("precisa_24h"));
        p.setObservacoes(rs.getString("observacoes"));
        p.setCodigoConvite(rs.getString("codigo_convite"));
        return p;
    }

    public static Optional<Paciente> porId(long id) {
        return Sql.um("SELECT " + COLUNAS + " FROM paciente WHERE id = ?", PacienteDao::mapear, id);
    }

    public static Optional<Paciente> porCodigo(String codigo) {
        return Sql.um("SELECT " + COLUNAS + " FROM paciente WHERE codigo_convite = ?", PacienteDao::mapear, codigo);
    }

    public static boolean codigoExiste(String codigo) {
        return Sql.um("SELECT 1 FROM paciente WHERE codigo_convite = ?", rs -> true, codigo).isPresent();
    }

    public static long inserir(Paciente p) {
        return Sql.inserir("""
                INSERT INTO paciente (nome, data_nascimento, condicao, precisa_24h, observacoes,
                                      responsavel_nome, responsavel_parentesco, codigo_convite)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?) RETURNING id
                """, p.getNome(), p.getDataNascimento(), p.getCondicao(), p.isPrecisa24h(), p.getObservacoes(),
                p.getResponsavelNome(), p.getResponsavelParentesco(), p.getCodigoConvite());
    }

    public static void atualizar(Paciente p) {
        Sql.executar("""
                UPDATE paciente SET nome = ?, data_nascimento = ?, condicao = ?, precisa_24h = ?, observacoes = ?,
                                    responsavel_nome = ?, responsavel_parentesco = ?
                 WHERE id = ?
                """, p.getNome(), p.getDataNascimento(), p.getCondicao(), p.isPrecisa24h(), p.getObservacoes(),
                p.getResponsavelNome(), p.getResponsavelParentesco(), p.getId());
    }

    public static void mudarCodigo(long id, String codigo) {
        Sql.executar("UPDATE paciente SET codigo_convite = ? WHERE id = ?", codigo, id);
    }

    /** Apaga o paciente e, em cascata, todos os dados de cuidado dele. */
    public static void apagar(long id) {
        Sql.executar("DELETE FROM paciente WHERE id = ?", id);
    }

    /** Pacientes das redes de que a pessoa participa, com o papel dela em cada uma. */
    public static List<PacienteResumo> daPessoa(long pessoaId) {
        return Sql.listar("""
                SELECT p.id, p.nome, p.condicao, m.papel
                  FROM paciente p
                  JOIN membro_rede m ON m.paciente_id = p.id
                 WHERE m.pessoa_id = ? AND m.ativo
                 ORDER BY p.nome
                """, rs -> new PacienteResumo(rs.getLong(1), rs.getString(2), rs.getString(3), Papel.valueOf(rs.getString(4))), pessoaId);
    }
}
