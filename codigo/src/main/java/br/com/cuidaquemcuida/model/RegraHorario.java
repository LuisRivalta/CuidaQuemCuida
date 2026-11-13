package br.com.cuidaquemcuida.model;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

/**
 * Regra que diz quando um remédio deve ser dado. Cada tipo de regra é uma subclasse
 * que gera os horários do seu jeito (polimorfismo, Fase 3):
 * {@link RegraIntervalo}, {@link RegraHorariosFixos} e {@link RegraDiasAlternados}.
 */
public abstract class RegraHorario {

    private final LocalDate inicio;
    private final LocalDate fim;

    protected RegraHorario(LocalDate inicio, LocalDate fim) {
        if (inicio == null) {
            throw new IllegalArgumentException("Informe a data de início do remédio");
        }
        if (fim != null && fim.isBefore(inicio)) {
            throw new IllegalArgumentException("A data de fim não pode ser antes do início");
        }
        this.inicio = inicio;
        this.fim = fim;
    }

    /**
     * Horários previstos dentro de [de, ate), em ordem e sem repetição, respeitando o início e o fim da regra.
     * Chamar duas vezes com o mesmo período devolve a mesma lista (por isso as doses não duplicam).
     */
    public abstract List<LocalDateTime> horariosEntre(LocalDateTime de, LocalDateTime ate);

    public abstract TipoRegra tipo();

    /** Monta a subclasse certa a partir do tipo (usado ao ler do banco e ao receber da tela). */
    public static RegraHorario criar(TipoRegra tipo, Integer intervaloHoras, LocalTime primeiraDose,
                                     List<LocalTime> horarios, LocalDate inicio, LocalDate fim) {
        if (tipo == null) {
            throw new IllegalArgumentException("Escolha o tipo de horário");
        }
        return switch (tipo) {
            case INTERVALO -> {
                if (intervaloHoras == null) {
                    throw new IllegalArgumentException("Informe o intervalo em horas");
                }
                yield new RegraIntervalo(inicio, fim, intervaloHoras, primeiraDose);
            }
            case HORARIOS_FIXOS -> new RegraHorariosFixos(inicio, fim, horarios);
            case DIAS_ALTERNADOS -> new RegraDiasAlternados(inicio, fim, horarios);
        };
    }

    /** O dia está dentro do período da regra? */
    protected boolean vigente(LocalDate dia) {
        return !dia.isBefore(inicio) && (fim == null || !dia.isAfter(fim));
    }

    /** Primeiro instante depois do fim da regra (ou null se não tem fim). */
    protected LocalDateTime limiteFinal() {
        return fim == null ? null : fim.plusDays(1).atStartOfDay();
    }

    public Integer getIntervaloHoras() {
        return null;
    }

    public LocalTime getPrimeiraDose() {
        return null;
    }

    public List<LocalTime> getHorarios() {
        return null;
    }

    public LocalDate getInicio() {
        return inicio;
    }

    public LocalDate getFim() {
        return fim;
    }
}
