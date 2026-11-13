package br.com.cuidaquemcuida.resource;

import br.com.cuidaquemcuida.resource.Dtos.CadastroEntrada;
import br.com.cuidaquemcuida.resource.Dtos.PessoaDto;
import br.com.cuidaquemcuida.service.ContaService;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

/** Cadastro, meus dados e exclusão de conta. */
@Path("pessoas")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class PessoaResource extends RecursoBase {

    /** POST /api/pessoas (público) */
    @POST
    public Response cadastrar(CadastroEntrada dados) {
        return Response.status(201).entity(ContaService.cadastrar(corpo(dados))).build();
    }

    /** GET /api/pessoas/eu */
    @GET
    @Path("eu")
    public PessoaDto meusDados() {
        return ContaService.meusDados(eu());
    }

    /** DELETE /api/pessoas/eu */
    @DELETE
    @Path("eu")
    public void excluir() {
        ContaService.excluir(eu());
    }
}
