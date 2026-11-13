package br.com.cuidaquemcuida.service;

/**
 * Limites das regras de negócio num só lugar, para ajuste fácil.
 * Origem de cada valor: documentacao/03-especificacoes-tecnicas/Regras de Negócio.md
 */
public final class Limites {

    private Limites() {
    }

    /** Folga = pelo menos 11 h sem turno (referência: descanso entre jornadas da CLT, art. 66). */
    public static final int FOLGA_MIN_HORAS = 11;

    public static final double ATENCAO_HORAS_SEMANA = 44;
    public static final double ALERTA_HORAS_SEMANA = 60;
    public static final double ATENCAO_HORAS_SEGUIDAS = 24;
    public static final double ALERTA_HORAS_SEGUIDAS = 36;
    public static final int JANELA_CARGA_DIAS = 7;

    /** Dose dada mais de 30 min depois do previsto = atrasada. */
    public static final int DOSE_ATRASO_MIN = 30;
    /** Sem registro 2 h depois do previsto = não dada. */
    public static final int DOSE_NAO_DADA_MIN = 120;
    /** Aviso de dose próxima: 30 min antes. */
    public static final int DOSE_PROXIMA_MIN = 30;

    /** Valor fora da curva: |z| maior que 2, com pelo menos 7 medições anteriores. */
    public static final double ZSCORE_LIMITE = 2.0;
    public static final int ZSCORE_MIN_MEDICOES = 7;

    /** Zarit sugerida a cada 14 dias. Faixas da ZBI-12 (0 a 48). */
    public static final int ZARIT_DIAS = 14;
    public static final int ZARIT_MODERADA_ACIMA_DE = 10;
    public static final int ZARIT_ALTA_ACIMA_DE = 20;
    public static final int ZARIT_ITENS = 12;

    /** Sessão de login vale 7 dias. */
    public static final int SESSAO_DIAS = 7;
}
