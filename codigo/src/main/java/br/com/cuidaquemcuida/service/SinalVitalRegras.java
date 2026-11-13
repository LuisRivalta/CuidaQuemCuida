package br.com.cuidaquemcuida.service;

import br.com.cuidaquemcuida.model.FaixaSinal;
import java.util.List;

/** Regras de alerta dos sinais vitais. */
public final class SinalVitalRegras {

    private SinalVitalRegras() {
    }

    /** Fora do mínimo ou do máximo configurado para o paciente. Sem faixa configurada, nunca. */
    public static boolean foraDaFaixa(double valor, FaixaSinal faixa) {
        if (faixa == null) {
            return false;
        }
        return (faixa.minimo() != null && valor < faixa.minimo()) || (faixa.maximo() != null && valor > faixa.maximo());
    }

    /** "Fora da curva" (Fase 5): |z| > 2 em relação às medições anteriores do mesmo paciente, com pelo menos 7 delas. */
    public static boolean foraDaCurva(double valor, List<Double> historico) {
        if (historico == null || historico.size() < Limites.ZSCORE_MIN_MEDICOES) {
            return false;
        }
        double z = Estatistica.zScore(valor, historico);
        return !Double.isNaN(z) && Math.abs(z) > Limites.ZSCORE_LIMITE;
    }
}
