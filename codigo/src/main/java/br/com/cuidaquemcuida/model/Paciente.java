package br.com.cuidaquemcuida.model;

import java.time.LocalDate;

/** Pessoa cuidada. Não tem login: os dados de saúde são autorizados pelo responsável legal. Tabela {@code paciente}. */
public class Paciente extends Pessoa {

    private String condicao;
    private boolean precisa24h;
    private String observacoes;
    private String responsavelNome;
    private String responsavelParentesco;
    private String codigoConvite;

    public Paciente(Long id, String nome, LocalDate dataNascimento, String responsavelNome, String responsavelParentesco) {
        super(id, nome, dataNascimento);
        setResponsavel(responsavelNome, responsavelParentesco);
    }

    @Override
    public String descricao() {
        return condicao == null ? getNome() : getNome() + " (" + condicao + ")";
    }

    public final void setResponsavel(String nome, String parentesco) {
        if (nome == null || nome.isBlank() || parentesco == null || parentesco.isBlank()) {
            throw new IllegalArgumentException("Informe o nome e o parentesco do responsável legal");
        }
        this.responsavelNome = nome.trim();
        this.responsavelParentesco = parentesco.trim();
    }

    public String getCondicao() {
        return condicao;
    }

    public void setCondicao(String condicao) {
        this.condicao = condicao;
    }

    public boolean isPrecisa24h() {
        return precisa24h;
    }

    public void setPrecisa24h(boolean precisa24h) {
        this.precisa24h = precisa24h;
    }

    public String getObservacoes() {
        return observacoes;
    }

    public void setObservacoes(String observacoes) {
        this.observacoes = observacoes;
    }

    public String getResponsavelNome() {
        return responsavelNome;
    }

    public String getResponsavelParentesco() {
        return responsavelParentesco;
    }

    public String getCodigoConvite() {
        return codigoConvite;
    }

    public void setCodigoConvite(String codigoConvite) {
        this.codigoConvite = codigoConvite;
    }
}
