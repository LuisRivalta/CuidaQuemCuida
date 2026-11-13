package br.com.cuidaquemcuida.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.List;
import org.junit.jupiter.api.Test;

class EstatisticaTest {

    private static final double TOLERANCIA = 1e-9;

    @Test
    void mediaEDesvioPadraoPopulacional() {
        List<Double> valores = List.of(2.0, 4.0, 4.0, 4.0, 5.0, 5.0, 7.0, 9.0);
        assertEquals(5.0, Estatistica.media(valores), TOLERANCIA);
        assertEquals(2.0, Estatistica.desvioPadrao(valores), TOLERANCIA);
    }

    @Test
    void medianaComQuantidadeImparEPar() {
        assertEquals(2.0, Estatistica.mediana(List.of(3.0, 1.0, 2.0)), TOLERANCIA);
        assertEquals(2.5, Estatistica.mediana(List.of(1.0, 2.0, 3.0, 4.0)), TOLERANCIA);
    }

    @Test
    void modaEhOMaisFrequenteENoEmpateOMenor() {
        assertEquals(2.0, Estatistica.moda(List.of(1.0, 2.0, 2.0, 3.0)), TOLERANCIA);
        assertEquals(1.0, Estatistica.moda(List.of(1.0, 1.0, 2.0, 2.0)), TOLERANCIA);
    }

    @Test
    void mediaMovelUsaOsUltimosValoresDisponiveis() {
        assertEquals(List.of(1.0, 1.5, 2.0, 3.0, 4.0), Estatistica.mediaMovel(List.of(1.0, 2.0, 3.0, 4.0, 5.0), 3));
    }

    @Test
    void pearsonPerfeitoPositivoENegativo() {
        double[] x = {1, 2, 3, 4, 5};
        assertEquals(1.0, Estatistica.pearson(x, new double[] {2, 4, 6, 8, 10}), TOLERANCIA);
        assertEquals(-1.0, Estatistica.pearson(x, new double[] {10, 8, 6, 4, 2}), TOLERANCIA);
    }

    @Test
    void semDadosSuficientesDevolveNaN() {
        assertTrue(Double.isNaN(Estatistica.pearson(new double[] {1}, new double[] {2})));
        assertTrue(Double.isNaN(Estatistica.pearson(new double[] {3, 3, 3}, new double[] {1, 2, 3})));
        assertTrue(Double.isNaN(Estatistica.media(List.of())));
        assertTrue(Double.isNaN(Estatistica.mediana(List.of())));
        assertTrue(Double.isNaN(Estatistica.moda(List.of())));
        assertTrue(Double.isNaN(Estatistica.desvioPadrao(List.of())));
        assertTrue(Double.isNaN(Estatistica.coeficienteVariacao(List.of(0.0, 0.0))));
    }

    @Test
    void zScorePositivoParaValorAcimaDaMedia() {
        assertTrue(Estatistica.zScore(7, List.of(1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0)) > 0);
    }

    @Test
    void coeficienteDeVariacaoEhDesvioSobreMedia() {
        assertEquals(0.4, Estatistica.coeficienteVariacao(List.of(2.0, 4.0, 4.0, 4.0, 5.0, 5.0, 7.0, 9.0)), TOLERANCIA);
    }
}
