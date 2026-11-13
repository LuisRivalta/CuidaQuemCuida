package br.com.cuidaquemcuida.service;

import br.com.cuidaquemcuida.dao.AuditoriaDao;
import br.com.cuidaquemcuida.dao.ConsentimentoDao;
import br.com.cuidaquemcuida.dao.MembroRedeDao;
import br.com.cuidaquemcuida.dao.PacienteDao;
import br.com.cuidaquemcuida.dao.PessoaDao;
import br.com.cuidaquemcuida.infra.ApiException;
import br.com.cuidaquemcuida.infra.Autorizacao;
import br.com.cuidaquemcuida.infra.Sql;
import br.com.cuidaquemcuida.model.MembroRede;
import br.com.cuidaquemcuida.model.Paciente;
import br.com.cuidaquemcuida.model.Papel;
import br.com.cuidaquemcuida.model.Vinculo;
import br.com.cuidaquemcuida.resource.Dtos.ConviteSaida;
import br.com.cuidaquemcuida.resource.Dtos.EntrarSaida;
import br.com.cuidaquemcuida.resource.Dtos.MembroDto;
import br.com.cuidaquemcuida.resource.Dtos.PacienteCriado;
import br.com.cuidaquemcuida.resource.Dtos.PacienteDto;
import br.com.cuidaquemcuida.resource.Dtos.PacienteEntrada;
import br.com.cuidaquemcuida.resource.Dtos.PacienteResumo;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/** Pacientes e redes de cuidado: cadastro, convite por código, membros e papéis. */
public final class RedeService {

    /** Sem letras e números que se confundem (O e 0, I e 1). */
    private static final String LETRAS_CODIGO = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    private static final SecureRandom ALEATORIO = new SecureRandom();
    private static final String VERSAO_TERMO = "1.0";

    private RedeService() {
    }

    public static List<PacienteResumo> minhasRedes(long eu) {
        return PacienteDao.daPessoa(eu);
    }

    public static PacienteCriado criar(long eu, PacienteEntrada dados) {
        if (!Boolean.TRUE.equals(dados.declaracaoAutorizacao())) {
            throw ApiException.invalido("É preciso declarar a autorização do responsável legal");
        }
        Paciente p = new Paciente(null, dados.nome(), dados.dataNascimento(), dados.responsavelNome(), dados.responsavelParentesco());
        p.setCondicao(dados.condicao());
        p.setPrecisa24h(Boolean.TRUE.equals(dados.precisa24h()));
        p.setObservacoes(dados.observacoes());
        p.setCodigoConvite(novoCodigo());
        long id = Sql.transacao(() -> {
            long novoId = PacienteDao.inserir(p);
            MembroRedeDao.inserir(eu, novoId, Papel.COORDENADOR, Vinculo.FAMILIAR);
            ConsentimentoDao.dadosPaciente(eu, novoId, VERSAO_TERMO, p.getResponsavelNome());
            AuditoriaDao.registrar(eu, AuditoriaDao.INSERIR, "paciente", novoId, "paciente cadastrado; responsável: " + p.getResponsavelNome());
            return novoId;
        });
        return new PacienteCriado(id, p.getNome(), p.getCodigoConvite());
    }

    public static PacienteDto buscar(long eu, long pacienteId) {
        Papel papel = Autorizacao.exigirMembro(eu, pacienteId);
        Paciente p = paciente(pacienteId);
        return new PacienteDto(p.getId(), p.getNome(), p.getDataNascimento(), p.getCondicao(), p.isPrecisa24h(), p.getObservacoes(),
                p.getResponsavelNome(), p.getResponsavelParentesco(), papel == Papel.COORDENADOR ? p.getCodigoConvite() : null);
    }

    public static PacienteDto atualizar(long eu, long pacienteId, PacienteEntrada dados) {
        Autorizacao.exigirCoordenador(eu, pacienteId);
        Paciente p = paciente(pacienteId);
        p.setNome(dados.nome());
        p.setDataNascimento(dados.dataNascimento());
        p.setCondicao(dados.condicao());
        p.setPrecisa24h(Boolean.TRUE.equals(dados.precisa24h()));
        p.setObservacoes(dados.observacoes());
        p.setResponsavel(dados.responsavelNome(), dados.responsavelParentesco());
        PacienteDao.atualizar(p);
        AuditoriaDao.registrar(eu, AuditoriaDao.ALTERAR, "paciente", pacienteId, null);
        return buscar(eu, pacienteId);
    }

    public static void apagar(long eu, long pacienteId) {
        Autorizacao.exigirCoordenador(eu, pacienteId);
        PacienteDao.apagar(pacienteId);
        AuditoriaDao.registrar(eu, AuditoriaDao.EXCLUIR, "paciente", pacienteId, null);
    }

    public static EntrarSaida entrar(long eu, String codigo, Vinculo vinculo) {
        if (codigo == null || codigo.isBlank()) {
            throw ApiException.invalido("Digite o código de convite");
        }
        Paciente p = PacienteDao.porCodigo(codigo.trim().toUpperCase())
                .orElseThrow(() -> ApiException.naoEncontrado("Código de convite não encontrado"));
        Vinculo v = vinculo == null ? Vinculo.OUTRO : vinculo;
        Optional<MembroRede> existente = MembroRedeDao.buscar(eu, p.getId());
        if (existente.isPresent() && existente.get().ativo()) {
            throw ApiException.conflito("Você já faz parte desta rede");
        }
        if (existente.isPresent()) {
            MembroRedeDao.reativar(eu, p.getId(), v);
        } else {
            MembroRedeDao.inserir(eu, p.getId(), Papel.MEMBRO, v);
        }
        AuditoriaDao.registrar(eu, AuditoriaDao.INSERIR, "membro_rede", p.getId(), "entrou com código de convite");
        return new EntrarSaida(p.getId(), p.getNome());
    }

    public static ConviteSaida renovarConvite(long eu, long pacienteId) {
        Autorizacao.exigirCoordenador(eu, pacienteId);
        String codigo = novoCodigo();
        PacienteDao.mudarCodigo(pacienteId, codigo);
        AuditoriaDao.registrar(eu, AuditoriaDao.ALTERAR, "paciente", pacienteId, "novo código de convite");
        return new ConviteSaida(codigo);
    }

    public static List<MembroDto> membros(long eu, long pacienteId) {
        Autorizacao.exigirMembro(eu, pacienteId);
        Map<Long, String> nomes = PessoaDao.nomesDaRede(pacienteId);
        LocalDateTime agora = LocalDateTime.now();
        return MembroRedeDao.doPaciente(pacienteId).stream()
                .map(m -> new MembroDto(m.pessoaId(), nomes.get(m.pessoaId()), m.papel(), m.vinculo(),
                        EscalaService.carga(m.pessoaId(), agora).horas7d()))
                .toList();
    }

    public static void mudarPapel(long eu, long pacienteId, long pessoaId, Papel papel) {
        Autorizacao.exigirCoordenador(eu, pacienteId);
        if (papel == null) {
            throw ApiException.invalido("Informe o papel");
        }
        if (pessoaId == eu && papel != Papel.COORDENADOR
                && MembroRedeDao.doPaciente(pacienteId).stream().filter(MembroRede::coordenador).count() == 1) {
            throw ApiException.conflito("A rede precisa de pelo menos um coordenador");
        }
        if (MembroRedeDao.mudarPapel(pessoaId, pacienteId, papel) == 0) {
            throw ApiException.naoEncontrado("Pessoa não encontrada nesta rede");
        }
        AuditoriaDao.registrar(eu, AuditoriaDao.ALTERAR, "membro_rede", pessoaId, "papel: " + papel);
    }

    public static void remover(long eu, long pacienteId, long pessoaId) {
        Autorizacao.exigirCoordenador(eu, pacienteId);
        if (pessoaId == eu) {
            throw ApiException.invalido("Para sair da rede, peça a outro coordenador ou exclua sua conta");
        }
        MembroRedeDao.desativar(pessoaId, pacienteId);
        AuditoriaDao.registrar(eu, AuditoriaDao.EXCLUIR, "membro_rede", pessoaId, "removido da rede " + pacienteId);
    }

    public static boolean compartilharZarit(long eu, long pacienteId, boolean compartilha) {
        Autorizacao.exigirMembro(eu, pacienteId);
        MembroRedeDao.compartilharZarit(eu, pacienteId, compartilha);
        AuditoriaDao.registrar(eu, AuditoriaDao.ALTERAR, "membro_rede", pacienteId, "compartilha Zarit: " + compartilha);
        return compartilha;
    }

    static Paciente paciente(long pacienteId) {
        return PacienteDao.porId(pacienteId).orElseThrow(() -> ApiException.naoEncontrado("Paciente não encontrado"));
    }

    private static String novoCodigo() {
        String codigo;
        do {
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < 6; i++) {
                sb.append(LETRAS_CODIGO.charAt(ALEATORIO.nextInt(LETRAS_CODIGO.length())));
            }
            codigo = sb.toString();
        } while (PacienteDao.codigoExiste(codigo));
        return codigo;
    }
}
