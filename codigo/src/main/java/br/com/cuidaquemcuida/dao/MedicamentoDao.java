package br.com.cuidaquemcuida.dao;

import br.com.cuidaquemcuida.infra.Sql;
import br.com.cuidaquemcuida.model.Medicamento;
import br.com.cuidaquemcuida.model.RegraHorario;
import br.com.cuidaquemcuida.model.TipoRegra;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/** Remédios e suas regras de horário (tabelas {@code medicamento} e {@code regra_horario}, 1:1). */
public final class MedicamentoDao {

    private static final String CONSULTA = """
            SELECT m.id, m.paciente_id, m.nome, m.dosagem, m.via, m.instrucoes, m.ativo,
                   r.tipo, r.intervalo_horas, r.primeira_dose, r.horarios, r.inicio, r.fim
              FROM medicamento m
              JOIN regra_horario r ON r.medicamento_id = m.id
            """;

    private MedicamentoDao() {
    }

    private static Medicamento mapear(ResultSet rs) throws SQLException {
        int intervalo = rs.getInt("intervalo_horas");
        Integer intervaloHoras = rs.wasNull() ? null : intervalo;
        RegraHorario regra = RegraHorario.criar(TipoRegra.valueOf(rs.getString("tipo")), intervaloHoras,
                rs.getObject("primeira_dose", LocalTime.class), lerHorarios(rs.getString("horarios")),
                rs.getObject("inicio", LocalDate.class), rs.getObject("fim", LocalDate.class));
        Medicamento m = new Medicamento(rs.getLong("id"), rs.getLong("paciente_id"), rs.getString("nome"), regra);
        m.setDosagem(rs.getString("dosagem"));
        m.setVia(rs.getString("via"));
        m.setInstrucoes(rs.getString("instrucoes"));
        m.setAtivo(rs.getBoolean("ativo"));
        return m;
    }

    /** "08:00;20:00" -> [08:00, 20:00] */
    static List<LocalTime> lerHorarios(String texto) {
        if (texto == null || texto.isBlank()) {
            return null;
        }
        return Arrays.stream(texto.split(";")).map(String::trim).filter(s -> !s.isEmpty()).map(LocalTime::parse).toList();
    }

    /** [08:00, 20:00] -> "08:00;20:00" */
    static String gravarHorarios(List<LocalTime> horarios) {
        return horarios == null ? null : horarios.stream().map(h -> String.format("%02d:%02d", h.getHour(), h.getMinute()))
                .collect(Collectors.joining(";"));
    }

    public static List<Medicamento> doPaciente(long pacienteId) {
        return Sql.listar(CONSULTA + " WHERE m.paciente_id = ? ORDER BY m.nome", MedicamentoDao::mapear, pacienteId);
    }

    public static Optional<Medicamento> porId(long id) {
        return Sql.um(CONSULTA + " WHERE m.id = ?", MedicamentoDao::mapear, id);
    }

    /** Grava o remédio e a regra juntos (chame dentro de Sql.transacao). */
    public static long inserir(Medicamento m) {
        long id = Sql.inserir("INSERT INTO medicamento (paciente_id, nome, dosagem, via, instrucoes, ativo) VALUES (?, ?, ?, ?, ?, ?) RETURNING id",
                m.getPacienteId(), m.getNome(), m.getDosagem(), m.getVia(), m.getInstrucoes(), m.isAtivo());
        RegraHorario r = m.getRegra();
        Sql.executar("""
                INSERT INTO regra_horario (medicamento_id, tipo, intervalo_horas, primeira_dose, horarios, inicio, fim)
                VALUES (?, ?, ?, ?, ?, ?, ?)
                """, id, r.tipo(), r.getIntervaloHoras(), r.getPrimeiraDose(), gravarHorarios(r.getHorarios()), r.getInicio(), r.getFim());
        return id;
    }

    public static void atualizar(Medicamento m) {
        Sql.executar("UPDATE medicamento SET nome = ?, dosagem = ?, via = ?, instrucoes = ?, ativo = ? WHERE id = ?",
                m.getNome(), m.getDosagem(), m.getVia(), m.getInstrucoes(), m.isAtivo(), m.getId());
        RegraHorario r = m.getRegra();
        Sql.executar("""
                UPDATE regra_horario SET tipo = ?, intervalo_horas = ?, primeira_dose = ?, horarios = ?, inicio = ?, fim = ?
                 WHERE medicamento_id = ?
                """, r.tipo(), r.getIntervaloHoras(), r.getPrimeiraDose(), gravarHorarios(r.getHorarios()), r.getInicio(), r.getFim(), m.getId());
    }

    public static void apagar(long id) {
        Sql.executar("DELETE FROM medicamento WHERE id = ?", id);
    }
}
