package br.com.cuidaquemcuida.model;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import org.junit.jupiter.api.Test;

class TarefaCuidadoTest {

    private static final LocalDate DIA = LocalDate.of(2026, 11, 13);

    private static TarefaCuidado tarefa(int recorrenciaHoras, LocalTime primeiraVez) {
        return new TarefaCuidado(1L, 1L, "Mudar de posição", null, recorrenciaHoras, primeiraVez, null, true);
    }

    @Test
    void aCadaDuasHorasIncluiAMadrugada() {
        List<LocalDateTime> horarios = tarefa(2, LocalTime.of(6, 0)).horariosDoDia(DIA);
        assertEquals(12, horarios.size());
        assertEquals(DIA.atTime(0, 0), horarios.get(0));
        assertTrue(horarios.contains(DIA.atTime(6, 0)));
        assertEquals(DIA.atTime(22, 0), horarios.get(11));
    }

    @Test
    void umaVezPorDiaSoNoHorarioDaPrimeiraVez() {
        assertEquals(List.of(DIA.atTime(8, 0)), tarefa(24, LocalTime.of(8, 0)).horariosDoDia(DIA));
    }
}
