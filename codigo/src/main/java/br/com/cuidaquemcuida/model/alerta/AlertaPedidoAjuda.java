package br.com.cuidaquemcuida.model.alerta;

/** Pedido de ajuda à rede, feito pela própria pessoa depois de uma Zarit com sobrecarga alta. Não mostra a pontuação. */
public class AlertaPedidoAjuda extends Alerta {

    private final String nomePessoa;

    public AlertaPedidoAjuda(long pacienteId, long destinatarioId, long avaliacaoId, String nomePessoa) {
        super(TipoAlerta.PEDIDO_AJUDA, pacienteId, destinatarioId, "zarit:" + avaliacaoId);
        this.nomePessoa = nomePessoa;
    }

    @Override
    public String mensagem() {
        return nomePessoa + " pediu ajuda à rede: está muito sobrecarregada(o). Que tal oferecer um turno?";
    }
}
