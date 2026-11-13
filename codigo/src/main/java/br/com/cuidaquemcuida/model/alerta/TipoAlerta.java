package br.com.cuidaquemcuida.model.alerta;

/** Tipos de alerta e a prioridade de cada um (maior aparece primeiro). */
public enum TipoAlerta {
    PEDIDO_AJUDA(100),
    SINAL_FORA_FAIXA(90),
    SINAL_FORA_CURVA(90),
    DOSE_NAO_DADA(80),
    DOSE_ATRASADA(70),
    TURNO_VAGO(60),
    CONFLITO_TURNO(50),
    SOBRECARGA(40),
    TAREFA_ATRASADA(30),
    DOSE_PROXIMA(20);

    private final int prioridade;

    TipoAlerta(int prioridade) {
        this.prioridade = prioridade;
    }

    public int prioridade() {
        return prioridade;
    }
}
