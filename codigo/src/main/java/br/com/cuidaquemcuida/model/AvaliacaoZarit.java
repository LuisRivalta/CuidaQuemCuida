package br.com.cuidaquemcuida.model;

import java.time.LocalDateTime;

/** Uma resposta à Escala Zarit (ZBI-12) de um cuidador. Dado de saúde privado. Tabelas {@code avaliacao_zarit} e {@code resposta_zarit}. */
public class AvaliacaoZarit {

    private Long id;
    private final long pessoaId;
    private final LocalDateTime respondidaEm;
    private final int[] respostas;
    private final int pontuacao;
    private final FaixaZarit faixa;
    private final Double horasSono;
    private final Integer qualidadeSono;

    public AvaliacaoZarit(Long id, long pessoaId, LocalDateTime respondidaEm, int[] respostas, int pontuacao,
                          FaixaZarit faixa, Double horasSono, Integer qualidadeSono) {
        if (qualidadeSono != null && (qualidadeSono < 1 || qualidadeSono > 5)) {
            throw new IllegalArgumentException("A qualidade do sono vai de 1 a 5");
        }
        if (horasSono != null && (horasSono < 0 || horasSono > 24)) {
            throw new IllegalArgumentException("As horas de sono vão de 0 a 24");
        }
        this.id = id;
        this.pessoaId = pessoaId;
        this.respondidaEm = respondidaEm;
        this.respostas = respostas == null ? null : respostas.clone();
        this.pontuacao = pontuacao;
        this.faixa = faixa;
        this.horasSono = horasSono;
        this.qualidadeSono = qualidadeSono;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public long getPessoaId() {
        return pessoaId;
    }

    public LocalDateTime getRespondidaEm() {
        return respondidaEm;
    }

    public int[] getRespostas() {
        return respostas == null ? null : respostas.clone();
    }

    public int getPontuacao() {
        return pontuacao;
    }

    public FaixaZarit getFaixa() {
        return faixa;
    }

    public Double getHorasSono() {
        return horasSono;
    }

    public Integer getQualidadeSono() {
        return qualidadeSono;
    }
}
