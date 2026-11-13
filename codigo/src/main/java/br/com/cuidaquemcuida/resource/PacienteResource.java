package br.com.cuidaquemcuida.resource;

import br.com.cuidaquemcuida.model.TipoSinal;
import br.com.cuidaquemcuida.resource.Dtos.AnaliseDto;
import br.com.cuidaquemcuida.resource.Dtos.CompartilharEntrada;
import br.com.cuidaquemcuida.resource.Dtos.CompartilharSaida;
import br.com.cuidaquemcuida.resource.Dtos.ConviteSaida;
import br.com.cuidaquemcuida.resource.Dtos.DoseDto;
import br.com.cuidaquemcuida.resource.Dtos.EntrarEntrada;
import br.com.cuidaquemcuida.resource.Dtos.EntrarSaida;
import br.com.cuidaquemcuida.resource.Dtos.EstatisticasDto;
import br.com.cuidaquemcuida.resource.Dtos.ExecucaoDto;
import br.com.cuidaquemcuida.resource.Dtos.FaixaDto;
import br.com.cuidaquemcuida.resource.Dtos.MedicamentoDto;
import br.com.cuidaquemcuida.resource.Dtos.MembroDto;
import br.com.cuidaquemcuida.resource.Dtos.PacienteDto;
import br.com.cuidaquemcuida.resource.Dtos.PacienteEntrada;
import br.com.cuidaquemcuida.resource.Dtos.PacienteResumo;
import br.com.cuidaquemcuida.resource.Dtos.PapelEntrada;
import br.com.cuidaquemcuida.resource.Dtos.SinalDto;
import br.com.cuidaquemcuida.resource.Dtos.SinalEntrada;
import br.com.cuidaquemcuida.resource.Dtos.TarefaDto;
import br.com.cuidaquemcuida.resource.Dtos.TurnoDto;
import br.com.cuidaquemcuida.resource.Dtos.TurnoEntrada;
import br.com.cuidaquemcuida.infra.ApiException;
import br.com.cuidaquemcuida.service.EscalaService;
import br.com.cuidaquemcuida.service.EstatisticaService;
import br.com.cuidaquemcuida.service.MedicacaoService;
import br.com.cuidaquemcuida.service.RedeService;
import br.com.cuidaquemcuida.service.SinalVitalService;
import br.com.cuidaquemcuida.service.TarefaService;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.DefaultValue;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.time.LocalDate;
import java.util.List;

/**
 * Tudo o que é de um paciente: a rede, a escala, os remédios, os sinais, as tarefas e o painel.
 * Fica numa só classe porque o JAX-RS escolhe um único recurso raiz por caminho ("pacientes").
 * Cada método só lê os parâmetros e chama o serviço; as regras e a autorização estão nos serviços.
 */
@Path("pacientes")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class PacienteResource extends RecursoBase {

    // ------------------------------------------------------------ rede
    @GET
    public List<PacienteResumo> minhasRedes() {
        return RedeService.minhasRedes(eu());
    }

    @POST
    public Response criar(PacienteEntrada dados) {
        return Response.status(201).entity(RedeService.criar(eu(), corpo(dados))).build();
    }

    @POST
    @Path("entrar")
    public EntrarSaida entrar(EntrarEntrada dados) {
        EntrarEntrada d = corpo(dados);
        return RedeService.entrar(eu(), d.codigo(), d.vinculo());
    }

    @GET
    @Path("{id}")
    public PacienteDto buscar(@PathParam("id") long id) {
        return RedeService.buscar(eu(), id);
    }

    @PUT
    @Path("{id}")
    public PacienteDto atualizar(@PathParam("id") long id, PacienteEntrada dados) {
        return RedeService.atualizar(eu(), id, corpo(dados));
    }

    @DELETE
    @Path("{id}")
    public void apagar(@PathParam("id") long id) {
        RedeService.apagar(eu(), id);
    }

    @POST
    @Path("{id}/convite")
    public ConviteSaida renovarConvite(@PathParam("id") long id) {
        return RedeService.renovarConvite(eu(), id);
    }

    @GET
    @Path("{id}/membros")
    public List<MembroDto> membros(@PathParam("id") long id) {
        return RedeService.membros(eu(), id);
    }

    @PUT
    @Path("{id}/membros/{pessoaId}")
    public PapelEntrada mudarPapel(@PathParam("id") long id, @PathParam("pessoaId") long pessoaId, PapelEntrada dados) {
        RedeService.mudarPapel(eu(), id, pessoaId, corpo(dados).papel());
        return dados;
    }

    @DELETE
    @Path("{id}/membros/{pessoaId}")
    public void remover(@PathParam("id") long id, @PathParam("pessoaId") long pessoaId) {
        RedeService.remover(eu(), id, pessoaId);
    }

    @PUT
    @Path("{id}/compartilhar-zarit")
    public CompartilharSaida compartilharZarit(@PathParam("id") long id, CompartilharEntrada dados) {
        return new CompartilharSaida(RedeService.compartilharZarit(eu(), id, Boolean.TRUE.equals(corpo(dados).compartilha())));
    }

    // ------------------------------------------------------------ escala
    @GET
    @Path("{id}/turnos")
    public List<TurnoDto> turnos(@PathParam("id") long id, @QueryParam("de") String de, @QueryParam("ate") String ate) {
        LocalDate hoje = LocalDate.now();
        return EscalaService.listar(eu(), id, data(de, hoje), data(ate, hoje));
    }

    @POST
    @Path("{id}/turnos")
    public Response criarTurno(@PathParam("id") long id, TurnoEntrada dados) {
        return Response.status(201).entity(EscalaService.criar(eu(), id, corpo(dados))).build();
    }

    @GET
    @Path("{id}/escala/analise")
    public AnaliseDto analise(@PathParam("id") long id, @QueryParam("de") String de, @QueryParam("ate") String ate) {
        LocalDate hoje = LocalDate.now();
        return EscalaService.analise(eu(), id, data(de, hoje), data(ate, hoje.plusDays(6)));
    }

    // ------------------------------------------------------------ medicação
    @GET
    @Path("{id}/medicamentos")
    public List<MedicamentoDto> medicamentos(@PathParam("id") long id) {
        return MedicacaoService.listar(eu(), id);
    }

    @POST
    @Path("{id}/medicamentos")
    public Response criarMedicamento(@PathParam("id") long id, MedicamentoDto dados) {
        return Response.status(201).entity(MedicacaoService.criar(eu(), id, corpo(dados))).build();
    }

    @GET
    @Path("{id}/doses")
    public List<DoseDto> doses(@PathParam("id") long id, @QueryParam("data") String dia) {
        return MedicacaoService.doses(eu(), id, data(dia, LocalDate.now()));
    }

    // ------------------------------------------------------------ sinais vitais
    @GET
    @Path("{id}/sinais")
    public List<SinalDto> sinais(@PathParam("id") long id, @QueryParam("tipo") String tipo,
                                 @QueryParam("de") String de, @QueryParam("ate") String ate) {
        LocalDate hoje = LocalDate.now();
        return SinalVitalService.listar(eu(), id, tipoSinal(tipo), data(de, hoje.minusDays(30)), data(ate, hoje));
    }

    @POST
    @Path("{id}/sinais")
    public Response registrarSinal(@PathParam("id") long id, SinalEntrada dados) {
        return Response.status(201).entity(SinalVitalService.registrar(eu(), id, corpo(dados))).build();
    }

    @GET
    @Path("{id}/faixas")
    public List<FaixaDto> faixas(@PathParam("id") long id) {
        return SinalVitalService.faixas(eu(), id);
    }

    @PUT
    @Path("{id}/faixas")
    public List<FaixaDto> salvarFaixas(@PathParam("id") long id, List<FaixaDto> faixas) {
        return SinalVitalService.salvarFaixas(eu(), id, corpo(faixas));
    }

    // ------------------------------------------------------------ tarefas de cuidado
    @GET
    @Path("{id}/tarefas")
    public List<TarefaDto> tarefas(@PathParam("id") long id) {
        return TarefaService.listar(eu(), id);
    }

    @POST
    @Path("{id}/tarefas")
    public Response criarTarefa(@PathParam("id") long id, TarefaDto dados) {
        return Response.status(201).entity(TarefaService.criar(eu(), id, corpo(dados))).build();
    }

    @GET
    @Path("{id}/execucoes")
    public List<ExecucaoDto> execucoes(@PathParam("id") long id, @QueryParam("data") String dia) {
        return TarefaService.execucoes(eu(), id, data(dia, LocalDate.now()));
    }

    // ------------------------------------------------------------ painel
    @GET
    @Path("{id}/estatisticas")
    public EstatisticasDto estatisticas(@PathParam("id") long id, @QueryParam("dias") @DefaultValue("30") int dias) {
        return EstatisticaService.calcular(eu(), id, dias);
    }

    private static TipoSinal tipoSinal(String texto) {
        if (texto == null || texto.isBlank()) {
            return null;
        }
        try {
            return TipoSinal.valueOf(texto.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw ApiException.invalido("Tipo de medição inválido");
        }
    }
}
