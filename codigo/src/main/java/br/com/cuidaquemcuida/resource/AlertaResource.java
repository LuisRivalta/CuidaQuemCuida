package br.com.cuidaquemcuida.resource;

import br.com.cuidaquemcuida.infra.ApiException;
import br.com.cuidaquemcuida.resource.Dtos.AlertaDto;
import br.com.cuidaquemcuida.service.AlertaService;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import java.time.LocalDateTime;
import java.util.List;

/** Alertas da pessoa logada (calculados na hora). */
@Path("alertas")
@Produces(MediaType.APPLICATION_JSON)
public class AlertaResource extends RecursoBase {

    @GET
    public List<AlertaDto> listar(@QueryParam("pacienteId") Long pacienteId) {
        if (pacienteId == null) {
            throw ApiException.invalido("Informe o pacienteId");
        }
        return AlertaService.gerar(eu(), pacienteId, LocalDateTime.now());
    }

    @PUT
    @Path("{id}/lido")
    public void marcarLido(@PathParam("id") long id) {
        AlertaService.marcarLido(eu(), id);
    }
}
