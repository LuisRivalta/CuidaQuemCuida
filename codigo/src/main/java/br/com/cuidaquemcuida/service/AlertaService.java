package br.com.cuidaquemcuida.service;

import br.com.cuidaquemcuida.dao.AlertaDao;
import br.com.cuidaquemcuida.dao.MembroRedeDao;
import br.com.cuidaquemcuida.dao.PessoaDao;
import br.com.cuidaquemcuida.dao.TarefaDao;
import br.com.cuidaquemcuida.dao.TurnoDao;
import br.com.cuidaquemcuida.infra.ApiException;
import br.com.cuidaquemcuida.infra.Autorizacao;
import br.com.cuidaquemcuida.model.Dose;
import br.com.cuidaquemcuida.model.ExecucaoTarefa;
import br.com.cuidaquemcuida.model.Medicamento;
import br.com.cuidaquemcuida.model.MembroRede;
import br.com.cuidaquemcuida.model.Paciente;
import br.com.cuidaquemcuida.model.StatusDose;
import br.com.cuidaquemcuida.model.TarefaCuidado;
import br.com.cuidaquemcuida.model.Turno;
import br.com.cuidaquemcuida.model.alerta.Alerta;
import br.com.cuidaquemcuida.model.alerta.AlertaConflito;
import br.com.cuidaquemcuida.model.alerta.AlertaMedicacao;
import br.com.cuidaquemcuida.model.alerta.AlertaSobrecarga;
import br.com.cuidaquemcuida.model.alerta.AlertaTarefa;
import br.com.cuidaquemcuida.model.alerta.AlertaTurnoVago;
import br.com.cuidaquemcuida.model.alerta.TipoAlerta;
import br.com.cuidaquemcuida.resource.Dtos.AlertaDto;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * Alertas calculados na hora em que a tela abre (sem rotina rodando em segundo plano). Cada alerta é gravado
 * com chave única (tipo, referência, destinatário), então reabrir a tela não repete o aviso e o "lido" funciona.
 * Quem recebe cada tipo segue a tabela da seção 4.2 do design.
 */
public final class AlertaService {

    private AlertaService() {
    }

    public static List<AlertaDto> gerar(long eu, long pacienteId, LocalDateTime agora) {
        Autorizacao.exigirMembro(eu, pacienteId);
        Paciente paciente = RedeService.paciente(pacienteId);
        List<MembroRede> membros = MembroRedeDao.doPaciente(pacienteId);
        Set<Long> coordenadores = coordenadores(membros);
        boolean souCoordenador = coordenadores.contains(eu);
        Map<Long, String> nomes = PessoaDao.nomesDaRede(pacienteId);
        LocalDate hoje = agora.toLocalDate();
        LocalDateTime inicioDoDia = hoje.atStartOfDay();
        List<Turno> turnosPaciente = TurnoDao.doPaciente(pacienteId, inicioDoDia.minusDays(1), inicioDoDia.plusDays(8));
        List<Alerta> meus = new ArrayList<>();

        // Turno vago (paciente 24 h): todos da rede
        if (paciente.isPrecisa24h()) {
            for (EscalaRegras.Intervalo v : EscalaRegras.periodosDescobertos(turnosPaciente, inicioDoDia, inicioDoDia.plusDays(8))) {
                if (v.fim().isAfter(agora) && Duration.between(v.inicio(), v.fim()).toMinutes() >= 60) {
                    meus.add(new AlertaTurnoVago(pacienteId, eu, v.inicio(), v.fim()));
                }
            }
        }

        // Doses de hoje: quem está de turno no horário e os coordenadores
        Map<Long, Medicamento> remedios = MedicacaoService.remediosPorId(pacienteId);
        for (Dose d : MedicacaoService.dosesDoDia(pacienteId, hoje, agora)) {
            if (!souCoordenador && !eu(eu, pessoaNoTurno(turnosPaciente, d.getPrevistoPara()))) {
                continue;
            }
            String nome = remedios.containsKey(d.getMedicamentoId()) ? remedios.get(d.getMedicamentoId()).getNome() : "Remédio";
            long minutosDepois = Duration.between(d.getPrevistoPara(), agora).toMinutes();
            if (d.getStatus() == StatusDose.PENDENTE && minutosDepois > Limites.DOSE_ATRASO_MIN) {
                meus.add(new AlertaMedicacao(TipoAlerta.DOSE_ATRASADA, pacienteId, eu, d.getId(), nome, d.getPrevistoPara()));
            } else if (d.getStatus() == StatusDose.PENDENTE && minutosDepois < 0 && -minutosDepois <= Limites.DOSE_PROXIMA_MIN) {
                meus.add(new AlertaMedicacao(TipoAlerta.DOSE_PROXIMA, pacienteId, eu, d.getId(), nome, d.getPrevistoPara()));
            } else if (d.getStatus() == StatusDose.NAO_DADA && d.getDadaPor() == null) {
                meus.add(new AlertaMedicacao(TipoAlerta.DOSE_NAO_DADA, pacienteId, eu, d.getId(), nome, d.getPrevistoPara()));
            }
        }

        // Tarefas atrasadas nas últimas 2 horas: quem está de turno e os coordenadores
        TarefaService.garantirExecucoes(pacienteId, hoje);
        Map<Long, TarefaCuidado> tarefas = TarefaService.tarefasPorId(pacienteId);
        for (ExecucaoTarefa e : TarefaDao.execucoesNoDia(pacienteId, hoje)) {
            long minutosDepois = Duration.between(e.getPrevistaPara(), agora).toMinutes();
            boolean atrasada = !e.feita() && minutosDepois > Limites.DOSE_ATRASO_MIN && minutosDepois <= Limites.DOSE_NAO_DADA_MIN;
            if (atrasada && (souCoordenador || eu(eu, pessoaNoTurno(turnosPaciente, e.getPrevistaPara())))) {
                TarefaCuidado t = tarefas.get(e.getTarefaId());
                meus.add(new AlertaTarefa(pacienteId, eu, e.getId(), t == null ? "Tarefa" : t.getTitulo(), e.getPrevistaPara()));
            }
        }

        // Sobrecarga e conflitos: a própria pessoa e os coordenadores
        for (MembroRede m : membros) {
            if (m.pessoaId() != eu && !souCoordenador) {
                continue;
            }
            String nome = nomes.getOrDefault(m.pessoaId(), "Alguém da rede");
            EscalaService.Carga carga = EscalaService.carga(m.pessoaId(), agora);
            if (carga.nivel() != EscalaRegras.NivelSobrecarga.OK) {
                meus.add(new AlertaSobrecarga(pacienteId, eu, m.pessoaId(), nome, carga.horas7d(), carga.horasSeguidas(), hoje));
            }
            for (EscalaRegras.Conflito c : EscalaRegras.conflitos(TurnoDao.daPessoa(m.pessoaId(), inicioDoDia, inicioDoDia.plusDays(8)))) {
                meus.add(new AlertaConflito(pacienteId, eu, nome, c.a(), c.b()));
            }
        }

        meus.forEach(AlertaDao::gravar);
        AlertaDao.marcarResolvidos(eu, pacienteId, chaves(meus));   // o que deixou de valer some da lista
        return AlertaDao.naoLidos(eu, pacienteId);   // inclui os gravados na hora do fato (sinal vital, pedido de ajuda)
    }

    /** "TIPO|referencia" de cada alerta: a mesma chave única da tabela (sem o destinatário). */
    static List<String> chaves(List<Alerta> alertas) {
        return alertas.stream().map(a -> a.getTipo().name() + "|" + a.getReferencia()).toList();
    }

    public static void marcarLido(long eu, long alertaId) {
        if (AlertaDao.marcarLido(alertaId, eu) == 0) {
            throw ApiException.naoEncontrado("Alerta não encontrado");
        }
    }

    /** Destinatários de um alerta "do momento": quem está de turno agora e os coordenadores. */
    static Set<Long> deTurnoECoordenadores(long pacienteId, LocalDateTime agora) {
        Set<Long> destinatarios = coordenadores(MembroRedeDao.doPaciente(pacienteId));
        Long deTurno = pessoaNoTurno(TurnoDao.doPaciente(pacienteId, agora.minusHours(1), agora.plusHours(1)), agora);
        if (deTurno != null) {
            destinatarios.add(deTurno);
        }
        return destinatarios;
    }

    static Long pessoaNoTurno(List<Turno> turnos, LocalDateTime instante) {
        for (Turno t : turnos) {
            if (!t.vago() && !t.getInicio().isAfter(instante) && t.getFim().isAfter(instante)) {
                return t.getPessoaId();
            }
        }
        return null;
    }

    private static Set<Long> coordenadores(List<MembroRede> membros) {
        Set<Long> ids = new LinkedHashSet<>();
        for (MembroRede m : membros) {
            if (m.coordenador()) {
                ids.add(m.pessoaId());
            }
        }
        return ids;
    }

    private static boolean eu(long eu, Long pessoa) {
        return pessoa != null && pessoa == eu;
    }
}
