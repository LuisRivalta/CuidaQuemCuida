package br.com.cuidaquemcuida.model;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Um período da escala de revezamento. {@code pessoaId} nulo = turno vago.
 * Início e fim guardam data E hora, então um turno das 22h às 6h termina no dia seguinte.
 */
public class Turno {

    /** Um turno é noturno quando cobre pelo menos 3 horas entre 22h e 6h. */
    public static final int MINUTOS_NOTURNOS_MINIMOS = 180;

    private Long id;
    private final long pacienteId;
    private Long pessoaId;
    private final LocalDateTime inicio;
    private final LocalDateTime fim;
    private StatusTurno status;

    public Turno(Long id, long pacienteId, Long pessoaId, LocalDateTime inicio, LocalDateTime fim, StatusTurno status) {
        if (inicio == null || fim == null) {
            throw new IllegalArgumentException("Informe o início e o fim do turno");
        }
        if (!fim.isAfter(inicio)) {
            throw new IllegalArgumentException("O fim do turno precisa ser depois do início");
        }
        this.id = id;
        this.pacienteId = pacienteId;
        this.pessoaId = pessoaId;
        this.inicio = inicio;
        this.fim = fim;
        this.status = status == null ? StatusTurno.PLANEJADO : status;
    }

    public long minutos() {
        return Duration.between(inicio, fim).toMinutes();
    }

    /** Dois turnos se sobrepõem se um começa antes do outro terminar. Turnos encostados (14h-14h) não se sobrepõem. */
    public boolean sobrepoe(Turno outro) {
        return inicio.isBefore(outro.fim) && outro.inicio.isBefore(fim);
    }

    public boolean noturno() {
        long minutosNaNoite = 0;
        for (LocalDate dia = inicio.toLocalDate().minusDays(1); !dia.isAfter(fim.toLocalDate()); dia = dia.plusDays(1)) {
            LocalDateTime noiteInicio = dia.atTime(22, 0);
            LocalDateTime noiteFim = dia.plusDays(1).atTime(6, 0);
            LocalDateTime de = inicio.isAfter(noiteInicio) ? inicio : noiteInicio;
            LocalDateTime ate = fim.isBefore(noiteFim) ? fim : noiteFim;
            if (de.isBefore(ate)) {
                minutosNaNoite += Duration.between(de, ate).toMinutes();
            }
        }
        return minutosNaNoite >= MINUTOS_NOTURNOS_MINIMOS;
    }

    public boolean vago() {
        return pessoaId == null;
    }

    public boolean cancelado() {
        return status == StatusTurno.CANCELADO;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public long getPacienteId() {
        return pacienteId;
    }

    public Long getPessoaId() {
        return pessoaId;
    }

    public void setPessoaId(Long pessoaId) {
        this.pessoaId = pessoaId;
    }

    public LocalDateTime getInicio() {
        return inicio;
    }

    public LocalDateTime getFim() {
        return fim;
    }

    public StatusTurno getStatus() {
        return status;
    }

    public void setStatus(StatusTurno status) {
        this.status = status;
    }
}
