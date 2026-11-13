package br.com.cuidaquemcuida.model;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

/** "De 8 em 8 horas, a partir das 6h": conta a partir do primeiro dia da regra, atravessando os dias. */
public class RegraIntervalo extends RegraHorario {

    private final int intervaloHoras;
    private final LocalTime primeiraDose;

    public RegraIntervalo(LocalDate inicio, LocalDate fim, int intervaloHoras, LocalTime primeiraDose) {
        super(inicio, fim);
        if (intervaloHoras < 1 || intervaloHoras > 24) {
            throw new IllegalArgumentException("O intervalo precisa ser de 1 a 24 horas");
        }
        if (primeiraDose == null) {
            throw new IllegalArgumentException("Informe o horário da primeira dose");
        }
        this.intervaloHoras = intervaloHoras;
        this.primeiraDose = primeiraDose;
    }

    @Override
    public List<LocalDateTime> horariosEntre(LocalDateTime de, LocalDateTime ate) {
        LocalDateTime primeira = getInicio().atTime(primeiraDose);
        LocalDateTime limite = limiteFinal() != null && limiteFinal().isBefore(ate) ? limiteFinal() : ate;
        Duration passo = Duration.ofHours(intervaloHoras);

        // Pula direto para a primeira dose >= de, sem percorrer os dias anteriores.
        LocalDateTime atual = primeira;
        if (de.isAfter(primeira)) {
            long passos = (Duration.between(primeira, de).toMinutes() + passo.toMinutes() - 1) / passo.toMinutes();
            atual = primeira.plus(passo.multipliedBy(passos));
        }
        List<LocalDateTime> horarios = new ArrayList<>();
        for (; atual.isBefore(limite); atual = atual.plus(passo)) {
            horarios.add(atual);
        }
        return horarios;
    }

    @Override
    public TipoRegra tipo() {
        return TipoRegra.INTERVALO;
    }

    @Override
    public Integer getIntervaloHoras() {
        return intervaloHoras;
    }

    @Override
    public LocalTime getPrimeiraDose() {
        return primeiraDose;
    }
}
