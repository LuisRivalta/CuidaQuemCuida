package br.com.cuidaquemcuida.resource;

import br.com.cuidaquemcuida.infra.ApiException;
import br.com.cuidaquemcuida.infra.AuthFilter;
import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.core.Context;
import java.time.LocalDate;
import java.time.format.DateTimeParseException;

/** Base dos recursos da API: quem está logado e leitura segura dos parâmetros. */
public abstract class RecursoBase {

    @Context
    protected ContainerRequestContext requisicao;

    /** Id de quem está logado (colocado pelo {@link AuthFilter}). */
    protected long eu() {
        Object id = requisicao.getProperty(AuthFilter.PESSOA_ID);
        if (id == null) {
            throw new ApiException(401, "Entre na sua conta para continuar");
        }
        return (Long) id;
    }

    /** Corpo obrigatório: sem JSON, responde 400 em vez de quebrar. */
    protected static <T> T corpo(T dados) {
        if (dados == null) {
            throw ApiException.invalido("Envie os dados da requisição");
        }
        return dados;
    }

    /** Data no formato AAAA-MM-DD, ou o padrão se não veio. */
    protected static LocalDate data(String texto, LocalDate padrao) {
        if (texto == null || texto.isBlank()) {
            return padrao;
        }
        try {
            return LocalDate.parse(texto.trim());
        } catch (DateTimeParseException e) {
            throw ApiException.invalido("Data inválida: use o formato AAAA-MM-DD");
        }
    }
}
