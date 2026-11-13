package br.com.cuidaquemcuida.model;

/** Faixa de alerta de um sinal vital, configurada por paciente. Mínimo ou máximo podem ficar em branco. */
public record FaixaSinal(long pacienteId, TipoSinal tipo, Double minimo, Double maximo) {

    public FaixaSinal {
        if (minimo != null && maximo != null && minimo > maximo) {
            throw new IllegalArgumentException("O mínimo da faixa não pode ser maior que o máximo");
        }
    }
}
