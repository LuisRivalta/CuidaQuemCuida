package br.com.cuidaquemcuida.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;

import br.com.cuidaquemcuida.model.alerta.Alerta;
import br.com.cuidaquemcuida.model.alerta.AlertaMedicacao;
import br.com.cuidaquemcuida.model.alerta.AlertaSobrecarga;
import br.com.cuidaquemcuida.model.alerta.AlertaTurnoVago;
import br.com.cuidaquemcuida.model.alerta.TipoAlerta;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import org.junit.jupiter.api.Test;

class AlertaServiceTest {

    private static final LocalDateTime DOMINGO_22H = LocalDateTime.of(2026, 11, 15, 22, 0);

    @Test
    void chaveEhTipoEReferenciaDoAlerta() {
        List<Alerta> alertas = List.of(
                new AlertaMedicacao(TipoAlerta.DOSE_ATRASADA, 1, 2, 301, "Losartana", DOMINGO_22H),
                new AlertaTurnoVago(1, 2, DOMINGO_22H, DOMINGO_22H.plusHours(8)));
        assertEquals(List.of("DOSE_ATRASADA|dose:301", "TURNO_VAGO|vago:2026-11-15T22:00"), AlertaService.chaves(alertas));
    }

    @Test
    void nenhumaChaveTemOSeparadorUsadoNoSql() {
        List<Alerta> alertas = List.of(
                new AlertaTurnoVago(1, 2, DOMINGO_22H.plusMinutes(17).plusSeconds(3), DOMINGO_22H.plusHours(8)),
                new AlertaSobrecarga(1, 2, 7, "Marta Souza", 96, 88, LocalDate.of(2026, 11, 14)));
        AlertaService.chaves(alertas).forEach(chave -> assertFalse(chave.contains(";"), chave));
    }
}
