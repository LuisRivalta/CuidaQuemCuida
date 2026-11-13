package br.com.cuidaquemcuida.dao;

import br.com.cuidaquemcuida.infra.Sql;
import br.com.cuidaquemcuida.model.MembroRede;
import br.com.cuidaquemcuida.model.Papel;
import br.com.cuidaquemcuida.model.Vinculo;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.Optional;

/** Quem participa de cada rede de cuidado (tabela associativa {@code membro_rede}). */
public final class MembroRedeDao {

    private static final String COLUNAS = "pessoa_id, paciente_id, papel, vinculo, ativo, compartilha_zarit";

    private MembroRedeDao() {
    }

    private static MembroRede mapear(ResultSet rs) throws SQLException {
        return new MembroRede(rs.getLong("pessoa_id"), rs.getLong("paciente_id"),
                Papel.valueOf(rs.getString("papel")), Vinculo.valueOf(rs.getString("vinculo")),
                rs.getBoolean("ativo"), rs.getBoolean("compartilha_zarit"));
    }

    /** Todas as redes de que a pessoa participa (ativas ou não). */
    public static List<MembroRede> daPessoa(long pessoaId) {
        return Sql.listar("SELECT " + COLUNAS + " FROM membro_rede WHERE pessoa_id = ?", MembroRedeDao::mapear, pessoaId);
    }

    /** Membros ativos da rede de um paciente. */
    public static List<MembroRede> doPaciente(long pacienteId) {
        return Sql.listar("SELECT " + COLUNAS + " FROM membro_rede WHERE paciente_id = ? AND ativo ORDER BY pessoa_id",
                MembroRedeDao::mapear, pacienteId);
    }

    public static Optional<MembroRede> buscar(long pessoaId, long pacienteId) {
        return Sql.um("SELECT " + COLUNAS + " FROM membro_rede WHERE pessoa_id = ? AND paciente_id = ?",
                MembroRedeDao::mapear, pessoaId, pacienteId);
    }

    public static void inserir(long pessoaId, long pacienteId, Papel papel, Vinculo vinculo) {
        Sql.executar("INSERT INTO membro_rede (pessoa_id, paciente_id, papel, vinculo) VALUES (?, ?, ?, ?)",
                pessoaId, pacienteId, papel, vinculo);
    }

    /** Reativa quem já tinha saído da rede e volta a entrar com o código. */
    public static void reativar(long pessoaId, long pacienteId, Vinculo vinculo) {
        Sql.executar("UPDATE membro_rede SET ativo = TRUE, papel = 'MEMBRO', vinculo = ?, desde = now() WHERE pessoa_id = ? AND paciente_id = ?",
                vinculo, pessoaId, pacienteId);
    }

    public static int mudarPapel(long pessoaId, long pacienteId, Papel papel) {
        return Sql.executar("UPDATE membro_rede SET papel = ? WHERE pessoa_id = ? AND paciente_id = ? AND ativo",
                papel, pessoaId, pacienteId);
    }

    public static int desativar(long pessoaId, long pacienteId) {
        return Sql.executar("UPDATE membro_rede SET ativo = FALSE WHERE pessoa_id = ? AND paciente_id = ?", pessoaId, pacienteId);
    }

    public static void compartilharZarit(long pessoaId, long pacienteId, boolean compartilha) {
        Sql.executar("UPDATE membro_rede SET compartilha_zarit = ? WHERE pessoa_id = ? AND paciente_id = ?",
                compartilha, pessoaId, pacienteId);
    }
}
