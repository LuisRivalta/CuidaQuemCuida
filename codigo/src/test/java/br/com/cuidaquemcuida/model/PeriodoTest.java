package br.com.cuidaquemcuida.model;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.time.LocalTime;
import org.junit.jupiter.api.Test;

class PeriodoTest {

    @Test
    void classificaHorariosDeFronteira() {
        assertEquals(Periodo.MADRUGADA, Periodo.de(LocalTime.of(0, 0)));
        assertEquals(Periodo.MADRUGADA, Periodo.de(LocalTime.of(5, 59)));
        assertEquals(Periodo.MANHA, Periodo.de(LocalTime.of(6, 0)));
        assertEquals(Periodo.MANHA, Periodo.de(LocalTime.of(11, 59)));
        assertEquals(Periodo.TARDE, Periodo.de(LocalTime.of(12, 0)));
        assertEquals(Periodo.NOITE, Periodo.de(LocalTime.of(18, 0)));
        assertEquals(Periodo.NOITE, Periodo.de(LocalTime.of(23, 59)));
    }
}
