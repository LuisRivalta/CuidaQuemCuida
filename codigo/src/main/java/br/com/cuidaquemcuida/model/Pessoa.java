package br.com.cuidaquemcuida.model;

import java.time.LocalDate;
import java.time.Period;

/**
 * Base de quem aparece no sistema: quem cuida ({@link Cuidador}) e quem é cuidado ({@link Paciente}).
 * Classe abstrata: só existem pessoas concretas (herança, Fase 3).
 */
public abstract class Pessoa {

    private Long id;
    private String nome;
    private LocalDate dataNascimento;

    protected Pessoa(Long id, String nome, LocalDate dataNascimento) {
        this.id = id;
        setNome(nome);
        setDataNascimento(dataNascimento);
    }

    /** Como a pessoa aparece em textos do sistema (polimorfismo: cada tipo descreve a si mesmo). */
    public abstract String descricao();

    /** Idade em anos completos na data informada, ou null se a data de nascimento não for conhecida. */
    public Integer idade(LocalDate hoje) {
        return dataNascimento == null ? null : Period.between(dataNascimento, hoje).getYears();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        if (nome == null || nome.isBlank()) {
            throw new IllegalArgumentException("O nome é obrigatório");
        }
        this.nome = nome.trim();
    }

    public LocalDate getDataNascimento() {
        return dataNascimento;
    }

    public void setDataNascimento(LocalDate dataNascimento) {
        if (dataNascimento != null && dataNascimento.isAfter(LocalDate.now())) {
            throw new IllegalArgumentException("A data de nascimento não pode estar no futuro");
        }
        this.dataNascimento = dataNascimento;
    }
}
