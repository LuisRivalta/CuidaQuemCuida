package br.com.cuidaquemcuida.model.alerta;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

/**
 * Um aviso para uma pessoa da rede. Cada tipo de alerta é uma subclasse que monta a própria
 * mensagem (polimorfismo, Fase 3). A {@code referencia} identifica o fato (ex.: "dose:301") e,
 * junto com o tipo e o destinatário, impede gravar o mesmo alerta duas vezes.
 */
public abstract class Alerta {

    protected static final Locale PT_BR = Locale.of("pt", "BR");
    private static final DateTimeFormatter DIA_SEMANA = DateTimeFormatter.ofPattern("EEEE", PT_BR);

    private final TipoAlerta tipo;
    private final long pacienteId;
    private final long destinatarioId;
    private final String referencia;

    protected Alerta(TipoAlerta tipo, long pacienteId, long destinatarioId, String referencia) {
        this.tipo = tipo;
        this.pacienteId = pacienteId;
        this.destinatarioId = destinatarioId;
        this.referencia = referencia;
    }

    /** Texto em português simples que aparece na tela. */
    public abstract String mensagem();

    public int prioridade() {
        return tipo.prioridade();
    }

    /** "14h" ou "14h30". */
    protected static String hora(LocalDateTime instante) {
        return instante.getMinute() == 0 ? instante.getHour() + "h" : instante.getHour() + "h" + String.format("%02d", instante.getMinute());
    }

    /** "Domingo". */
    protected static String diaDaSemana(LocalDateTime instante) {
        String dia = DIA_SEMANA.format(instante);
        return Character.toUpperCase(dia.charAt(0)) + dia.substring(1);
    }

    /** Remove casas decimais desnecessárias: 175.0 -> "175". */
    protected static String numero(double valor) {
        return valor == Math.rint(valor) ? String.valueOf((long) valor) : String.valueOf(valor);
    }

    public TipoAlerta getTipo() {
        return tipo;
    }

    public long getPacienteId() {
        return pacienteId;
    }

    public long getDestinatarioId() {
        return destinatarioId;
    }

    public String getReferencia() {
        return referencia;
    }
}
