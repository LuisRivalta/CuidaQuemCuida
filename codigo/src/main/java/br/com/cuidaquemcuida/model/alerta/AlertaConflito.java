package br.com.cuidaquemcuida.model.alerta;

import br.com.cuidaquemcuida.model.Turno;

/** Mesma pessoa com dois turnos ao mesmo tempo. */
public class AlertaConflito extends Alerta {

    private final String nomePessoa;
    private final Turno a;
    private final Turno b;

    public AlertaConflito(long pacienteId, long destinatarioId, String nomePessoa, Turno a, Turno b) {
        super(TipoAlerta.CONFLITO_TURNO, pacienteId, destinatarioId, "conflito:" + a.getId() + "-" + b.getId());
        this.nomePessoa = nomePessoa;
        this.a = a;
        this.b = b;
    }

    @Override
    public String mensagem() {
        return nomePessoa + " tem dois turnos ao mesmo tempo na " + diaDaSemana(a.getInicio()).toLowerCase(PT_BR) + " ("
                + hora(a.getInicio()) + "–" + hora(a.getFim()) + " e " + hora(b.getInicio()) + "–" + hora(b.getFim()) + ")";
    }
}
