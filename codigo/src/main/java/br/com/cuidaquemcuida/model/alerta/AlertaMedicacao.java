package br.com.cuidaquemcuida.model.alerta;

import java.time.LocalDateTime;

/** Dose próxima, atrasada ou não dada. */
public class AlertaMedicacao extends Alerta {

    private final String nomeRemedio;
    private final LocalDateTime previsto;

    public AlertaMedicacao(TipoAlerta tipo, long pacienteId, long destinatarioId, long doseId, String nomeRemedio, LocalDateTime previsto) {
        super(tipo, pacienteId, destinatarioId, "dose:" + doseId);
        if (tipo != TipoAlerta.DOSE_PROXIMA && tipo != TipoAlerta.DOSE_ATRASADA && tipo != TipoAlerta.DOSE_NAO_DADA) {
            throw new IllegalArgumentException("Tipo de alerta de medicação inválido: " + tipo);
        }
        this.nomeRemedio = nomeRemedio;
        this.previsto = previsto;
    }

    @Override
    public String mensagem() {
        return switch (getTipo()) {
            case DOSE_PROXIMA -> nomeRemedio + " às " + hora(previsto) + ", daqui a pouco";
            case DOSE_ATRASADA -> nomeRemedio + " das " + hora(previsto) + " ainda não foi dado";
            default -> nomeRemedio + " das " + hora(previsto) + " ficou sem registro";
        };
    }
}
