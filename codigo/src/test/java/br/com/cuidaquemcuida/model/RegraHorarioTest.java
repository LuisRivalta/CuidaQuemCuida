package br.com.cuidaquemcuida.model;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import org.junit.jupiter.api.Test;

class RegraHorarioTest {

    private static final LocalDate DIA = LocalDate.of(2026, 11, 13);

    private static LocalDateTime inicioDoDia(int diasDepois) {
        return DIA.plusDays(diasDepois).atStartOfDay();
    }

    @Test
    void deOitoEmOitoHorasAPartirDasSeisDaTresDosesNoDia() {
        RegraHorario regra = new RegraIntervalo(DIA, null, 8, LocalTime.of(6, 0));
        assertEquals(
                List.of(DIA.atTime(6, 0), DIA.atTime(14, 0), DIA.atTime(22, 0)),
                regra.horariosEntre(inicioDoDia(0), inicioDoDia(1)));
    }

    @Test
    void intervaloContinuaContandoNosDiasSeguintes() {
        RegraHorario regra = new RegraIntervalo(DIA, null, 8, LocalTime.of(6, 0));
        assertEquals(
                List.of(DIA.plusDays(2).atTime(6, 0), DIA.plusDays(2).atTime(14, 0), DIA.plusDays(2).atTime(22, 0)),
                regra.horariosEntre(inicioDoDia(2), inicioDoDia(3)));
    }

    @Test
    void horariosFixosEmDoisDiasDaoQuatroDoses() {
        RegraHorario regra = new RegraHorariosFixos(DIA, null, List.of(LocalTime.of(20, 0), LocalTime.of(8, 0)));
        assertEquals(
                List.of(DIA.atTime(8, 0), DIA.atTime(20, 0), DIA.plusDays(1).atTime(8, 0), DIA.plusDays(1).atTime(20, 0)),
                regra.horariosEntre(inicioDoDia(0), inicioDoDia(2)));
    }

    @Test
    void diasAlternadosValemNoPrimeiroENoTerceiroDia() {
        RegraHorario regra = new RegraDiasAlternados(DIA, null, List.of(LocalTime.of(9, 0)));
        assertEquals(List.of(DIA.atTime(9, 0)), regra.horariosEntre(inicioDoDia(0), inicioDoDia(1)));
        assertTrue(regra.horariosEntre(inicioDoDia(1), inicioDoDia(2)).isEmpty());
        assertEquals(List.of(DIA.plusDays(2).atTime(9, 0)), regra.horariosEntre(inicioDoDia(2), inicioDoDia(3)));
    }

    @Test
    void foraDoPeriodoDaRegraNaoHaDoses() {
        RegraHorario antesDoInicio = new RegraHorariosFixos(DIA.plusDays(5), null, List.of(LocalTime.of(8, 0)));
        assertTrue(antesDoInicio.horariosEntre(inicioDoDia(0), inicioDoDia(1)).isEmpty());

        RegraHorario depoisDoFim = new RegraIntervalo(DIA, DIA.plusDays(1), 8, LocalTime.of(6, 0));
        assertTrue(depoisDoFim.horariosEntre(inicioDoDia(2), inicioDoDia(3)).isEmpty());
    }

    @Test
    void geracaoIdempotente() {
        RegraHorario regra = new RegraIntervalo(DIA, null, 6, LocalTime.of(0, 0));
        assertEquals(
                regra.horariosEntre(inicioDoDia(0), inicioDoDia(1)),
                regra.horariosEntre(inicioDoDia(0), inicioDoDia(1)));
        assertEquals(4, regra.horariosEntre(inicioDoDia(0), inicioDoDia(1)).size());
    }

    @Test
    void criarMontaASubclasseCertaPeloTipo() {
        assertTrue(RegraHorario.criar(TipoRegra.INTERVALO, 8, LocalTime.of(6, 0), null, DIA, null) instanceof RegraIntervalo);
        assertTrue(RegraHorario.criar(TipoRegra.DIAS_ALTERNADOS, null, null, List.of(LocalTime.NOON), DIA, null)
                instanceof RegraDiasAlternados);
        assertEquals(TipoRegra.HORARIOS_FIXOS,
                RegraHorario.criar(TipoRegra.HORARIOS_FIXOS, null, null, List.of(LocalTime.NOON), DIA, null).tipo());
    }
}
