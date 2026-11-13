package br.com.cuidaquemcuida.service;

import br.com.cuidaquemcuida.dao.PessoaDao;
import br.com.cuidaquemcuida.dao.TarefaDao;
import br.com.cuidaquemcuida.dao.TurnoDao;
import br.com.cuidaquemcuida.infra.ApiException;
import br.com.cuidaquemcuida.infra.Autorizacao;
import br.com.cuidaquemcuida.model.Dose;
import br.com.cuidaquemcuida.model.ExecucaoTarefa;
import br.com.cuidaquemcuida.model.Medicamento;
import br.com.cuidaquemcuida.model.Paciente;
import br.com.cuidaquemcuida.model.StatusDose;
import br.com.cuidaquemcuida.model.TarefaCuidado;
import br.com.cuidaquemcuida.model.Turno;
import br.com.cuidaquemcuida.resource.Dtos.HojeDto;
import br.com.cuidaquemcuida.resource.Dtos.ItemHoje;
import br.com.cuidaquemcuida.resource.Dtos.PacienteNome;
import br.com.cuidaquemcuida.resource.Dtos.RedeDto;
import br.com.cuidaquemcuida.resource.Dtos.TurnoCurto;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;

/**
 * Tela "Hoje": com turno em andamento, o que cai dentro do turno; sem turno, as pendências do dia e o próximo turno.
 * Qualquer membro pode registrar a qualquer hora (o remédio às vezes sai 10 minutos depois do fim do turno).
 */
public final class HojeService {

    private HojeService() {
    }

    public static HojeDto hoje(long eu, Long pacienteIdPedido) {
        long pacienteId = pacienteIdPedido != null ? pacienteIdPedido
                : PessoaDao.redes(eu).stream().findFirst().map(RedeDto::pacienteId)
                .orElseThrow(() -> ApiException.naoEncontrado("Você ainda não faz parte de nenhuma rede"));
        Autorizacao.exigirMembro(eu, pacienteId);
        Paciente paciente = RedeService.paciente(pacienteId);
        LocalDateTime agora = LocalDateTime.now();
        LocalDate hoje = agora.toLocalDate();

        List<Turno> meus = TurnoDao.daPessoa(eu, agora.minusDays(1), agora.plusDays(14)).stream()
                .filter(t -> t.getPacienteId() == pacienteId).toList();
        Turno atual = meus.stream().filter(t -> !t.getInicio().isAfter(agora) && t.getFim().isAfter(agora)).findFirst().orElse(null);
        Turno proximo = atual != null ? null
                : meus.stream().filter(t -> t.getInicio().isAfter(agora)).min(Comparator.comparing(Turno::getInicio)).orElse(null);

        List<ItemHoje> itens = new ArrayList<>();
        Map<Long, Medicamento> remedios = MedicacaoService.remediosPorId(pacienteId);
        for (Dose d : MedicacaoService.dosesDoDia(pacienteId, hoje, agora)) {
            boolean pendente = d.getStatus() == StatusDose.PENDENTE;
            if (atual != null ? dentro(atual, d.getPrevistoPara()) : pendente) {
                Medicamento m = remedios.get(d.getMedicamentoId());
                String titulo = m == null ? "Remédio" : (m.getNome() + " " + (m.getDosagem() == null ? "" : m.getDosagem())).trim();
                String detalhe = m == null ? null : (m.getInstrucoes() != null ? m.getInstrucoes() : m.getVia());
                itens.add(new ItemHoje("DOSE", d.getId(), d.getPrevistoPara(), titulo, detalhe, d.getStatus().name(), null));
            }
        }
        TarefaService.garantirExecucoes(pacienteId, hoje);
        Map<Long, TarefaCuidado> tarefas = TarefaService.tarefasPorId(pacienteId);
        for (ExecucaoTarefa e : TarefaDao.execucoesNoDia(pacienteId, hoje)) {
            if (atual != null ? dentro(atual, e.getPrevistaPara()) : !e.feita()) {
                TarefaCuidado t = tarefas.get(e.getTarefaId());
                if (t != null) {
                    itens.add(new ItemHoje("TAREFA", e.getId(), e.getPrevistaPara(), t.getTitulo(), t.getOrientacao(),
                            e.feita() ? "FEITA" : "PENDENTE", t.getTipoSinal()));
                }
            }
        }
        itens.sort(Comparator.comparing(ItemHoje::horario));

        return new HojeDto(new PacienteNome(pacienteId, paciente.getNome()), curto(atual), curto(proximo), itens,
                AlertaService.gerar(eu, pacienteId, agora));
    }

    private static boolean dentro(Turno turno, LocalDateTime instante) {
        return !instante.isBefore(turno.getInicio()) && instante.isBefore(turno.getFim());
    }

    private static TurnoCurto curto(Turno t) {
        return t == null ? null : new TurnoCurto(t.getId(), t.getInicio(), t.getFim());
    }
}
