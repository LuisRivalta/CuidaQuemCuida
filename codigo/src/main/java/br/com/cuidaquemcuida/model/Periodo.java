package br.com.cuidaquemcuida.model;

import java.time.LocalTime;

/** Períodos do dia usados nas estatísticas de adesão. */
public enum Periodo {
    MADRUGADA,
    MANHA,
    TARDE,
    NOITE;

    /** 00:00–05:59 madrugada, 06:00–11:59 manhã, 12:00–17:59 tarde, 18:00–23:59 noite. */
    public static Periodo de(LocalTime hora) {
        int h = hora.getHour();
        if (h < 6) {
            return MADRUGADA;
        }
        if (h < 12) {
            return MANHA;
        }
        if (h < 18) {
            return TARDE;
        }
        return NOITE;
    }
}
