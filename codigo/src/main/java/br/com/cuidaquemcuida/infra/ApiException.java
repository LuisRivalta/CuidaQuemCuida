package br.com.cuidaquemcuida.infra;

import java.util.Map;

/** Erro com código HTTP e mensagem em português simples, que a tela mostra para a pessoa. */
public class ApiException extends RuntimeException {

    private final int status;
    private final transient Map<String, Object> extra;

    public ApiException(int status, String mensagem) {
        this(status, mensagem, Map.of());
    }

    public ApiException(int status, String mensagem, Map<String, Object> extra) {
        super(mensagem);
        this.status = status;
        this.extra = extra == null ? Map.of() : extra;
    }

    public int getStatus() {
        return status;
    }

    /** Campos a mais na resposta de erro (ex.: a lista de conflitos no 409 da escala). */
    public Map<String, Object> getExtra() {
        return extra;
    }

    public static ApiException naoEncontrado(String mensagem) {
        return new ApiException(404, mensagem);
    }

    public static ApiException conflito(String mensagem) {
        return new ApiException(409, mensagem);
    }

    public static ApiException invalido(String mensagem) {
        return new ApiException(400, mensagem);
    }
}
