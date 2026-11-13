package br.com.cuidaquemcuida.model;

/** Sinais vitais acompanhados. Na pressão, o valor principal é a máxima (sistólica) e o segundo, a mínima. */
public enum TipoSinal {
    PRESSAO("Pressão", "mmHg"),
    GLICEMIA("Glicemia", "mg/dL"),
    TEMPERATURA("Temperatura", "°C"),
    SATURACAO("Saturação", "%"),
    FREQUENCIA_CARDIACA("Batimentos", "bpm");

    private final String nome;
    private final String unidade;

    TipoSinal(String nome, String unidade) {
        this.nome = nome;
        this.unidade = unidade;
    }

    public String nome() {
        return nome;
    }

    public String unidade() {
        return unidade;
    }
}
