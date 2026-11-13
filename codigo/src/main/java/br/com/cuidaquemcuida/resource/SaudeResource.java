package br.com.cuidaquemcuida.resource;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import java.util.Map;

/** GET /api/saude: o sistema está no ar? (público) */
@Path("saude")
@Produces(MediaType.APPLICATION_JSON)
public class SaudeResource {

    @GET
    public Map<String, Boolean> saude() {
        return Map.of("ok", true);
    }
}
