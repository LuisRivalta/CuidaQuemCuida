package br.com.cuidaquemcuida.service;

import static org.junit.jupiter.api.Assertions.assertEquals;

import br.com.cuidaquemcuida.model.StatusTurno;
import br.com.cuidaquemcuida.model.Turno;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import org.junit.jupiter.api.Test;

class EscalaRegrasTest {

    private static final LocalDate DIA = LocalDate.of(2026, 11, 13);

    private static LocalDateTime em(int diasDepois, int hora) {
        return DIA.plusDays(diasDepois).atTime(hora, 0);
    }

    private static Turno turno(Long pessoaId, LocalDateTime inicio, LocalDateTime fim) {
        return new Turno(null, 1L, pessoaId, inicio, fim, StatusTurno.PLANEJADO);
    }

    private static Set<Set<Turno>> comoPares(List<EscalaRegras.Conflito> conflitos) {
        Set<Set<Turno>> pares = new HashSet<>();
        for (EscalaRegras.Conflito c : conflitos) {
            pares.add(Set.of(c.a(), c.b()));
        }
        return pares;
    }

    @Test
    void versaoRapidaEVersaoIngenuaAchamOsMesmosConflitos() {
        Turno a = turno(1L, em(0, 6), em(0, 14));
        Turno b = turno(1L, em(0, 12), em(0, 18));
        Turno c = turno(1L, em(0, 20), em(0, 23));
        List<Turno> turnos = List.of(c, a, b);
        assertEquals(Set.of(Set.of(a, b)), comoPares(EscalaRegras.conflitos(turnos)));
        assertEquals(comoPares(EscalaRegras.conflitosIngenuo(turnos)), comoPares(EscalaRegras.conflitos(turnos)));
    }

    @Test
    void versaoRapidaAchaTodosOsParesQuandoUmTurnoLongoCobreOutros() {
        Turno longo = turno(1L, em(0, 6), em(0, 23));
        Turno x = turno(1L, em(0, 8), em(0, 12));
        Turno y = turno(1L, em(0, 10), em(0, 14));
        List<Turno> turnos = List.of(longo, x, y);
        assertEquals(3, EscalaRegras.conflitos(turnos).size());
        assertEquals(comoPares(EscalaRegras.conflitosIngenuo(turnos)), comoPares(EscalaRegras.conflitos(turnos)));
    }

    @Test
    void turnoDaNoiteConflitaComOTurnoDaMadrugadaSeguinte() {
        Turno noite = turno(1L, em(0, 22), em(1, 6));
        Turno cedo = turno(1L, em(1, 5), em(1, 7));
        assertEquals(1, EscalaRegras.conflitos(List.of(noite, cedo)).size());
    }

    @Test
    void turnosComMenosDeOnzeHorasDeIntervaloFormamUmBloco() {
        List<EscalaRegras.Bloco> blocos = EscalaRegras.blocosSemFolga(List.of(
                turno(1L, em(0, 6), em(0, 14)),
                turno(1L, em(0, 22), em(1, 6)),
                turno(1L, em(1, 6), em(1, 14))));
        assertEquals(1, blocos.size());
        assertEquals(24.0, blocos.get(0).horas(), 1e-9);
    }

    @Test
    void dezesseisHorasDeIntervaloEhFolga() {
        assertEquals(2, EscalaRegras.blocosSemFolga(List.of(
                turno(1L, em(0, 6), em(0, 14)),
                turno(1L, em(1, 6), em(1, 14)))).size());
    }

    @Test
    void niveisDeSobrecarga() {
        assertEquals(EscalaRegras.NivelSobrecarga.ATENCAO, EscalaRegras.nivel(45, 10));
        assertEquals(EscalaRegras.NivelSobrecarga.ALERTA, EscalaRegras.nivel(61, 10));
        assertEquals(EscalaRegras.NivelSobrecarga.ALERTA, EscalaRegras.nivel(30, 37));
        assertEquals(EscalaRegras.NivelSobrecarga.OK, EscalaRegras.nivel(44, 24));
    }

    @Test
    void horasNaJanelaRecortaOsTurnos() {
        List<Turno> turnos = List.of(turno(1L, em(-8, 6), em(-8, 14)), turno(1L, em(-7, 22), em(-6, 6)), turno(1L, em(0, 6), em(0, 14)));
        // janela de 7 dias terminando em DIA 12:00: começa em DIA-7 12:00 -> pega 8 h da noite e 6 h de hoje
        assertEquals(14.0, EscalaRegras.horasNaJanela(turnos, em(0, 12), 7), 1e-9);
    }

    @Test
    void periodoDescobertoEhOIntervaloSemNinguem() {
        List<Turno> doPaciente = List.of(turno(1L, em(0, 6), em(0, 14)), turno(2L, em(0, 14), em(0, 22)));
        assertEquals(
                List.of(new EscalaRegras.Intervalo(em(0, 22), em(1, 6))),
                EscalaRegras.periodosDescobertos(doPaciente, em(0, 6), em(1, 6)));
    }

    @Test
    void turnoVagoNaoContaComoCoberto() {
        List<Turno> doPaciente = List.of(turno(1L, em(0, 6), em(0, 14)), turno(null, em(0, 14), em(0, 22)));
        assertEquals(
                List.of(new EscalaRegras.Intervalo(em(0, 14), em(1, 6))),
                EscalaRegras.periodosDescobertos(doPaciente, em(0, 6), em(1, 6)));
    }

    @Test
    void sugestaoExcluiQuemTemConflitoEOrdenaPelaCarga() {
        LocalDateTime agora = em(0, 12);
        Turno vago = turno(null, em(0, 22), em(1, 6));
        Map<Long, List<Turno>> turnosPorPessoa = Map.of(
                1L, List.of(turno(1L, em(0, 21), em(1, 5))),
                2L, List.of(turno(2L, em(-2, 6), em(-2, 18)), turno(2L, em(-1, 6), em(-1, 18)), turno(2L, em(0, 6), em(0, 12))),
                3L, List.of(turno(3L, em(-1, 8), em(-1, 18))));
        assertEquals(List.of(3L, 2L), EscalaRegras.sugerirCobertura(vago, turnosPorPessoa, agora));
    }
}
