package br.com.cuidaquemcuida.resource;

import br.com.cuidaquemcuida.resource.Dtos.DoseDto;
import br.com.cuidaquemcuida.resource.Dtos.RegistroDoseEntrada;
import br.com.cuidaquemcuida.service.MedicacaoService;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

/** "Dei o remédio" e "Não foi dado". */
@Path("doses")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class DoseResource extends RecursoBase {

    @PUT
    @Path("{id}/dar")
    public DoseDto dar(@PathParam("id") long id, RegistroDoseEntrada dados) {
        return MedicacaoService.dar(eu(), id, dados == null ? null : dados.observacao());
    }

    @PUT
    @Path("{id}/nao-dar")
    public DoseDto naoDar(@PathParam("id") long id, RegistroDoseEntrada dados) {
        return MedicacaoService.naoDar(eu(), id, corpo(dados).motivo());
    }
}
