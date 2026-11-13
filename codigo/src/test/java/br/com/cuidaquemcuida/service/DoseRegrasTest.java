package br.com.cuidaquemcuida.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import br.com.cuidaquemcuida.model.StatusDose;
import java.time.LocalDateTime;
import org.junit.jupiter.api.Test;

class DoseRegrasTest {

    private static final LocalDateTime PREVISTO = LocalDateTime.of(2026, 11, 13, 8, 0);

    @Test
    void ateTrintaMinutosDepoisEstaNoHorario() {
        assertEquals(StatusDose.DADA, DoseRegras.status(PREVISTO, PREVISTO.plusMinutes(29), false, PREVISTO.plusHours(5)));
        assertEquals(StatusDose.DADA, DoseRegras.status(PREVISTO, PREVISTO.plusMinutes(30), false, PREVISTO.plusHours(5)));
    }

    @Test
    void maisDeTrintaMinutosDepoisEhAtrasada() {
        assertEquals(StatusDose.ATRASADA, DoseRegras.status(PREVISTO, PREVISTO.plusMinutes(31), false, PREVISTO.plusHours(5)));
    }

    @Test
    void semRegistroDepoisDeDuasHorasEhNaoDada() {
        assertEquals(StatusDose.NAO_DADA, DoseRegras.status(PREVISTO, null, false, PREVISTO.plusMinutes(121)));
        assertEquals(StatusDose.PENDENTE, DoseRegras.status(PREVISTO, null, false, PREVISTO.plusMinutes(119)));
    }

    @Test
    void marcadaComoNaoDadaEhNaoDada() {
        assertEquals(StatusDose.NAO_DADA, DoseRegras.status(PREVISTO, null, true, PREVISTO.plusMinutes(5)));
    }

    @Test
    void naoRegistraDoseJaResolvida() {
        assertTrue(DoseRegras.podeRegistrar(StatusDose.PENDENTE));
        assertFalse(DoseRegras.podeRegistrar(StatusDose.DADA));
        assertFalse(DoseRegras.podeRegistrar(StatusDose.ATRASADA));
        assertFalse(DoseRegras.podeRegistrar(StatusDose.NAO_DADA));
    }
}
