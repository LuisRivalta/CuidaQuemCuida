package br.com.cuidaquemcuida.resource;

import br.com.cuidaquemcuida.resource.Dtos.SugestaoDto;
import br.com.cuidaquemcuida.resource.Dtos.TurnoDto;
import br.com.cuidaquemcuida.resource.Dtos.TurnoEntrada;
import br.com.cuidaquemcuida.service.EscalaService;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import java.util.List;

/** Ações sobre um turno pelo próprio id. */
@Path("turnos")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class TurnoResource extends RecursoBase {

    @PUT
    @Path("{id}")
    public TurnoDto atualizar(@PathParam("id") long id, TurnoEntrada dados) {
        return EscalaService.atualizar(eu(), id, corpo(dados));
    }

    @DELETE
    @Path("{id}")
    public void apagar(@PathParam("id") long id) {
        EscalaService.apagar(eu(), id);
    }

    @POST
    @Path("{id}/assumir")
    public TurnoDto assumir(@PathParam("id") long id) {
        return EscalaService.assumir(eu(), id);
    }

    @GET
    @Path("{id}/sugestoes")
    public List<SugestaoDto> sugestoes(@PathParam("id") long id) {
        return EscalaService.sugestoes(eu(), id);
    }
}
