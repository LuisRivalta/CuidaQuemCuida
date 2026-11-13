package br.com.cuidaquemcuida.model;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.time.LocalDate;
import java.time.LocalDateTime;
import org.junit.jupiter.api.Test;

class TurnoTest {

    private static final LocalDate DIA = LocalDate.of(2026, 11, 13);

    private static Turno turno(LocalDateTime inicio, LocalDateTime fim) {
        return new Turno(null, 1L, 1L, inicio, fim, StatusTurno.PLANEJADO);
    }

    private static LocalDateTime em(int diasDepois, int hora) {
        return DIA.plusDays(diasDepois).atTime(hora, 0);
    }

    @Test
    void turnoQueAtravessaAMeiaNoiteTemOitoHorasEEhNoturno() {
        Turno noite = turno(em(0, 22), em(1, 6));
        assertEquals(480, noite.minutos());
        assertTrue(noite.noturno());
    }

    @Test
    void soUmaHoraNaJanelaDaNoiteNaoEhTurnoNoturno() {
        assertFalse(turno(em(0, 20), em(0, 23)).noturno());
    }

    @Test
    void tresHorasDeMadrugadaEhTurnoNoturno() {
        assertTrue(turno(em(0, 3), em(0, 9)).noturno());
    }

    @Test
    void fimIgualAoInicioEhInvalido() {
        assertThrows(IllegalArgumentException.class, () -> turno(em(0, 8), em(0, 8)));
    }

    @Test
    void turnoDaNoiteSobrepoeOTurnoDaManhaSeguinte() {
        assertTrue(turno(em(0, 22), em(1, 6)).sobrepoe(turno(em(1, 5), em(1, 7))));
    }

    @Test
    void turnosEncostadosNaoSeSobrepoem() {
        assertFalse(turno(em(0, 6), em(0, 14)).sobrepoe(turno(em(0, 14), em(0, 22))));
    }
}
