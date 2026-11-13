package br.com.cuidaquemcuida.service;

import br.com.cuidaquemcuida.dao.AlertaDao;
import br.com.cuidaquemcuida.dao.AuditoriaDao;
import br.com.cuidaquemcuida.dao.PessoaDao;
import br.com.cuidaquemcuida.dao.SinalVitalDao;
import br.com.cuidaquemcuida.infra.ApiException;
import br.com.cuidaquemcuida.infra.Autorizacao;
import br.com.cuidaquemcuida.infra.Sql;
import br.com.cuidaquemcuida.model.FaixaSinal;
import br.com.cuidaquemcuida.model.Paciente;
import br.com.cuidaquemcuida.model.SinalVital;
import br.com.cuidaquemcuida.model.TipoSinal;
import br.com.cuidaquemcuida.model.alerta.AlertaSinalVital;
import br.com.cuidaquemcuida.model.alerta.TipoAlerta;
import br.com.cuidaquemcuida.resource.Dtos.FaixaDto;
import br.com.cuidaquemcuida.resource.Dtos.SinalDto;
import br.com.cuidaquemcuida.resource.Dtos.SinalEntrada;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/** Sinais vitais: registro com alerta (fora da faixa ou fora da curva) e faixas por paciente. */
public final class SinalVitalService {

    public static final String FORA_DA_FAIXA = "FORA_DA_FAIXA";
    public static final String FORA_DA_CURVA = "FORA_DA_CURVA";

    private SinalVitalService() {
    }

    private static SinalDto dto(SinalVital s, Map<Long, String> nomes, String alerta) {
        return new SinalDto(s.getId(), s.getTipo(), s.getValor(), s.getValor2(), s.getMedidoEm(),
                s.getMedidoPor() == null ? null : nomes.get(s.getMedidoPor()), alerta);
    }

    public static List<SinalDto> listar(long eu, long pacienteId, TipoSinal tipo, LocalDate de, LocalDate ate) {
        Autorizacao.exigirMembro(eu, pacienteId);
        Map<Long, String> nomes = PessoaDao.nomesDaRede(pacienteId);
        return SinalVitalDao.doPaciente(pacienteId, tipo, de.atStartOfDay(), ate.plusDays(1).atStartOfDay()).stream()
                .map(s -> dto(s, nomes, null)).toList();
    }

    public static SinalDto registrar(long eu, long pacienteId, SinalEntrada dados) {
        Autorizacao.exigirMembro(eu, pacienteId);
        if (dados.valor() == null) {
            throw ApiException.invalido("O valor precisa ser maior que zero");
        }
        SinalVital novo = new SinalVital(null, pacienteId, dados.tipo(), dados.valor(), dados.valor2(),
                dados.medidoEm() == null ? LocalDateTime.now() : dados.medidoEm(), eu);
        List<Double> historico = SinalVitalDao.valoresAnteriores(pacienteId, novo.getTipo());
        FaixaSinal faixa = SinalVitalDao.faixas(pacienteId).stream().filter(f -> f.tipo() == novo.getTipo()).findFirst().orElse(null);
        String alerta = SinalVitalRegras.foraDaFaixa(novo.getValor(), faixa) ? FORA_DA_FAIXA
                : SinalVitalRegras.foraDaCurva(novo.getValor(), historico) ? FORA_DA_CURVA : null;

        novo.setId(SinalVitalDao.inserir(novo));
        AuditoriaDao.registrar(eu, AuditoriaDao.INSERIR, "sinal_vital", novo.getId(), novo.getTipo() + " " + novo.getValor());
        if (alerta != null) {
            avisar(pacienteId, novo, alerta.equals(FORA_DA_FAIXA) ? TipoAlerta.SINAL_FORA_FAIXA : TipoAlerta.SINAL_FORA_CURVA);
        }
        return dto(novo, PessoaDao.nomesDaRede(pacienteId), alerta);
    }

    /** Avisa quem está de turno agora e os coordenadores. */
    private static void avisar(long pacienteId, SinalVital sinal, TipoAlerta tipo) {
        Paciente paciente = RedeService.paciente(pacienteId);
        for (long destinatario : AlertaService.deTurnoECoordenadores(pacienteId, LocalDateTime.now())) {
            AlertaDao.gravar(new AlertaSinalVital(tipo, pacienteId, destinatario, sinal.getId(), sinal.getTipo(),
                    sinal.getValor(), sinal.getValor2(), paciente.getNome()));
        }
    }

    public static List<FaixaDto> faixas(long eu, long pacienteId) {
        Autorizacao.exigirMembro(eu, pacienteId);
        return SinalVitalDao.faixas(pacienteId).stream().map(f -> new FaixaDto(f.tipo(), f.minimo(), f.maximo())).toList();
    }

    public static List<FaixaDto> salvarFaixas(long eu, long pacienteId, List<FaixaDto> faixas) {
        Autorizacao.exigirCoordenador(eu, pacienteId);
        List<FaixaSinal> novas = (faixas == null ? List.<FaixaDto>of() : faixas).stream()
                .map(f -> {
                    if (f.tipo() == null) {
                        throw ApiException.invalido("Faixa sem tipo de medição");
                    }
                    return new FaixaSinal(pacienteId, f.tipo(), f.minimo(), f.maximo());
                })
                .toList();
        Sql.transacao(() -> {
            SinalVitalDao.substituirFaixas(pacienteId, novas);
            return null;
        });
        AuditoriaDao.registrar(eu, AuditoriaDao.ALTERAR, "faixa_sinal", pacienteId, null);
        return faixas(eu, pacienteId);
    }
}
