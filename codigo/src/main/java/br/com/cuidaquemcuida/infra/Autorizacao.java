package br.com.cuidaquemcuida.infra;

import br.com.cuidaquemcuida.dao.MembroRedeDao;
import br.com.cuidaquemcuida.model.MembroRede;
import br.com.cuidaquemcuida.model.Papel;
import java.util.List;
import java.util.Optional;

/**
 * Quem pode ver e mexer em cada paciente: só quem faz parte da rede dele, e algumas ações só o coordenador.
 * Trocar o id do paciente na URL não dá acesso a outra família.
 */
public final class Autorizacao {

    private Autorizacao() {
    }

    /** Papel da pessoa na rede do paciente (vazio se não participa ou saiu da rede). */
    public static Optional<Papel> papel(List<MembroRede> redes, long pacienteId) {
        return redes.stream()
                .filter(m -> m.ativo() && m.pacienteId() == pacienteId)
                .map(MembroRede::papel)
                .findFirst();
    }

    public static Papel exigirMembro(long pessoaId, long pacienteId) {
        return papel(MembroRedeDao.daPessoa(pessoaId), pacienteId)
                .orElseThrow(() -> new ApiException(403, "Você não faz parte da rede deste paciente"));
    }

    public static void exigirCoordenador(long pessoaId, long pacienteId) {
        if (exigirMembro(pessoaId, pacienteId) != Papel.COORDENADOR) {
            throw new ApiException(403, "Só o coordenador pode fazer isso");
        }
    }
}
