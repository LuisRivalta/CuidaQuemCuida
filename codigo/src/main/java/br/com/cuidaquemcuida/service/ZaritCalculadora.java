package br.com.cuidaquemcuida.service;

import br.com.cuidaquemcuida.model.FaixaZarit;

/** Pontuação e faixa da Escala Zarit, versão de 12 itens (ZBI-12). */
public final class ZaritCalculadora {

    private ZaritCalculadora() {
    }

    /** Soma das 12 respostas (cada uma de 0 = nunca a 4 = sempre). Total de 0 a 48. */
    public static int pontuar(int[] respostas) {
        if (respostas == null || respostas.length != Limites.ZARIT_ITENS) {
            throw new IllegalArgumentException("São 12 respostas, cada uma de 0 a 4");
        }
        int soma = 0;
        for (int r : respostas) {
            if (r < 0 || r > 4) {
                throw new IllegalArgumentException("São 12 respostas, cada uma de 0 a 4");
            }
            soma += r;
        }
        return soma;
    }

    /** BAIXA até 10, MODERADA de 11 a 20, ALTA acima de 20 (formulário ZBI-12). */
    public static FaixaZarit faixa(int pontuacao) {
        if (pontuacao < 0 || pontuacao > 4 * Limites.ZARIT_ITENS) {
            throw new IllegalArgumentException("Pontuação fora de 0 a 48");
        }
        if (pontuacao > Limites.ZARIT_ALTA_ACIMA_DE) {
            return FaixaZarit.ALTA;
        }
        if (pontuacao > Limites.ZARIT_MODERADA_ACIMA_DE) {
            return FaixaZarit.MODERADA;
        }
        return FaixaZarit.BAIXA;
    }
}
