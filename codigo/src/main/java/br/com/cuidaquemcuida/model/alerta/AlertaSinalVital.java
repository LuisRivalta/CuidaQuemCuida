package br.com.cuidaquemcuida.model.alerta;

import br.com.cuidaquemcuida.model.TipoSinal;

/** Sinal vital fora da faixa combinada ou fora do padrão do próprio paciente. */
public class AlertaSinalVital extends Alerta {

    private final TipoSinal tipoSinal;
    private final double valor;
    private final Double valor2;
    private final String nomePaciente;

    public AlertaSinalVital(TipoAlerta tipo, long pacienteId, long destinatarioId, long sinalId,
                            TipoSinal tipoSinal, double valor, Double valor2, String nomePaciente) {
        super(tipo, pacienteId, destinatarioId, "sinal:" + sinalId);
        if (tipo != TipoAlerta.SINAL_FORA_FAIXA && tipo != TipoAlerta.SINAL_FORA_CURVA) {
            throw new IllegalArgumentException("Tipo de alerta de sinal vital inválido: " + tipo);
        }
        this.tipoSinal = tipoSinal;
        this.valor = valor;
        this.valor2 = valor2;
        this.nomePaciente = nomePaciente;
    }

    @Override
    public String mensagem() {
        String medida = numero(valor) + (valor2 == null ? "" : "/" + numero(valor2)) + " " + tipoSinal.unidade();
        String motivo = getTipo() == TipoAlerta.SINAL_FORA_FAIXA ? "fora da faixa" : "fora do padrão";
        return tipoSinal.nome() + " " + medida + " " + motivo + " de " + nomePaciente;
    }
}
