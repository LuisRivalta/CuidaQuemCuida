package br.com.cuidaquemcuida.model.alerta;

import java.time.LocalDateTime;

/** Tarefa de cuidado atrasada (ex.: mudar de posição). */
public class AlertaTarefa extends Alerta {

    private final String titulo;
    private final LocalDateTime prevista;

    public AlertaTarefa(long pacienteId, long destinatarioId, long execucaoId, String titulo, LocalDateTime prevista) {
        super(TipoAlerta.TAREFA_ATRASADA, pacienteId, destinatarioId, "execucao:" + execucaoId);
        this.titulo = titulo;
        this.prevista = prevista;
    }

    @Override
    public String mensagem() {
        return titulo + " das " + hora(prevista) + " ainda não foi feito";
    }
}
