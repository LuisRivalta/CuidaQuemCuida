package br.com.cuidaquemcuida.model;

import java.time.LocalDateTime;

/** Uma medição de sinal vital. Na pressão, {@code valor} é a máxima e {@code valor2} a mínima. Tabela {@code sinal_vital}. */
public class SinalVital {

    private Long id;
    private final long pacienteId;
    private final TipoSinal tipo;
    private final double valor;
    private final Double valor2;
    private final LocalDateTime medidoEm;
    private final Long medidoPor;

    public SinalVital(Long id, long pacienteId, TipoSinal tipo, double valor, Double valor2, LocalDateTime medidoEm, Long medidoPor) {
        if (tipo == null) {
            throw new IllegalArgumentException("Escolha o tipo de medição");
        }
        if (valor <= 0 || (valor2 != null && valor2 <= 0)) {
            throw new IllegalArgumentException("O valor precisa ser maior que zero");
        }
        this.id = id;
        this.pacienteId = pacienteId;
        this.tipo = tipo;
        this.valor = valor;
        this.valor2 = valor2;
        this.medidoEm = medidoEm == null ? LocalDateTime.now() : medidoEm;
        this.medidoPor = medidoPor;
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

    public TipoSinal getTipo() {
        return tipo;
    }

    public double getValor() {
        return valor;
    }

    public Double getValor2() {
        return valor2;
    }

    public LocalDateTime getMedidoEm() {
        return medidoEm;
    }

    public Long getMedidoPor() {
        return medidoPor;
    }
}
