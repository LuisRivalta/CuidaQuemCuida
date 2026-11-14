package br.com.cuidaquemcuida.service;

import br.com.cuidaquemcuida.dao.AuditoriaDao;
import br.com.cuidaquemcuida.dao.DoseDao;
import br.com.cuidaquemcuida.dao.MedicamentoDao;
import br.com.cuidaquemcuida.dao.PessoaDao;
import br.com.cuidaquemcuida.infra.ApiException;
import br.com.cuidaquemcuida.infra.Autorizacao;
import br.com.cuidaquemcuida.infra.Sql;
import br.com.cuidaquemcuida.model.Dose;
import br.com.cuidaquemcuida.model.Medicamento;
import br.com.cuidaquemcuida.model.RegraHorario;
import br.com.cuidaquemcuida.model.StatusDose;
import br.com.cuidaquemcuida.resource.Dtos.DoseDto;
import br.com.cuidaquemcuida.resource.Dtos.MedicamentoDto;
import br.com.cuidaquemcuida.resource.Dtos.RegraDto;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

/** Remédios, regras de horário e registro das doses. */
public final class MedicacaoService {

    private MedicacaoService() {
    }

    static MedicamentoDto dto(Medicamento m) {
        RegraHorario r = m.getRegra();
        return new MedicamentoDto(m.getId(), m.getNome(), m.getDosagem(), m.getVia(), m.getInstrucoes(), m.isAtivo(),
                new RegraDto(r.tipo(), r.getIntervaloHoras(), r.getPrimeiraDose(), r.getHorarios(), r.getInicio(), r.getFim()));
    }

    private static Medicamento montar(Long id, long pacienteId, MedicamentoDto dados) {
        RegraDto r = dados.regra();
        if (r == null) {
            throw ApiException.invalido("Escolha o tipo de horário");
        }
        RegraHorario regra = RegraHorario.criar(r.tipo(), r.intervaloHoras(), r.primeiraDose(), r.horarios(), r.inicio(), r.fim());
        Medicamento m = new Medicamento(id, pacienteId, dados.nome(), regra);
        m.setDosagem(dados.dosagem());
        m.setVia(dados.via());
        m.setInstrucoes(dados.instrucoes());
        m.setAtivo(!Boolean.FALSE.equals(dados.ativo()));
        return m;
    }

    public static List<MedicamentoDto> listar(long eu, long pacienteId) {
        Autorizacao.exigirMembro(eu, pacienteId);
        return MedicamentoDao.doPaciente(pacienteId).stream().map(MedicacaoService::dto).toList();
    }

    public static MedicamentoDto criar(long eu, long pacienteId, MedicamentoDto dados) {
        Autorizacao.exigirCoordenador(eu, pacienteId);
        Medicamento m = montar(null, pacienteId, dados);
        m.setId(Sql.transacao(() -> MedicamentoDao.inserir(m)));
        AuditoriaDao.registrar(eu, AuditoriaDao.INSERIR, "medicamento", m.getId(), m.getNome());
        return dto(m);
    }

    public static MedicamentoDto atualizar(long eu, long medicamentoId, MedicamentoDto dados) {
        Medicamento atual = medicamento(medicamentoId);
        Autorizacao.exigirCoordenador(eu, atual.getPacienteId());
        Medicamento m = montar(medicamentoId, atual.getPacienteId(), dados);
        Sql.transacao(() -> {
            MedicamentoDao.atualizar(m);
            DoseDao.apagarPendentesFuturas(medicamentoId, LocalDateTime.now());
            return null;
        });
        AuditoriaDao.registrar(eu, AuditoriaDao.ALTERAR, "medicamento", medicamentoId, m.getNome());
        return dto(m);
    }

    public static void apagar(long eu, long medicamentoId) {
        Medicamento atual = medicamento(medicamentoId);
        Autorizacao.exigirCoordenador(eu, atual.getPacienteId());
        MedicamentoDao.apagar(medicamentoId);
        AuditoriaDao.registrar(eu, AuditoriaDao.EXCLUIR, "medicamento", medicamentoId, atual.getNome());
    }

    /**
     * Cria as doses previstas do dia que ainda não existem (pode ser chamado várias vezes: não duplica).
     * Primeiro lê o que já existe e só insere o que falta, para não mandar dezenas de INSERTs a cada tela aberta;
     * o ON CONFLICT do banco continua garantindo que duas chamadas ao mesmo tempo não dupliquem.
     */
    public static void garantirDoses(long pacienteId, LocalDate dia) {
        List<Medicamento> remedios = MedicamentoDao.doPaciente(pacienteId);
        Set<String> existentes = DoseDao.doPacienteNoDia(pacienteId, dia).stream()
                .map(d -> d.getMedicamentoId() + "@" + d.getPrevistoPara())
                .collect(Collectors.toSet());
        Map<Long, List<LocalDateTime>> faltando = new LinkedHashMap<>();
        for (Medicamento m : remedios) {
            List<LocalDateTime> novos = m.horariosEntre(dia.atStartOfDay(), dia.plusDays(1).atStartOfDay()).stream()
                    .filter(h -> !existentes.contains(m.getId() + "@" + h))
                    .toList();
            if (!novos.isEmpty()) {
                faltando.put(m.getId(), novos);
            }
        }
        if (faltando.isEmpty()) {
            return;
        }
        Sql.transacao(() -> {
            faltando.forEach(DoseDao::garantir);
            return null;
        });
    }

    /** Doses do dia, com o status atualizado (sem registro depois de 2 h vira "não dada"). */
    public static List<Dose> dosesDoDia(long pacienteId, LocalDate dia, LocalDateTime agora) {
        garantirDoses(pacienteId, dia);
        List<Dose> doses = DoseDao.doPacienteNoDia(pacienteId, dia);
        for (Dose d : doses) {
            if (d.getStatus() == StatusDose.PENDENTE
                    && DoseRegras.status(d.getPrevistoPara(), null, false, agora) == StatusDose.NAO_DADA) {
                DoseDao.marcarNaoDadaPorTempo(d.getId());
                d.setStatus(StatusDose.NAO_DADA);
            }
        }
        return doses;
    }

    public static List<DoseDto> doses(long eu, long pacienteId, LocalDate dia) {
        Autorizacao.exigirMembro(eu, pacienteId);
        Map<Long, Medicamento> remedios = remediosPorId(pacienteId);
        Map<Long, String> nomes = PessoaDao.nomesDaRede(pacienteId);
        return dosesDoDia(pacienteId, dia, LocalDateTime.now()).stream().map(d -> dto(d, remedios, nomes)).toList();
    }

    public static DoseDto dar(long eu, long doseId, String observacao) {
        return registrar(eu, doseId, true, observacao);
    }

    public static DoseDto naoDar(long eu, long doseId, String motivo) {
        if (motivo == null || motivo.isBlank()) {
            throw ApiException.invalido("Informe o motivo");
        }
        return registrar(eu, doseId, false, motivo);
    }

    /** Registro com UPDATE condicional: se outra pessoa registrou antes, responde 409 dizendo quem foi. */
    private static DoseDto registrar(long eu, long doseId, boolean dada, String texto) {
        Dose dose = DoseDao.porId(doseId).orElseThrow(() -> ApiException.naoEncontrado("Dose não encontrada"));
        Medicamento remedio = medicamento(dose.getMedicamentoId());
        long pacienteId = remedio.getPacienteId();
        Autorizacao.exigirMembro(eu, pacienteId);
        LocalDateTime agora = LocalDateTime.now();
        StatusDose novo = dada ? DoseRegras.status(dose.getPrevistoPara(), agora, false, agora) : StatusDose.NAO_DADA;
        int linhas = DoseRegras.podeRegistrar(dose.getStatus())
                ? DoseDao.registrar(doseId, novo, dada ? agora : null, eu, texto) : 0;
        Map<Long, String> nomes = PessoaDao.nomesDaRede(pacienteId);
        Dose atual = DoseDao.porId(doseId).orElseThrow();
        if (linhas == 0) {
            String quem = atual.getDadaPor() == null ? "" : " por " + nomes.getOrDefault(atual.getDadaPor(), "outra pessoa");
            throw ApiException.conflito("Essa dose já foi registrada" + quem);
        }
        AuditoriaDao.registrar(eu, AuditoriaDao.ALTERAR, "dose", doseId, remedio.getNome() + ": " + novo);
        return dto(atual, Map.of(remedio.getId(), remedio), nomes);
    }

    static DoseDto dto(Dose d, Map<Long, Medicamento> remedios, Map<Long, String> nomes) {
        Medicamento m = remedios.get(d.getMedicamentoId());
        return new DoseDto(d.getId(), d.getMedicamentoId(), m == null ? "" : m.getNome(), m == null ? null : m.getDosagem(),
                d.getPrevistoPara(), d.getStatus(), d.getDadaEm(), d.getDadaPor() == null ? null : nomes.get(d.getDadaPor()),
                d.getObservacao());
    }

    static Map<Long, Medicamento> remediosPorId(long pacienteId) {
        return MedicamentoDao.doPaciente(pacienteId).stream().collect(Collectors.toMap(Medicamento::getId, Function.identity()));
    }

    private static Medicamento medicamento(long id) {
        return MedicamentoDao.porId(id).orElseThrow(() -> ApiException.naoEncontrado("Remédio não encontrado"));
    }
}
