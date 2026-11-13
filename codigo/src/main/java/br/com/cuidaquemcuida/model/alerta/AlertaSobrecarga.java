package br.com.cuidaquemcuida.model.alerta;

import java.time.LocalDate;

/** Pessoa com horas demais na semana ou sem folga. Referência por pessoa e dia, para avisar no máximo uma vez por dia. */
public class AlertaSobrecarga extends Alerta {

    private final String nomePessoa;
    private final double horas7d;
    private final double horasSeguidas;

    public AlertaSobrecarga(long pacienteId, long destinatarioId, long pessoaId, String nomePessoa,
                            double horas7d, double horasSeguidas, LocalDate dia) {
        super(TipoAlerta.SOBRECARGA, pacienteId, destinatarioId, "sobrecarga:" + pessoaId + ":" + dia);
        this.nomePessoa = nomePessoa;
        this.horas7d = horas7d;
        this.horasSeguidas = horasSeguidas;
    }

    @Override
    public String mensagem() {
        return nomePessoa + ": " + Math.round(horas7d) + " h nos últimos 7 dias, "
                + Math.round(horasSeguidas) + " h seguidas sem folga";
    }
}
