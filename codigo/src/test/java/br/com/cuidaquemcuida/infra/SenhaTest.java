package br.com.cuidaquemcuida.infra;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;

class SenhaTest {

    /** Mesmos valores do banco/03-dados-demo.sql (senha demo1234). Se este teste falhar, o seed está com o hash errado. */
    private static final String SALT_SEED = "N6O0/N80LispSj5n8g5ZGg==";
    private static final String HASH_SEED = "HYiTUFXn9j8PWCQE/8wRFPRjfy2bPppx9A3ZYuEVsO0=";

    @Test
    void senhaDemoConfereComOHashDosDadosDeDemonstracao() {
        assertTrue(Senha.confere("demo1234", SALT_SEED, HASH_SEED));
    }

    @Test
    void senhaErradaNaoConfere() {
        assertFalse(Senha.confere("errada", SALT_SEED, HASH_SEED));
    }

    @Test
    void contaAnonimizadaNuncaConfere() {
        assertFalse(Senha.confere("qualquer", "", ""));
    }

    @Test
    void cadaSaltEhDiferente() {
        assertNotEquals(Senha.novoSalt(), Senha.novoSalt());
    }

    @Test
    void hashEhDeterministicoParaOMesmoSalt() {
        String salt = Senha.novoSalt();
        assertEquals(Senha.hash("segredo123", salt), Senha.hash("segredo123", salt));
    }

    @Test
    void tokenTemQuarentaETresCaracteresSeguroParaUrl() {
        String token = Senha.novoToken();
        assertEquals(43, token.length());
        assertTrue(token.matches("[A-Za-z0-9_-]+"));
    }
}
