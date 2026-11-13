package br.com.cuidaquemcuida.model;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.TreeSet;

/**
 * Tarefa do protocolo de cuidado (ex.: mudar de posição a cada 2 h para evitar escara).
 * Com {@code tipoSinal} preenchido, a tarefa é uma medição (ex.: "Medir pressão"). Tabela {@code tarefa_cuidado}.
 */
public class TarefaCuidado {

    private Long id;
    private final long pacienteId;
    private String titulo;
    private String orientacao;
    private int recorrenciaHoras;
    private LocalTime primeiraVez;
    private TipoSinal tipoSinal;
    private boolean ativa;

    public TarefaCuidado(Long id, long pacienteId, String titulo, String orientacao, int recorrenciaHoras,
                         LocalTime primeiraVez, TipoSinal tipoSinal, boolean ativa) {
        if (titulo == null || titulo.isBlank()) {
            throw new IllegalArgumentException("Informe o nome da tarefa");
        }
        if (recorrenciaHoras < 1 || recorrenciaHoras > 24) {
            throw new IllegalArgumentException("A repetição precisa ser de 1 a 24 horas");
        }
        if (primeiraVez == null) {
            throw new IllegalArgumentException("Informe o horário da primeira vez");
        }
        this.id = id;
        this.pacienteId = pacienteId;
        this.titulo = titulo.trim();
        this.orientacao = orientacao;
        this.recorrenciaHoras = recorrenciaHoras;
        this.primeiraVez = primeiraVez;
        this.tipoSinal = tipoSinal;
        this.ativa = ativa;
    }

    /**
     * Horários da tarefa num dia: primeira vez + k × recorrência, dando a volta no relógio (módulo 24 h).
     * Assim, "a cada 2 h a partir das 6h" também acontece de madrugada, no turno da noite.
     */
    public List<LocalDateTime> horariosDoDia(LocalDate dia) {
        if (!ativa) {
            return List.of();
        }
        int minutoInicial = primeiraVez.getHour() * 60 + primeiraVez.getMinute();
        TreeSet<Integer> minutos = new TreeSet<>();
        for (int k = 0; k * recorrenciaHoras < 24; k++) {
            minutos.add((minutoInicial + k * recorrenciaHoras * 60) % 1440);
        }
        return minutos.stream().map(m -> dia.atStartOfDay().plusMinutes(m)).toList();
    }

    public boolean medicao() {
        return tipoSinal != null;
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

    public String getTitulo() {
        return titulo;
    }

    public String getOrientacao() {
        return orientacao;
    }

    public int getRecorrenciaHoras() {
        return recorrenciaHoras;
    }

    public LocalTime getPrimeiraVez() {
        return primeiraVez;
    }

    public TipoSinal getTipoSinal() {
        return tipoSinal;
    }

    public boolean isAtiva() {
        return ativa;
    }
}
