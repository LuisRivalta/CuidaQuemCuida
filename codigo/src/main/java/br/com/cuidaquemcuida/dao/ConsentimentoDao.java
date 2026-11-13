package br.com.cuidaquemcuida.dao;

import br.com.cuidaquemcuida.infra.Sql;

/** Registro dos consentimentos da LGPD (tabela {@code consentimento}). */
public final class ConsentimentoDao {

    private ConsentimentoDao() {
    }

    /** Aceite do termo de uso pela própria pessoa, no cadastro. */
    public static void termoUsuario(long pessoaId, String versao) {
        Sql.executar("INSERT INTO consentimento (pessoa_id, tipo, versao_termo) VALUES (?, 'TERMO_USUARIO', ?)", pessoaId, versao);
    }

    /** Declaração de quem cadastrou o paciente: é o responsável legal ou tem a autorização dele (LGPD art. 11). */
    public static void dadosPaciente(long pessoaId, long pacienteId, String versao, String responsavelNome) {
        Sql.executar("""
                INSERT INTO consentimento (pessoa_id, paciente_id, tipo, versao_termo, responsavel_nome)
                VALUES (?, ?, 'DADOS_PACIENTE', ?, ?)
                """, pessoaId, pacienteId, versao, responsavelNome);
    }
}
