package br.com.cuidaquemcuida.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

/**
 * Medidas estatísticas do painel (Fase 1: média e moda; Fase 2: dispersão e chance; Fase 5: fora da curva).
 * Sem dados suficientes, devolve {@code Double.NaN}: quem chama transforma em "Dados insuficientes".
 */
public final class Estatistica {

    private Estatistica() {
    }

    public static double media(List<Double> valores) {
        if (valores == null || valores.isEmpty()) {
            return Double.NaN;
        }
        double soma = 0;
        for (double v : valores) {
            soma += v;
        }
        return soma / valores.size();
    }

    public static double mediana(List<Double> valores) {
        if (valores == null || valores.isEmpty()) {
            return Double.NaN;
        }
        List<Double> ordenados = new ArrayList<>(valores);
        ordenados.sort(null);
        int meio = ordenados.size() / 2;
        return ordenados.size() % 2 == 1 ? ordenados.get(meio) : (ordenados.get(meio - 1) + ordenados.get(meio)) / 2.0;
    }

    /** Valor mais frequente. No empate, o menor deles. */
    public static double moda(List<Double> valores) {
        if (valores == null || valores.isEmpty()) {
            return Double.NaN;
        }
        Map<Double, Integer> contagem = new TreeMap<>();
        for (double v : valores) {
            contagem.merge(v, 1, Integer::sum);
        }
        double moda = Double.NaN;
        int maior = 0;
        for (Map.Entry<Double, Integer> e : contagem.entrySet()) {   // TreeMap: do menor para o maior
            if (e.getValue() > maior) {
                maior = e.getValue();
                moda = e.getKey();
            }
        }
        return moda;
    }

    /** Desvio padrão populacional (a rede inteira é a população, não uma amostra). */
    public static double desvioPadrao(List<Double> valores) {
        double media = media(valores);
        if (Double.isNaN(media)) {
            return Double.NaN;
        }
        double soma = 0;
        for (double v : valores) {
            soma += (v - media) * (v - media);
        }
        return Math.sqrt(soma / valores.size());
    }

    /** Desvio padrão ÷ média: 0 = carga igual entre todos; quanto maior, mais desigual. */
    public static double coeficienteVariacao(List<Double> valores) {
        double media = media(valores);
        if (Double.isNaN(media) || media == 0) {
            return Double.NaN;
        }
        return desvioPadrao(valores) / media;
    }

    /** Para cada posição, a média dos até {@code janela} últimos valores (inclusive o atual). */
    public static List<Double> mediaMovel(List<Double> serie, int janela) {
        if (janela < 1) {
            throw new IllegalArgumentException("A janela precisa ser de pelo menos 1");
        }
        List<Double> resultado = new ArrayList<>();
        double soma = 0;
        for (int i = 0; i < serie.size(); i++) {
            soma += serie.get(i);
            if (i >= janela) {
                soma -= serie.get(i - janela);
            }
            resultado.add(soma / Math.min(i + 1, janela));
        }
        return resultado;
    }

    /** Correlação de Pearson, de -1 a 1. Menos de 2 pontos ou variância zero: NaN. */
    public static double pearson(double[] x, double[] y) {
        if (x.length != y.length) {
            throw new IllegalArgumentException("As duas séries precisam ter o mesmo tamanho");
        }
        int n = x.length;
        if (n < 2) {
            return Double.NaN;
        }
        double mediaX = 0;
        double mediaY = 0;
        for (int i = 0; i < n; i++) {
            mediaX += x[i];
            mediaY += y[i];
        }
        mediaX /= n;
        mediaY /= n;
        double cov = 0;
        double varX = 0;
        double varY = 0;
        for (int i = 0; i < n; i++) {
            double dx = x[i] - mediaX;
            double dy = y[i] - mediaY;
            cov += dx * dy;
            varX += dx * dx;
            varY += dy * dy;
        }
        if (varX == 0 || varY == 0) {
            return Double.NaN;
        }
        return cov / Math.sqrt(varX * varY);
    }

    /** Quantos desvios padrão o valor está longe da média do histórico. */
    public static double zScore(double valor, List<Double> historico) {
        double desvio = desvioPadrao(historico);
        if (Double.isNaN(desvio) || desvio == 0) {
            return Double.NaN;
        }
        return (valor - media(historico)) / desvio;
    }
}
