package br.com.cuidaquemcuida.dao;

import br.com.cuidaquemcuida.infra.Sql;
import br.com.cuidaquemcuida.model.Cuidador;
import br.com.cuidaquemcuida.model.Papel;
import br.com.cuidaquemcuida.model.Vinculo;
import br.com.cuidaquemcuida.resource.Dtos.RedeDto;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/** Pessoas com login (tabela {@code pessoa}). */
public final class PessoaDao {

    private static final String COLUNAS = "id, nome, email, senha_hash, senha_salt, telefone, data_nascimento, genero, ativo";

    private PessoaDao() {
    }

    private static Cuidador mapear(ResultSet rs) throws SQLException {
        Cuidador c = new Cuidador(rs.getLong("id"), rs.getString("nome"), rs.getString("email"), rs.getObject("data_nascimento", LocalDate.class));
        c.setSenhaHash(rs.getString("senha_hash"));
        c.setSenhaSalt(rs.getString("senha_salt"));
        c.setTelefone(rs.getString("telefone"));
        c.setGenero(rs.getString("genero"));
        c.setAtivo(rs.getBoolean("ativo"));
        return c;
    }

    public static Optional<Cuidador> porEmail(String email) {
        return Sql.um("SELECT " + COLUNAS + " FROM pessoa WHERE email = ?", PessoaDao::mapear, email.trim().toLowerCase());
    }

    public static Optional<Cuidador> porId(long id) {
        return Sql.um("SELECT " + COLUNAS + " FROM pessoa WHERE id = ?", PessoaDao::mapear, id);
    }

    public static boolean emailExiste(String email) {
        return Sql.um("SELECT 1 FROM pessoa WHERE email = ?", rs -> true, email.trim().toLowerCase()).isPresent();
    }

    public static long inserir(Cuidador c) {
        return Sql.inserir("""
                INSERT INTO pessoa (nome, email, senha_hash, senha_salt, telefone, data_nascimento, genero)
                VALUES (?, ?, ?, ?, ?, ?, ?) RETURNING id
                """, c.getNome(), c.getEmail(), c.getSenhaHash(), c.getSenhaSalt(), c.getTelefone(), c.getDataNascimento(), c.getGenero());
    }

    /** Grava a pessoa já anonimizada ({@link Cuidador#anonimizar()}). */
    public static void salvarAnonimizada(Cuidador c) {
        Sql.executar("""
                UPDATE pessoa SET nome = ?, email = ?, senha_hash = ?, senha_salt = ?, telefone = NULL,
                       data_nascimento = NULL, genero = NULL, ativo = FALSE
                 WHERE id = ?
                """, c.getNome(), c.getEmail(), c.getSenhaHash(), c.getSenhaSalt(), c.getId());
    }

    /** Redes de que a pessoa participa, com o nome do paciente (JOIN, Fase 5). */
    public static List<RedeDto> redes(long pessoaId) {
        return Sql.listar("""
                SELECT m.paciente_id, p.nome, m.papel, m.vinculo, m.compartilha_zarit
                  FROM membro_rede m
                  JOIN paciente p ON p.id = m.paciente_id
                 WHERE m.pessoa_id = ? AND m.ativo
                 ORDER BY p.nome
                """, rs -> new RedeDto(rs.getLong(1), rs.getString(2), Papel.valueOf(rs.getString(3)),
                Vinculo.valueOf(rs.getString(4)), rs.getBoolean(5)), pessoaId);
    }

    /** Nome de todas as pessoas que já passaram pela rede do paciente (para mostrar "quem fez" nos registros). */
    public static Map<Long, String> nomesDaRede(long pacienteId) {
        Map<Long, String> nomes = new HashMap<>();
        Sql.listar("""
                SELECT p.id, p.nome
                  FROM pessoa p
                  JOIN membro_rede m ON m.pessoa_id = p.id
                 WHERE m.paciente_id = ?
                """, rs -> nomes.put(rs.getLong(1), rs.getString(2)), pacienteId);
        return nomes;
    }
}
