package br.com.cuidaquemcuida.infra;

import java.security.GeneralSecurityException;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.util.Base64;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;

/**
 * Senhas guardadas só como hash PBKDF2-HMAC-SHA256 com salt (recomendação OWASP), usando a própria
 * biblioteca padrão do Java. A senha nunca é gravada nem pode ser lida de volta.
 */
public final class Senha {

    private static final int ITERACOES = 600_000;
    private static final int BYTES_SALT = 16;
    private static final int BITS_HASH = 256;
    private static final SecureRandom ALEATORIO = new SecureRandom();

    private Senha() {
    }

    public static String novoSalt() {
        byte[] salt = new byte[BYTES_SALT];
        ALEATORIO.nextBytes(salt);
        return Base64.getEncoder().encodeToString(salt);
    }

    public static String hash(String senha, String saltBase64) {
        PBEKeySpec especificacao = new PBEKeySpec(senha.toCharArray(), Base64.getDecoder().decode(saltBase64), ITERACOES, BITS_HASH);
        try {
            byte[] hash = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256").generateSecret(especificacao).getEncoded();
            return Base64.getEncoder().encodeToString(hash);
        } catch (GeneralSecurityException e) {
            throw new IllegalStateException("PBKDF2 indisponível nesta JVM", e);
        } finally {
            especificacao.clearPassword();
        }
    }

    /** Compara em tempo constante. Conta anonimizada (hash vazio) nunca confere. */
    public static boolean confere(String senha, String saltBase64, String hashBase64) {
        if (senha == null || saltBase64 == null || saltBase64.isEmpty() || hashBase64 == null || hashBase64.isEmpty()) {
            return false;
        }
        byte[] esperado = Base64.getDecoder().decode(hashBase64);
        byte[] calculado = Base64.getDecoder().decode(hash(senha, saltBase64));
        return MessageDigest.isEqual(esperado, calculado);
    }

    /** Token de sessão: 32 bytes aleatórios em Base64 seguro para URL (43 caracteres). */
    public static String novoToken() {
        byte[] bytes = new byte[32];
        ALEATORIO.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }
}
