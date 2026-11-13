package br.com.cuidaquemcuida.service;

import br.com.cuidaquemcuida.model.StatusDose;
import java.time.Duration;
import java.time.LocalDateTime;

/** Regras do status de uma dose. */
public final class DoseRegras {

    private DoseRegras() {
    }

    /**
     * Marcada como não dada -> NAO_DADA. Dada até 30 min depois do previsto -> DADA; depois disso -> ATRASADA.
     * Sem registro e passaram mais de 2 h -> NAO_DADA. Senão -> PENDENTE.
     */
    public static StatusDose status(LocalDateTime previsto, LocalDateTime dadaEm, boolean marcadaNaoDada, LocalDateTime agora) {
        if (marcadaNaoDada) {
            return StatusDose.NAO_DADA;
        }
        if (dadaEm != null) {
            return Duration.between(previsto, dadaEm).toMinutes() > Limites.DOSE_ATRASO_MIN ? StatusDose.ATRASADA : StatusDose.DADA;
        }
        if (Duration.between(previsto, agora).toMinutes() > Limites.DOSE_NAO_DADA_MIN) {
            return StatusDose.NAO_DADA;
        }
        return StatusDose.PENDENTE;
    }

    /** Só dá para registrar (dada ou não dada) uma dose que ainda está pendente. Impede sobrescrever o registro de outra pessoa. */
    public static boolean podeRegistrar(StatusDose atual) {
        return atual == StatusDose.PENDENTE;
    }
}
