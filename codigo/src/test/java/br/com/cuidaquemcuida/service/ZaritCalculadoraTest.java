package br.com.cuidaquemcuida.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import br.com.cuidaquemcuida.model.FaixaZarit;
import java.util.Arrays;
import org.junit.jupiter.api.Test;

class ZaritCalculadoraTest {

    private static int[] doze(int valor) {
        int[] respostas = new int[12];
        Arrays.fill(respostas, valor);
        return respostas;
    }

    @Test
    void dozeRespostasDoisSomamVinteEQuatroEFaixaAlta() {
        assertEquals(24, ZaritCalculadora.pontuar(doze(2)));
        assertEquals(FaixaZarit.ALTA, ZaritCalculadora.faixa(24));
    }

    @Test
    void dozeRespostasZeroSomamZeroEFaixaBaixa() {
        assertEquals(0, ZaritCalculadora.pontuar(doze(0)));
        assertEquals(FaixaZarit.BAIXA, ZaritCalculadora.faixa(0));
    }

    @Test
    void limitesDasFaixas() {
        assertEquals(FaixaZarit.BAIXA, ZaritCalculadora.faixa(10));
        assertEquals(FaixaZarit.MODERADA, ZaritCalculadora.faixa(11));
        assertEquals(FaixaZarit.MODERADA, ZaritCalculadora.faixa(20));
        assertEquals(FaixaZarit.ALTA, ZaritCalculadora.faixa(21));
    }

    @Test
    void respostasInvalidasSaoRecusadas() {
        assertThrows(IllegalArgumentException.class, () -> ZaritCalculadora.pontuar(new int[11]));
        int[] comCinco = doze(1);
        comCinco[3] = 5;
        assertThrows(IllegalArgumentException.class, () -> ZaritCalculadora.pontuar(comCinco));
        assertThrows(IllegalArgumentException.class, () -> ZaritCalculadora.pontuar(null));
    }
}
