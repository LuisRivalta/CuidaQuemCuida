package br.com.cuidaquemcuida.model;

import java.time.LocalDateTime;
import java.util.List;

/** Remédio do paciente, com a sua regra de horário. Tabelas {@code medicamento} e {@code regra_horario}. */
public class Medicamento {

    private Long id;
    private final long pacienteId;
    private String nome;
    private String dosagem;
    private String via;
    private String instrucoes;
    private boolean ativo;
    private RegraHorario regra;

    public Medicamento(Long id, long pacienteId, String nome, RegraHorario regra) {
        this.id = id;
        this.pacienteId = pacienteId;
        setNome(nome);
        setRegra(regra);
        this.ativo = true;
    }

    /** Horários previstos das doses no período (delegado à regra: polimorfismo). Remédio suspenso não tem doses. */
    public List<LocalDateTime> horariosEntre(LocalDateTime de, LocalDateTime ate) {
        return ativo ? regra.horariosEntre(de, ate) : List.of();
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

    public String getNome() {
        return nome;
    }

    public final void setNome(String nome) {
        if (nome == null || nome.isBlank()) {
            throw new IllegalArgumentException("Informe o nome do remédio");
        }
        this.nome = nome.trim();
    }

    public String getDosagem() {
        return dosagem;
    }

    public void setDosagem(String dosagem) {
        this.dosagem = dosagem;
    }

    public String getVia() {
        return via;
    }

    public void setVia(String via) {
        this.via = via;
    }

    public String getInstrucoes() {
        return instrucoes;
    }

    public void setInstrucoes(String instrucoes) {
        this.instrucoes = instrucoes;
    }

    public boolean isAtivo() {
        return ativo;
    }

    public void setAtivo(boolean ativo) {
        this.ativo = ativo;
    }

    public RegraHorario getRegra() {
        return regra;
    }

    public final void setRegra(RegraHorario regra) {
        if (regra == null) {
            throw new IllegalArgumentException("Informe a regra de horário do remédio");
        }
        this.regra = regra;
    }
}
