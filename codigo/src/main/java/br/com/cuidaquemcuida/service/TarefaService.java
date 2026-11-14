package br.com.cuidaquemcuida.service;

import br.com.cuidaquemcuida.dao.AuditoriaDao;
import br.com.cuidaquemcuida.dao.PessoaDao;
import br.com.cuidaquemcuida.dao.TarefaDao;
import br.com.cuidaquemcuida.infra.ApiException;
import br.com.cuidaquemcuida.infra.Autorizacao;
import br.com.cuidaquemcuida.infra.Sql;
import br.com.cuidaquemcuida.model.ExecucaoTarefa;
import br.com.cuidaquemcuida.model.TarefaCuidado;
import br.com.cuidaquemcuida.resource.Dtos.ExecucaoDto;
import br.com.cuidaquemcuida.resource.Dtos.TarefaDto;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

/** Protocolo de cuidado: tarefas recorrentes e quem as fez. */
public final class TarefaService {

    private TarefaService() {
    }

    static TarefaDto dto(TarefaCuidado t) {
        return new TarefaDto(t.getId(), t.getTitulo(), t.getOrientacao(), t.getRecorrenciaHoras(), t.getPrimeiraVez(), t.getTipoSinal(), t.isAtiva());
    }

    private static TarefaCuidado montar(Long id, long pacienteId, TarefaDto d) {
        if (d.recorrenciaHoras() == null) {
            throw ApiException.invalido("A repetição precisa ser de 1 a 24 horas");
        }
        return new TarefaCuidado(id, pacienteId, d.titulo(), d.orientacao(), d.recorrenciaHoras(), d.primeiraVez(), d.tipoSinal(),
                !Boolean.FALSE.equals(d.ativa()));
    }

    public static List<TarefaDto> listar(long eu, long pacienteId) {
        Autorizacao.exigirMembro(eu, pacienteId);
        return TarefaDao.doPaciente(pacienteId).stream().map(TarefaService::dto).toList();
    }

    public static TarefaDto criar(long eu, long pacienteId, TarefaDto dados) {
        Autorizacao.exigirCoordenador(eu, pacienteId);
        TarefaCuidado t = montar(null, pacienteId, dados);
        t.setId(TarefaDao.inserir(t));
        AuditoriaDao.registrar(eu, AuditoriaDao.INSERIR, "tarefa_cuidado", t.getId(), t.getTitulo());
        return dto(t);
    }

    public static TarefaDto atualizar(long eu, long tarefaId, TarefaDto dados) {
        TarefaCuidado atual = tarefa(tarefaId);
        Autorizacao.exigirCoordenador(eu, atual.getPacienteId());
        TarefaCuidado t = montar(tarefaId, atual.getPacienteId(), dados);
        Sql.transacao(() -> {
            TarefaDao.atualizar(t);
            TarefaDao.apagarFuturasNaoFeitas(tarefaId, LocalDateTime.now());
            return null;
        });
        AuditoriaDao.registrar(eu, AuditoriaDao.ALTERAR, "tarefa_cuidado", tarefaId, t.getTitulo());
        return dto(t);
    }

    public static void apagar(long eu, long tarefaId) {
        TarefaCuidado atual = tarefa(tarefaId);
        Autorizacao.exigirCoordenador(eu, atual.getPacienteId());
        TarefaDao.apagar(tarefaId);
        AuditoriaDao.registrar(eu, AuditoriaDao.EXCLUIR, "tarefa_cuidado", tarefaId, atual.getTitulo());
    }

    /** Cria as execuções do dia que ainda não existem (não duplica). Lê antes e só insere o que falta. */
    public static void garantirExecucoes(long pacienteId, LocalDate dia) {
        List<TarefaCuidado> tarefas = TarefaDao.doPaciente(pacienteId);
        Set<String> existentes = TarefaDao.execucoesNoDia(pacienteId, dia).stream()
                .map(e -> e.getTarefaId() + "@" + e.getPrevistaPara())
                .collect(Collectors.toSet());
        Map<Long, List<LocalDateTime>> faltando = new LinkedHashMap<>();
        for (TarefaCuidado t : tarefas) {
            List<LocalDateTime> novas = t.horariosDoDia(dia).stream()
                    .filter(h -> !existentes.contains(t.getId() + "@" + h))
                    .toList();
            if (!novas.isEmpty()) {
                faltando.put(t.getId(), novas);
            }
        }
        if (faltando.isEmpty()) {
            return;
        }
        Sql.transacao(() -> {
            faltando.forEach(TarefaDao::garantirExecucoes);
            return null;
        });
    }

    public static List<ExecucaoDto> execucoes(long eu, long pacienteId, LocalDate dia) {
        Autorizacao.exigirMembro(eu, pacienteId);
        garantirExecucoes(pacienteId, dia);
        Map<Long, TarefaCuidado> tarefas = tarefasPorId(pacienteId);
        Map<Long, String> nomes = PessoaDao.nomesDaRede(pacienteId);
        return TarefaDao.execucoesNoDia(pacienteId, dia).stream().map(e -> dto(e, tarefas, nomes)).toList();
    }

    public static ExecucaoDto feita(long eu, long execucaoId) {
        ExecucaoTarefa e = TarefaDao.execucaoPorId(execucaoId).orElseThrow(() -> ApiException.naoEncontrado("Tarefa não encontrada"));
        TarefaCuidado t = tarefa(e.getTarefaId());
        Autorizacao.exigirMembro(eu, t.getPacienteId());
        Map<Long, String> nomes = PessoaDao.nomesDaRede(t.getPacienteId());
        if (TarefaDao.marcarFeita(execucaoId, eu, LocalDateTime.now()) == 0) {
            ExecucaoTarefa atual = TarefaDao.execucaoPorId(execucaoId).orElseThrow();
            throw ApiException.conflito("Essa tarefa já foi feita por " + nomes.getOrDefault(atual.getFeitaPor(), "outra pessoa"));
        }
        AuditoriaDao.registrar(eu, AuditoriaDao.ALTERAR, "execucao_tarefa", execucaoId, t.getTitulo());
        return dto(TarefaDao.execucaoPorId(execucaoId).orElseThrow(), Map.of(t.getId(), t), nomes);
    }

    static ExecucaoDto dto(ExecucaoTarefa e, Map<Long, TarefaCuidado> tarefas, Map<Long, String> nomes) {
        TarefaCuidado t = tarefas.get(e.getTarefaId());
        return new ExecucaoDto(e.getId(), e.getTarefaId(), t.getTitulo(), t.getOrientacao(), t.getTipoSinal(), e.getPrevistaPara(),
                e.getFeitaEm(), e.getFeitaPor() == null ? null : nomes.get(e.getFeitaPor()));
    }

    static Map<Long, TarefaCuidado> tarefasPorId(long pacienteId) {
        return TarefaDao.doPaciente(pacienteId).stream().collect(Collectors.toMap(TarefaCuidado::getId, Function.identity()));
    }

    private static TarefaCuidado tarefa(long id) {
        return TarefaDao.porId(id).orElseThrow(() -> ApiException.naoEncontrado("Tarefa não encontrada"));
    }
}
