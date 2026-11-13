package br.com.cuidaquemcuida.model;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

/** "Todo dia às 8h e às 20h". */
public class RegraHorariosFixos extends RegraHorario {

    private final List<LocalTime> horarios;

    public RegraHorariosFixos(LocalDate inicio, LocalDate fim, List<LocalTime> horarios) {
        super(inicio, fim);
        if (horarios == null || horarios.isEmpty()) {
            throw new IllegalArgumentException("Informe pelo menos um horário");
        }
        this.horarios = horarios.stream().distinct().sorted().toList();
    }

    @Override
    public List<LocalDateTime> horariosEntre(LocalDateTime de, LocalDateTime ate) {
        List<LocalDateTime> lista = new ArrayList<>();
        for (LocalDate dia = de.toLocalDate(); !dia.isAfter(ate.toLocalDate()); dia = dia.plusDays(1)) {
            if (!vigente(dia) || !valeNoDia(dia)) {
                continue;
            }
            for (LocalTime hora : horarios) {
                LocalDateTime instante = dia.atTime(hora);
                if (!instante.isBefore(de) && instante.isBefore(ate)) {
                    lista.add(instante);
                }
            }
        }
        return lista;
    }

    /** Ponto de extensão: a regra de dias alternados troca só esta decisão. */
    protected boolean valeNoDia(LocalDate dia) {
        return true;
    }

    @Override
    public TipoRegra tipo() {
        return TipoRegra.HORARIOS_FIXOS;
    }

    @Override
    public List<LocalTime> getHorarios() {
        return horarios;
    }
}
