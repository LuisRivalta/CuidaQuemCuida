package br.com.cuidaquemcuida.model;

import java.time.LocalDateTime;

/** Uma dose prevista de um remédio e o que aconteceu com ela. Tabela {@code dose}. */
public class Dose {

    private Long id;
    private final long medicamentoId;
    private final LocalDateTime previstoPara;
    private LocalDateTime dadaEm;
    private Long dadaPor;
    private StatusDose status;
    private String observacao;

    public Dose(Long id, long medicamentoId, LocalDateTime previstoPara, StatusDose status) {
        if (previstoPara == null) {
            throw new IllegalArgumentException("A dose precisa de um horário previsto");
        }
        this.id = id;
        this.medicamentoId = medicamentoId;
        this.previstoPara = previstoPara;
        this.status = status == null ? StatusDose.PENDENTE : status;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public long getMedicamentoId() {
        return medicamentoId;
    }

    public LocalDateTime getPrevistoPara() {
        return previstoPara;
    }

    public LocalDateTime getDadaEm() {
        return dadaEm;
    }

    public void setDadaEm(LocalDateTime dadaEm) {
        this.dadaEm = dadaEm;
    }

    public Long getDadaPor() {
        return dadaPor;
    }

    public void setDadaPor(Long dadaPor) {
        this.dadaPor = dadaPor;
    }

    public StatusDose getStatus() {
        return status;
    }

    public void setStatus(StatusDose status) {
        this.status = status;
    }

    public String getObservacao() {
        return observacao;
    }

    public void setObservacao(String observacao) {
        this.observacao = observacao;
    }
}
