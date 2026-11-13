package br.com.cuidaquemcuida.model;

/** O que aconteceu com uma dose prevista. Regras em {@code service.DoseRegras}. */
public enum StatusDose {
    /** Ainda não registrada. */
    PENDENTE,
    /** Dada até 30 minutos depois do horário. */
    DADA,
    /** Dada mais de 30 minutos depois do horário. */
    ATRASADA,
    /** Marcada como não dada, ou sem registro 2 horas depois do horário. */
    NAO_DADA
}
