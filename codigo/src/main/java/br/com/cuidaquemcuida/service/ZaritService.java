package br.com.cuidaquemcuida.service;

import br.com.cuidaquemcuida.dao.AlertaDao;
import br.com.cuidaquemcuida.dao.AuditoriaDao;
import br.com.cuidaquemcuida.dao.MembroRedeDao;
import br.com.cuidaquemcuida.dao.PessoaDao;
import br.com.cuidaquemcuida.dao.ZaritDao;
import br.com.cuidaquemcuida.infra.ApiException;
import br.com.cuidaquemcuida.infra.Autorizacao;
import br.com.cuidaquemcuida.infra.Sql;
import br.com.cuidaquemcuida.model.AvaliacaoZarit;
import br.com.cuidaquemcuida.model.Cuidador;
import br.com.cuidaquemcuida.model.FaixaZarit;
import br.com.cuidaquemcuida.model.MembroRede;
import br.com.cuidaquemcuida.model.alerta.AlertaPedidoAjuda;
import br.com.cuidaquemcuida.resource.Dtos.AvaliacaoDto;
import br.com.cuidaquemcuida.resource.Dtos.MinhasZarit;
import br.com.cuidaquemcuida.resource.Dtos.PedirAjudaSaida;
import br.com.cuidaquemcuida.resource.Dtos.ZaritCriada;
import br.com.cuidaquemcuida.resource.Dtos.ZaritEntrada;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/** Bem-estar do cuidador: Escala Zarit (privada) e pedido de ajuda à rede. */
public final class ZaritService {

    private ZaritService() {
    }

    public static ZaritCriada responder(long eu, ZaritEntrada dados) {
        int pontuacao = ZaritCalculadora.pontuar(dados.respostas());
        FaixaZarit faixa = ZaritCalculadora.faixa(pontuacao);
        AvaliacaoZarit nova = new AvaliacaoZarit(null, eu, LocalDateTime.now().withNano(0), dados.respostas(), pontuacao, faixa,
                dados.horasSono(), dados.qualidadeSono());
        long id = Sql.transacao(() -> ZaritDao.inserir(nova));
        AuditoriaDao.registrar(eu, AuditoriaDao.INSERIR, "avaliacao_zarit", id, null);   // sem a pontuação: dado de saúde
        return new ZaritCriada(id, pontuacao, faixa, nova.getRespondidaEm());
    }

    public static MinhasZarit minhas(long eu) {
        List<AvaliacaoZarit> avaliacoes = ZaritDao.daPessoa(eu);
        LocalDate proxima = avaliacoes.isEmpty() ? LocalDate.now()
                : avaliacoes.get(0).getRespondidaEm().toLocalDate().plusDays(Limites.ZARIT_DIAS);
        return new MinhasZarit(avaliacoes.stream()
                .map(a -> new AvaliacaoDto(a.getId(), a.getPontuacao(), a.getFaixa(), a.getRespondidaEm(), a.getHorasSono(), a.getQualidadeSono()))
                .toList(), proxima);
    }

    public static void apagar(long eu, long avaliacaoId) {
        if (ZaritDao.apagar(avaliacaoId, eu) == 0) {
            throw ApiException.naoEncontrado("Avaliação não encontrada");
        }
        AuditoriaDao.registrar(eu, AuditoriaDao.EXCLUIR, "avaliacao_zarit", avaliacaoId, null);
    }

    /** Avisa os membros das redes escolhidas, sem mostrar a pontuação. */
    public static PedirAjudaSaida pedirAjuda(long eu, long avaliacaoId, List<Long> pacienteIds) {
        AvaliacaoZarit avaliacao = ZaritDao.porId(avaliacaoId)
                .filter(a -> a.getPessoaId() == eu)
                .orElseThrow(() -> ApiException.naoEncontrado("Avaliação não encontrada"));
        String meuNome = PessoaDao.porId(eu).map(Cuidador::getNome).orElse("Alguém da rede");
        int criados = 0;
        for (Long pacienteId : pacienteIds == null ? List.<Long>of() : pacienteIds) {
            Autorizacao.exigirMembro(eu, pacienteId);
            for (MembroRede m : MembroRedeDao.doPaciente(pacienteId)) {
                if (m.pessoaId() != eu) {
                    criados += AlertaDao.gravar(new AlertaPedidoAjuda(pacienteId, m.pessoaId(), avaliacao.getId(), meuNome));
                }
            }
        }
        AuditoriaDao.registrar(eu, AuditoriaDao.INSERIR, "alerta", avaliacaoId, "pedido de ajuda à rede");
        return new PedirAjudaSaida(criados);
    }
}
