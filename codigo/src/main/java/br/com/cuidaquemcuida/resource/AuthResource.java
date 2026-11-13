package br.com.cuidaquemcuida.resource;

import br.com.cuidaquemcuida.resource.Dtos.LoginEntrada;
import br.com.cuidaquemcuida.resource.Dtos.LoginSaida;
import br.com.cuidaquemcuida.service.ContaService;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.HttpHeaders;
import jakarta.ws.rs.core.MediaType;

/** Login e logout. */
@Path("auth")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class AuthResource extends RecursoBase {

    /** POST /api/auth/login (público) */
    @POST
    @Path("login")
    public LoginSaida login(LoginEntrada dados) {
        LoginEntrada d = corpo(dados);
        return ContaService.login(d.email(), d.senha());
    }

    /** POST /api/auth/logout */
    @POST
    @Path("logout")
    public void logout() {
        String cabecalho = requisicao.getHeaderString(HttpHeaders.AUTHORIZATION);
        ContaService.logout(cabecalho.substring("Bearer ".length()).trim());
    }
}
