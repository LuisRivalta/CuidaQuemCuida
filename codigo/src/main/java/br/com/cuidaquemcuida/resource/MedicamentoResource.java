package br.com.cuidaquemcuida.resource;

import br.com.cuidaquemcuida.resource.Dtos.MedicamentoDto;
import br.com.cuidaquemcuida.service.MedicacaoService;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

/** Editar e excluir um remédio. */
@Path("medicamentos")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class MedicamentoResource extends RecursoBase {

    @PUT
    @Path("{id}")
    public MedicamentoDto atualizar(@PathParam("id") long id, MedicamentoDto dados) {
        return MedicacaoService.atualizar(eu(), id, corpo(dados));
    }

    @DELETE
    @Path("{id}")
    public void apagar(@PathParam("id") long id) {
        MedicacaoService.apagar(eu(), id);
    }
}
