package br.com.cuidaquemcuida.infra;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import br.com.cuidaquemcuida.model.MembroRede;
import br.com.cuidaquemcuida.model.Papel;
import br.com.cuidaquemcuida.model.Vinculo;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Test;

class AutorizacaoTest {

    @Test
    void membroDaRedeTemOPapelSoNaquelePaciente() {
        List<MembroRede> redes = List.of(new MembroRede(4L, 1L, Papel.MEMBRO, Vinculo.VIZINHO, true, false));
        assertEquals(Optional.of(Papel.MEMBRO), Autorizacao.papel(redes, 1L));
        assertTrue(Autorizacao.papel(redes, 2L).isEmpty(), "trocar o id do paciente na URL não pode dar acesso");
    }

    @Test
    void quemSaiuDaRedePerdeOAcesso() {
        List<MembroRede> redes = List.of(new MembroRede(4L, 1L, Papel.COORDENADOR, Vinculo.FAMILIAR, false, false));
        assertTrue(Autorizacao.papel(redes, 1L).isEmpty());
    }

    @Test
    void rotasPublicasSaoSoSaudeLoginECadastro() {
        assertTrue(AuthFilter.publica("GET", "saude"));
        assertTrue(AuthFilter.publica("POST", "auth/login"));
        assertTrue(AuthFilter.publica("POST", "/pessoas"));
        assertEquals(false, AuthFilter.publica("GET", "pessoas/eu"));
        assertEquals(false, AuthFilter.publica("GET", "pacientes"));
        assertEquals(false, AuthFilter.publica("DELETE", "pessoas"));
    }
}
