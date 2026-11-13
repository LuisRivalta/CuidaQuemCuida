package br.com.cuidaquemcuida.model;

import java.time.LocalDate;

/** Pessoa com login: o cuidador principal, um familiar ou um vizinho voluntário. Tabela {@code pessoa}. */
public class Cuidador extends Pessoa {

    public static final String NOME_ANONIMO = "Pessoa removida";

    private String email;
    private String telefone;
    private String senhaHash;
    private String senhaSalt;
    private String genero;
    private boolean ativo;

    public Cuidador(Long id, String nome, String email, LocalDate dataNascimento) {
        super(id, nome, dataNascimento);
        setEmail(email);
        this.ativo = true;
    }

    @Override
    public String descricao() {
        return ativo ? "Cuidador(a) " + getNome() : NOME_ANONIMO;
    }

    /**
     * Exclusão de conta pela LGPD: apaga os dados pessoais e desativa o login, mas mantém o registro
     * para os históricos de cuidado (dose "dada por", turnos) continuarem íntegros.
     */
    public void anonimizar() {
        setNome(NOME_ANONIMO);
        this.email = "removido-" + getId() + "@anonimo";
        this.telefone = null;
        this.senhaHash = "";
        this.senhaSalt = "";
        this.genero = null;
        setDataNascimento(null);
        this.ativo = false;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        if (email == null || !email.contains("@")) {
            throw new IllegalArgumentException("E-mail inválido");
        }
        this.email = email.trim().toLowerCase();
    }

    public String getTelefone() {
        return telefone;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }

    public String getSenhaHash() {
        return senhaHash;
    }

    public void setSenhaHash(String senhaHash) {
        this.senhaHash = senhaHash;
    }

    public String getSenhaSalt() {
        return senhaSalt;
    }

    public void setSenhaSalt(String senhaSalt) {
        this.senhaSalt = senhaSalt;
    }

    public String getGenero() {
        return genero;
    }

    public void setGenero(String genero) {
        this.genero = genero;
    }

    public boolean isAtivo() {
        return ativo;
    }

    public void setAtivo(boolean ativo) {
        this.ativo = ativo;
    }
}
