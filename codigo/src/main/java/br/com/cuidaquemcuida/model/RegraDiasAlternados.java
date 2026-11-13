package br.com.cuidaquemcuida.model;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

/** "Dia sim, dia não": os mesmos horários fixos, só nos dias pares contados a partir do início. */
public class RegraDiasAlternados extends RegraHorariosFixos {

    public RegraDiasAlternados(LocalDate inicio, LocalDate fim, List<LocalTime> horarios) {
        super(inicio, fim, horarios);
    }

    @Override
    protected boolean valeNoDia(LocalDate dia) {
        return ChronoUnit.DAYS.between(getInicio(), dia) % 2 == 0;
    }

    @Override
    public TipoRegra tipo() {
        return TipoRegra.DIAS_ALTERNADOS;
    }
}
