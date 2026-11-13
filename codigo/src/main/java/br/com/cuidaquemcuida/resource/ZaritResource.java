package br.com.cuidaquemcuida.resource;

import br.com.cuidaquemcuida.resource.Dtos.MinhasZarit;
import br.com.cuidaquemcuida.resource.Dtos.PedirAjudaEntrada;
import br.com.cuidaquemcuida.resource.Dtos.PedirAjudaSaida;
import br.com.cuidaquemcuida.resource.Dtos.ZaritEntrada;
import br.com.cuidaquemcuida.service.ZaritService;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

/** Bem-estar: Escala Zarit e pedido de ajuda. Só a própria pessoa vê as suas avaliações. */
@Path("zarit")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class ZaritResource extends RecursoBase {

    @POST
    public Response responder(ZaritEntrada dados) {
        return Response.status(201).entity(ZaritService.responder(eu(), corpo(dados))).build();
    }

    @GET
    @Path("minhas")
    public MinhasZarit minhas() {
        return ZaritService.minhas(eu());
    }

    @DELETE
    @Path("{id}")
    public void apagar(@PathParam("id") long id) {
        ZaritService.apagar(eu(), id);
    }

    @POST
    @Path("{id}/pedir-ajuda")
    public PedirAjudaSaida pedirAjuda(@PathParam("id") long id, PedirAjudaEntrada dados) {
        return ZaritService.pedirAjuda(eu(), id, corpo(dados).pacienteIds());
    }
}
