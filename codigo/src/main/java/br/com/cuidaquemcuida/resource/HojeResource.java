package br.com.cuidaquemcuida.resource;

import br.com.cuidaquemcuida.resource.Dtos.HojeDto;
import br.com.cuidaquemcuida.service.HojeService;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;

/** GET /api/hoje: o que fazer agora (tela principal). */
@Path("hoje")
@Produces(MediaType.APPLICATION_JSON)
public class HojeResource extends RecursoBase {

    @GET
    public HojeDto hoje(@QueryParam("pacienteId") Long pacienteId) {
        return HojeService.hoje(eu(), pacienteId);
    }
}
