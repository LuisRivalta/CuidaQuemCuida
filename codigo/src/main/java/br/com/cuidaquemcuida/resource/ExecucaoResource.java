package br.com.cuidaquemcuida.resource;

import br.com.cuidaquemcuida.resource.Dtos.ExecucaoDto;
import br.com.cuidaquemcuida.service.TarefaService;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

/** "Feito" numa tarefa do turno. */
@Path("execucoes")
@Produces(MediaType.APPLICATION_JSON)
public class ExecucaoResource extends RecursoBase {

    @PUT
    @Path("{id}/feita")
    public ExecucaoDto feita(@PathParam("id") long id) {
        return TarefaService.feita(eu(), id);
    }
}
