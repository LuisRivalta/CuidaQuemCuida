package br.com.cuidaquemcuida.resource;

import br.com.cuidaquemcuida.infra.LogSql;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import java.util.List;

/** GET /api/demo/sql: os últimos comandos SQL, para a tela "Banco ao vivo" (exige login). */
@Path("demo")
@Produces(MediaType.APPLICATION_JSON)
public class DemoResource extends RecursoBase {

    @GET
    @Path("sql")
    public List<LogSql.EntradaSql> sql() {
        eu();   // só quem está logado
        return LogSql.ultimos();
    }
}
