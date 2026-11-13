package br.com.cuidaquemcuida.model;

/** Tipos de regra de horário de medicamento (cada um é uma subclasse de {@link RegraHorario}). */
public enum TipoRegra {
    INTERVALO,
    HORARIOS_FIXOS,
    DIAS_ALTERNADOS
}
