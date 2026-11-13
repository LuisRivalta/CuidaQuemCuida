package br.com.cuidaquemcuida.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

import org.junit.jupiter.api.Test;

class EstatisticaServiceTest {

    @Test
    void nanViraNull() {
        assertNull(EstatisticaService.paraJson(Double.NaN), "JSON não aceita NaN: valor indefinido sai como null");
        assertNull(EstatisticaService.paraJson(Double.POSITIVE_INFINITY));
        assertEquals(Double.valueOf(0.5), EstatisticaService.paraJson(0.5));
    }

    @Test
    void arredondaEmTresCasas() {
        assertEquals(Double.valueOf(0.333), EstatisticaService.paraJson(1.0 / 3));
    }

    @Test
    void turnoNoturnoEhDeMadrugadaOuDepoisDasVinteEDuas() {
        assertEquals(true, EstatisticaService.horarioNoturno(22));
        assertEquals(true, EstatisticaService.horarioNoturno(5));
        assertEquals(false, EstatisticaService.horarioNoturno(6));
        assertEquals(false, EstatisticaService.horarioNoturno(21));
    }
}
