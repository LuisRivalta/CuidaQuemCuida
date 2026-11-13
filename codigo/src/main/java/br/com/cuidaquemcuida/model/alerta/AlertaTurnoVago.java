package br.com.cuidaquemcuida.model.alerta;

import java.time.LocalDateTime;

/** Período sem ninguém na escala (paciente que precisa de acompanhamento 24 h). */
public class AlertaTurnoVago extends Alerta {

    private final LocalDateTime inicio;
    private final LocalDateTime fim;

    public AlertaTurnoVago(long pacienteId, long destinatarioId, LocalDateTime inicio, LocalDateTime fim) {
        super(TipoAlerta.TURNO_VAGO, pacienteId, destinatarioId, "vago:" + inicio);
        this.inicio = inicio;
        this.fim = fim;
    }

    @Override
    public String mensagem() {
        return diaDaSemana(inicio) + " " + hora(inicio) + "–" + hora(fim) + " está sem ninguém";
    }
}
