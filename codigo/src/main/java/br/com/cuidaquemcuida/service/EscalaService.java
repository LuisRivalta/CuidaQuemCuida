package br.com.cuidaquemcuida.service;

import br.com.cuidaquemcuida.dao.AuditoriaDao;
import br.com.cuidaquemcuida.dao.MembroRedeDao;
import br.com.cuidaquemcuida.dao.PessoaDao;
import br.com.cuidaquemcuida.dao.TurnoDao;
import br.com.cuidaquemcuida.infra.ApiException;
import br.com.cuidaquemcuida.infra.Autorizacao;
import br.com.cuidaquemcuida.model.Cuidador;
import br.com.cuidaquemcuida.model.MembroRede;
import br.com.cuidaquemcuida.model.Paciente;
import br.com.cuidaquemcuida.model.Papel;
import br.com.cuidaquemcuida.model.StatusTurno;
import br.com.cuidaquemcuida.model.Turno;
import br.com.cuidaquemcuida.resource.Dtos.AnaliseDto;
import br.com.cuidaquemcuida.resource.Dtos.ConflitoDto;
import br.com.cuidaquemcuida.resource.Dtos.IntervaloDto;
import br.com.cuidaquemcuida.resource.Dtos.SobrecargaDto;
import br.com.cuidaquemcuida.resource.Dtos.SugestaoDto;
import br.com.cuidaquemcuida.resource.Dtos.TurnoDto;
import br.com.cuidaquemcuida.resource.Dtos.TurnoEntrada;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/** Escala de revezamento: listar, criar, editar e assumir turnos, análise de conflitos, vagos e sobrecarga. */
public final class EscalaService {

    /** Carga de uma pessoa: horas nos últimos 7 dias, maior sequência sem folga e o nível de sobrecarga. */
    public record Carga(double horas7d, double horasSeguidas, EscalaRegras.NivelSobrecarga nivel) {
    }

    private EscalaService() {
    }

    public static Carga carga(long pessoaId, LocalDateTime agora) {
        List<Turno> turnos = TurnoDao.daPessoa(pessoaId, agora.minusDays(14), agora);
        double horas7d = umaCasa(EscalaRegras.horasNaJanela(turnos, agora, Limites.JANELA_CARGA_DIAS));
        double seguidas = umaCasa(EscalaRegras.horasSeguidas(turnos, agora));
        return new Carga(horas7d, seguidas, EscalaRegras.nivel(horas7d, seguidas));
    }

    static TurnoDto dto(Turno t, Map<Long, String> nomes) {
        String nome = t.getPessoaId() == null ? null : nomes.getOrDefault(t.getPessoaId(), Cuidador.NOME_ANONIMO);
        return new TurnoDto(t.getId(), t.getPessoaId(), nome, t.getInicio(), t.getFim(), t.getStatus(), t.noturno());
    }

    public static List<TurnoDto> listar(long eu, long pacienteId, LocalDate de, LocalDate ate) {
        Autorizacao.exigirMembro(eu, pacienteId);
        Map<Long, String> nomes = PessoaDao.nomesDaRede(pacienteId);
        return TurnoDao.queComecamEntre(pacienteId, de.atStartOfDay(), ate.plusDays(1).atStartOfDay()).stream()
                .map(t -> dto(t, nomes)).toList();
    }

    public static TurnoDto criar(long eu, long pacienteId, TurnoEntrada dados) {
        Papel papel = Autorizacao.exigirMembro(eu, pacienteId);
        if (papel != Papel.COORDENADOR && (dados.pessoaId() == null || dados.pessoaId() != eu)) {
            throw new ApiException(403, "Você só pode marcar turnos para você mesmo(a)");
        }
        exigirMembroAtivo(dados.pessoaId(), pacienteId);
        Turno novo = new Turno(null, pacienteId, dados.pessoaId(), dados.inicio(), dados.fim(), StatusTurno.PLANEJADO);
        exigirSemConflito(novo, null);
        novo.setId(TurnoDao.inserir(novo));
        AuditoriaDao.registrar(eu, AuditoriaDao.INSERIR, "turno", novo.getId(), null);
        return dto(novo, PessoaDao.nomesDaRede(pacienteId));
    }

    public static TurnoDto atualizar(long eu, long turnoId, TurnoEntrada dados) {
        Turno atual = turno(turnoId);
        Autorizacao.exigirCoordenador(eu, atual.getPacienteId());
        exigirMembroAtivo(dados.pessoaId(), atual.getPacienteId());
        Turno alterado = new Turno(turnoId, atual.getPacienteId(), dados.pessoaId(), dados.inicio(), dados.fim(),
                dados.status() == null ? atual.getStatus() : dados.status());
        exigirSemConflito(alterado, turnoId);
        TurnoDao.atualizar(alterado);
        AuditoriaDao.registrar(eu, AuditoriaDao.ALTERAR, "turno", turnoId, null);
        return dto(alterado, PessoaDao.nomesDaRede(atual.getPacienteId()));
    }

    public static void apagar(long eu, long turnoId) {
        Turno atual = turno(turnoId);
        Autorizacao.exigirCoordenador(eu, atual.getPacienteId());
        TurnoDao.apagar(turnoId);
        AuditoriaDao.registrar(eu, AuditoriaDao.EXCLUIR, "turno", turnoId, null);
    }

    public static TurnoDto assumir(long eu, long turnoId) {
        Turno atual = turno(turnoId);
        Autorizacao.exigirMembro(eu, atual.getPacienteId());
        if (!atual.vago()) {
            throw ApiException.conflito("Este turno já tem responsável");
        }
        Turno meu = new Turno(turnoId, atual.getPacienteId(), eu, atual.getInicio(), atual.getFim(), atual.getStatus());
        exigirSemConflito(meu, turnoId);
        if (TurnoDao.assumir(turnoId, eu) == 0) {
            throw ApiException.conflito("Este turno já tem responsável");
        }
        AuditoriaDao.registrar(eu, AuditoriaDao.ALTERAR, "turno", turnoId, "assumiu turno vago");
        return dto(meu, PessoaDao.nomesDaRede(atual.getPacienteId()));
    }

    public static List<SugestaoDto> sugestoes(long eu, long turnoId) {
        Turno vago = turno(turnoId);
        Autorizacao.exigirMembro(eu, vago.getPacienteId());
        LocalDateTime agora = LocalDateTime.now();
        LocalDateTime de = agora.minusDays(Limites.JANELA_CARGA_DIAS).isBefore(vago.getInicio()) ? agora.minusDays(Limites.JANELA_CARGA_DIAS) : vago.getInicio();
        LocalDateTime ate = vago.getFim().isAfter(agora) ? vago.getFim() : agora;
        Map<Long, List<Turno>> turnosPorPessoa = new LinkedHashMap<>();
        for (MembroRede m : MembroRedeDao.doPaciente(vago.getPacienteId())) {
            turnosPorPessoa.put(m.pessoaId(), TurnoDao.daPessoa(m.pessoaId(), de, ate));
        }
        Map<Long, String> nomes = PessoaDao.nomesDaRede(vago.getPacienteId());
        return EscalaRegras.sugerirCobertura(vago, turnosPorPessoa, agora).stream()
                .map(id -> new SugestaoDto(id, nomes.get(id),
                        umaCasa(EscalaRegras.horasNaJanela(turnosPorPessoa.get(id), agora, Limites.JANELA_CARGA_DIAS))))
                .toList();
    }

    public static AnaliseDto analise(long eu, long pacienteId, LocalDate deData, LocalDate ateData) {
        Autorizacao.exigirMembro(eu, pacienteId);
        Paciente paciente = RedeService.paciente(pacienteId);
        LocalDateTime de = deData.atStartOfDay();
        LocalDateTime ate = ateData.plusDays(1).atStartOfDay();
        LocalDateTime agora = LocalDateTime.now();
        Map<Long, String> nomes = PessoaDao.nomesDaRede(pacienteId);
        List<MembroRede> membros = MembroRedeDao.doPaciente(pacienteId);

        List<ConflitoDto> conflitos = new ArrayList<>();
        List<SobrecargaDto> sobrecarga = new ArrayList<>();
        for (MembroRede m : membros) {
            for (EscalaRegras.Conflito c : EscalaRegras.conflitos(TurnoDao.daPessoa(m.pessoaId(), de, ate))) {
                conflitos.add(new ConflitoDto(dto(c.a(), nomes), dto(c.b(), nomes)));
            }
            Carga carga = carga(m.pessoaId(), agora);
            sobrecarga.add(new SobrecargaDto(m.pessoaId(), nomes.get(m.pessoaId()), carga.horas7d(), carga.horasSeguidas(), carga.nivel()));
        }
        List<IntervaloDto> vagos = !paciente.isPrecisa24h() ? List.of()
                : EscalaRegras.periodosDescobertos(TurnoDao.doPaciente(pacienteId, de, ate), de, ate).stream()
                .map(v -> new IntervaloDto(v.inicio(), v.fim())).toList();
        return new AnaliseDto(conflitos, vagos, sobrecarga);
    }

    /** Recusa com 409 (e a lista de conflitos) se a pessoa do turno já tem outro turno no mesmo horário, em qualquer rede. */
    static void exigirSemConflito(Turno candidato, Long ignorarId) {
        if (candidato.getPessoaId() == null) {
            return;
        }
        List<Turno> turnos = new ArrayList<>(TurnoDao.daPessoa(candidato.getPessoaId(),
                candidato.getInicio().minusDays(1), candidato.getFim().plusDays(1)));
        turnos.removeIf(t -> ignorarId != null && ignorarId.equals(t.getId()));
        turnos.add(candidato);
        List<Map<String, Object>> conflitos = new ArrayList<>();
        for (EscalaRegras.Conflito c : EscalaRegras.conflitos(turnos)) {
            Turno outro = c.a() == candidato ? c.b() : (c.b() == candidato ? c.a() : null);
            if (outro != null) {
                conflitos.add(Map.of("id", outro.getId(), "inicio", outro.getInicio(), "fim", outro.getFim()));
            }
        }
        if (!conflitos.isEmpty()) {
            String nome = PessoaDao.porId(candidato.getPessoaId()).map(Cuidador::getNome).orElse("Essa pessoa");
            throw new ApiException(409, nome + " já tem turno nesse horário", Map.of("conflitos", conflitos));
        }
    }

    private static void exigirMembroAtivo(Long pessoaId, long pacienteId) {
        if (pessoaId != null && MembroRedeDao.buscar(pessoaId, pacienteId).filter(MembroRede::ativo).isEmpty()) {
            throw ApiException.invalido("Essa pessoa não faz parte da rede");
        }
    }

    private static Turno turno(long turnoId) {
        return TurnoDao.porId(turnoId).orElseThrow(() -> ApiException.naoEncontrado("Turno não encontrado"));
    }

    static double umaCasa(double valor) {
        return Math.round(valor * 10) / 10.0;
    }
}
