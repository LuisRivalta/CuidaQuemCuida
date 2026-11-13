package br.com.cuidaquemcuida.dao;

import br.com.cuidaquemcuida.infra.Sql;
import br.com.cuidaquemcuida.model.alerta.Alerta;
import br.com.cuidaquemcuida.model.alerta.TipoAlerta;
import br.com.cuidaquemcuida.resource.Dtos.AlertaDto;
import java.time.LocalDateTime;
import java.util.List;

/** Alertas por destinatário (tabela {@code alerta}). */
public final class AlertaDao {

    private AlertaDao() {
    }

    /** Grava o alerta; se o mesmo (tipo, referência, destinatário) já existe, não faz nada. Devolve 1 se gravou. */
    public static int gravar(Alerta a) {
        return Sql.executar("""
                INSERT INTO alerta (paciente_id, destinatario_id, tipo, referencia, mensagem, prioridade)
                VALUES (?, ?, ?, ?, ?, ?)
                ON CONFLICT (tipo, referencia, destinatario_id) DO NOTHING
                """, a.getPacienteId(), a.getDestinatarioId(), a.getTipo(), a.getReferencia(), a.mensagem(), a.prioridade());
    }

    public static List<AlertaDto> naoLidos(long pessoaId, long pacienteId) {
        return Sql.listar("""
                SELECT id, tipo, mensagem, prioridade, criado_em
                  FROM alerta
                 WHERE destinatario_id = ? AND paciente_id = ? AND lido_em IS NULL
                 ORDER BY prioridade DESC, criado_em DESC
                 LIMIT 20
                """, rs -> new AlertaDto(rs.getLong("id"), TipoAlerta.valueOf(rs.getString("tipo")), rs.getString("mensagem"),
                rs.getInt("prioridade"), rs.getObject("criado_em", LocalDateTime.class), false), pessoaId, pacienteId);
    }

    public static int marcarLido(long id, long pessoaId) {
        return Sql.executar("UPDATE alerta SET lido_em = now() WHERE id = ? AND destinatario_id = ?", id, pessoaId);
    }
}
