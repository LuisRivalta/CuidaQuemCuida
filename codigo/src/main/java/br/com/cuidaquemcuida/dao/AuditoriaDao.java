package br.com.cuidaquemcuida.dao;

import br.com.cuidaquemcuida.infra.Sql;

/** Trilha de auditoria: quem alterou o quê e quando (tabela {@code auditoria}, Fase 5). */
public final class AuditoriaDao {

    public static final String INSERIR = "INSERIR";
    public static final String ALTERAR = "ALTERAR";
    public static final String EXCLUIR = "EXCLUIR";
    public static final String LOGIN = "LOGIN";

    private AuditoriaDao() {
    }

    public static void registrar(Long pessoaId, String acao, String tabela, Long registroId, String detalhe) {
        String texto = detalhe == null || detalhe.length() <= 300 ? detalhe : detalhe.substring(0, 300);
        Sql.executar("INSERT INTO auditoria (pessoa_id, acao, tabela, registro_id, detalhe) VALUES (?, ?, ?, ?, ?)",
                pessoaId, acao, tabela, registroId, texto);
    }
}
