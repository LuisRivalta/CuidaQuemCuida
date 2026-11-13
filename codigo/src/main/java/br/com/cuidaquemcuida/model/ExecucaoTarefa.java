package br.com.cuidaquemcuida.model;

import java.time.LocalDateTime;

/** Uma ocorrência prevista de uma tarefa de cuidado e quem a fez. Tabela {@code execucao_tarefa}. */
public class ExecucaoTarefa {

    private Long id;
    private final long tarefaId;
    private final LocalDateTime previstaPara;
    private LocalDateTime feitaEm;
    private Long feitaPor;

    public ExecucaoTarefa(Long id, long tarefaId, LocalDateTime previstaPara, LocalDateTime feitaEm, Long feitaPor) {
        this.id = id;
        this.tarefaId = tarefaId;
        this.previstaPara = previstaPara;
        this.feitaEm = feitaEm;
        this.feitaPor = feitaPor;
    }

    public boolean feita() {
        return feitaEm != null;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public long getTarefaId() {
        return tarefaId;
    }

    public LocalDateTime getPrevistaPara() {
        return previstaPara;
    }

    public LocalDateTime getFeitaEm() {
        return feitaEm;
    }

    public void setFeitaEm(LocalDateTime feitaEm) {
        this.feitaEm = feitaEm;
    }

    public Long getFeitaPor() {
        return feitaPor;
    }

    public void setFeitaPor(Long feitaPor) {
        this.feitaPor = feitaPor;
    }
}
