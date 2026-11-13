package br.com.cuidaquemcuida.service;

import br.com.cuidaquemcuida.dao.AuditoriaDao;
import br.com.cuidaquemcuida.dao.ConsentimentoDao;
import br.com.cuidaquemcuida.dao.MembroRedeDao;
import br.com.cuidaquemcuida.dao.PacienteDao;
import br.com.cuidaquemcuida.dao.PessoaDao;
import br.com.cuidaquemcuida.dao.SessaoDao;
import br.com.cuidaquemcuida.dao.ZaritDao;
import br.com.cuidaquemcuida.infra.ApiException;
import br.com.cuidaquemcuida.infra.Senha;
import br.com.cuidaquemcuida.infra.Sql;
import br.com.cuidaquemcuida.model.Cuidador;
import br.com.cuidaquemcuida.model.MembroRede;
import br.com.cuidaquemcuida.resource.Dtos.CadastroEntrada;
import br.com.cuidaquemcuida.resource.Dtos.LoginSaida;
import br.com.cuidaquemcuida.resource.Dtos.PessoaDto;
import br.com.cuidaquemcuida.resource.Dtos.PessoaResumo;
import java.util.List;
import java.util.Set;

/** Cadastro, login, meus dados e exclusão de conta (LGPD). */
public final class ContaService {

    private static final Set<String> GENEROS = Set.of("FEMININO", "MASCULINO", "OUTRO", "NAO_INFORMAR");

    private ContaService() {
    }

    public static PessoaResumo cadastrar(CadastroEntrada dados) {
        if (!Boolean.TRUE.equals(dados.aceiteTermo())) {
            throw ApiException.invalido("É preciso aceitar o termo de uso");
        }
        if (dados.senha() == null || dados.senha().length() < 8) {
            throw ApiException.invalido("A senha precisa ter pelo menos 8 caracteres");
        }
        if (dados.email() == null || dados.nome() == null) {
            throw ApiException.invalido("Preencha nome e e-mail");
        }
        if (dados.genero() != null && !GENEROS.contains(dados.genero())) {
            throw ApiException.invalido("Gênero inválido");
        }
        if (PessoaDao.emailExiste(dados.email())) {
            throw ApiException.conflito("Este e-mail já tem cadastro");
        }
        Cuidador nova = new Cuidador(null, dados.nome(), dados.email(), dados.dataNascimento());
        nova.setTelefone(dados.telefone());
        nova.setGenero(dados.genero());
        String salt = Senha.novoSalt();
        nova.setSenhaSalt(salt);
        nova.setSenhaHash(Senha.hash(dados.senha(), salt));
        String versao = dados.versaoTermo() == null ? "1.0" : dados.versaoTermo();

        long id = Sql.transacao(() -> {
            long novoId = PessoaDao.inserir(nova);
            ConsentimentoDao.termoUsuario(novoId, versao);
            AuditoriaDao.registrar(novoId, AuditoriaDao.INSERIR, "pessoa", novoId, "cadastro com aceite do termo " + versao);
            return novoId;
        });
        return new PessoaResumo(id, nova.getNome(), nova.getEmail());
    }

    public static LoginSaida login(String email, String senha) {
        if (email == null || senha == null) {
            throw new ApiException(401, "E-mail ou senha incorretos");
        }
        Cuidador pessoa = PessoaDao.porEmail(email)
                .filter(Cuidador::isAtivo)
                .filter(c -> Senha.confere(senha, c.getSenhaSalt(), c.getSenhaHash()))
                .orElseThrow(() -> new ApiException(401, "E-mail ou senha incorretos"));
        String token = Senha.novoToken();
        SessaoDao.criar(token, pessoa.getId());
        AuditoriaDao.registrar(pessoa.getId(), AuditoriaDao.LOGIN, "sessao", null, null);
        return new LoginSaida(token, new PessoaResumo(pessoa.getId(), pessoa.getNome(), pessoa.getEmail()));
    }

    public static void logout(String token) {
        SessaoDao.apagar(token);
    }

    public static PessoaDto meusDados(long pessoaId) {
        Cuidador c = PessoaDao.porId(pessoaId).orElseThrow(() -> ApiException.naoEncontrado("Pessoa não encontrada"));
        return new PessoaDto(c.getId(), c.getNome(), c.getEmail(), c.getTelefone(), c.getDataNascimento(), c.getGenero(),
                PessoaDao.redes(pessoaId));
    }

    /**
     * Exclusão de conta: anonimiza a pessoa (mantém os registros de cuidado), apaga as avaliações Zarit de verdade
     * e tira a pessoa das redes. Coordenador único de uma rede com outros membros precisa passar a coordenação antes.
     */
    public static void excluir(long pessoaId) {
        Cuidador pessoa = PessoaDao.porId(pessoaId).orElseThrow(() -> ApiException.naoEncontrado("Pessoa não encontrada"));
        List<MembroRede> minhas = MembroRedeDao.daPessoa(pessoaId).stream().filter(MembroRede::ativo).toList();
        for (MembroRede m : minhas) {
            List<MembroRede> outros = MembroRedeDao.doPaciente(m.pacienteId()).stream().filter(o -> o.pessoaId() != pessoaId).toList();
            if (m.coordenador() && !outros.isEmpty() && outros.stream().noneMatch(MembroRede::coordenador)) {
                throw ApiException.conflito("Passe a coordenação a outro membro antes de excluir sua conta");
            }
        }
        Sql.transacao(() -> {
            for (MembroRede m : minhas) {
                boolean ultimo = MembroRedeDao.doPaciente(m.pacienteId()).stream().allMatch(o -> o.pessoaId() == pessoaId);
                if (ultimo) {
                    PacienteDao.apagar(m.pacienteId());
                } else {
                    MembroRedeDao.desativar(pessoaId, m.pacienteId());
                }
            }
            ZaritDao.apagarDaPessoa(pessoaId);
            SessaoDao.apagarDaPessoa(pessoaId);
            pessoa.anonimizar();
            PessoaDao.salvarAnonimizada(pessoa);
            AuditoriaDao.registrar(pessoaId, AuditoriaDao.EXCLUIR, "pessoa", pessoaId, "conta excluída (anonimizada)");
            return null;
        });
    }
}
