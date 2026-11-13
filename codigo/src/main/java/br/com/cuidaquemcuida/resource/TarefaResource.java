package br.com.cuidaquemcuida.resource;

import br.com.cuidaquemcuida.resource.Dtos.TarefaDto;
import br.com.cuidaquemcuida.service.TarefaService;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

/** Editar e excluir uma tarefa de cuidado. */
@Path("tarefas")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class TarefaResource extends RecursoBase {

    @PUT
    @Path("{id}")
    public TarefaDto atualizar(@PathParam("id") long id, TarefaDto dados) {
        return TarefaService.atualizar(eu(), id, corpo(dados));
    }

    @DELETE
    @Path("{id}")
    public void apagar(@PathParam("id") long id) {
        TarefaService.apagar(eu(), id);
    }
}
