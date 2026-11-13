package br.com.cuidaquemcuida.infra;

import com.fasterxml.jackson.core.JsonProcessingException;
import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;
import java.util.LinkedHashMap;
import java.util.Map;

/** Todo erro sai no formato do contrato: {"erro": "mensagem em português"} com o código HTTP certo. */
@Provider
public class ErroMapper implements ExceptionMapper<Throwable> {

    @Override
    public Response toResponse(Throwable erro) {
        if (erro instanceof ApiException api) {
            return resposta(api.getStatus(), api.getMessage(), api.getExtra());
        }
        if (erro instanceof IllegalArgumentException || erro instanceof JsonProcessingException) {
            String mensagem = erro instanceof JsonProcessingException ? "Os dados enviados estão em formato inválido" : erro.getMessage();
            return resposta(400, mensagem, Map.of());
        }
        if (erro instanceof WebApplicationException web) {
            int status = web.getResponse().getStatus();
            String mensagem = switch (status) {
                case 404 -> "Rota não encontrada";
                case 405 -> "Operação não permitida nesta rota";
                case 415 -> "Envie os dados em JSON";
                default -> "Requisição inválida";
            };
            return resposta(status, mensagem, Map.of());
        }
        System.err.println("Erro interno: " + erro);
        erro.printStackTrace();
        return resposta(500, "Erro interno. Tente de novo.", Map.of());
    }

    private static Response resposta(int status, String mensagem, Map<String, Object> extra) {
        Map<String, Object> corpo = new LinkedHashMap<>();
        corpo.put("erro", mensagem);
        corpo.putAll(extra);
        return Response.status(status).type(MediaType.APPLICATION_JSON).entity(corpo).build();
    }
}
