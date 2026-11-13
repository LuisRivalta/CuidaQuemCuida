package br.com.cuidaquemcuida.service;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import br.com.cuidaquemcuida.model.FaixaSinal;
import br.com.cuidaquemcuida.model.TipoSinal;
import java.util.List;
import org.junit.jupiter.api.Test;

class SinalVitalRegrasTest {

    private static final List<Double> HISTORICO = List.of(130.0, 128.0, 132.0, 129.0, 131.0, 130.0, 127.0, 133.0);

    @Test
    void comMenosDeSeteMedicoesNuncaEstaForaDaCurva() {
        assertFalse(SinalVitalRegras.foraDaCurva(500, HISTORICO.subList(0, 6)));
    }

    @Test
    void valorMuitoAcimaDoPadraoEstaForaDaCurva() {
        assertTrue(SinalVitalRegras.foraDaCurva(175, HISTORICO));
    }

    @Test
    void valorProximoDaMediaNaoEstaForaDaCurva() {
        assertFalse(SinalVitalRegras.foraDaCurva(131, HISTORICO));
    }

    @Test
    void foraDaFaixaConfigurada() {
        FaixaSinal faixa = new FaixaSinal(1L, TipoSinal.PRESSAO, 90.0, 150.0);
        assertTrue(SinalVitalRegras.foraDaFaixa(160, faixa));
        assertTrue(SinalVitalRegras.foraDaFaixa(85, faixa));
        assertFalse(SinalVitalRegras.foraDaFaixa(150, faixa));
        assertFalse(SinalVitalRegras.foraDaFaixa(160, null));
    }
}
