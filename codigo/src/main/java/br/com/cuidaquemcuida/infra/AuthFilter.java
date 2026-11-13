package br.com.cuidaquemcuida.infra;

import br.com.cuidaquemcuida.dao.SessaoDao;
import jakarta.annotation.Priority;
import jakarta.ws.rs.Priorities;
import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.container.ContainerRequestFilter;
import jakarta.ws.rs.core.HttpHeaders;
import jakarta.ws.rs.ext.Provider;

/**
 * Antes de cada rota da API, confere o token de login (cabeçalho Authorization: Bearer ...).
 * Só saúde, login e cadastro são públicos. Guarda o id de quem está logado para os recursos.
 */
@Provider
@Priority(Priorities.AUTHENTICATION)
public class AuthFilter implements ContainerRequestFilter {

    public static final String PESSOA_ID = "pessoaId";

    @Override
    public void filter(ContainerRequestContext requisicao) {
        if ("OPTIONS".equals(requisicao.getMethod()) || publica(requisicao.getMethod(), requisicao.getUriInfo().getPath())) {
            return;
        }
        String cabecalho = requisicao.getHeaderString(HttpHeaders.AUTHORIZATION);
        if (cabecalho == null || !cabecalho.startsWith("Bearer ")) {
            throw new ApiException(401, "Entre na sua conta para continuar");
        }
        long pessoaId = SessaoDao.pessoaDoToken(cabecalho.substring("Bearer ".length()).trim())
                .orElseThrow(() -> new ApiException(401, "Sua sessão expirou. Entre de novo."));
        requisicao.setProperty(PESSOA_ID, pessoaId);
    }

    /** Rotas que não exigem login. O caminho vem sem o prefixo /api. */
    static boolean publica(String metodo, String caminho) {
        String rota = caminho.startsWith("/") ? caminho.substring(1) : caminho;
        if (rota.endsWith("/")) {
            rota = rota.substring(0, rota.length() - 1);
        }
        return ("GET".equals(metodo) && rota.equals("saude"))
                || ("POST".equals(metodo) && (rota.equals("auth/login") || rota.equals("pessoas")));
    }
}
