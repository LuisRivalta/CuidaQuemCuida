package br.com.cuidaquemcuida.model;

/** Papel de uma pessoa na rede de cuidado. */
public enum Papel {
    /** Cadastra o paciente, os remédios e as tarefas, monta a escala e vê o painel. */
    COORDENADOR,
    /** Familiar ou vizinho: assume turnos e registra o cuidado. */
    MEMBRO
}
