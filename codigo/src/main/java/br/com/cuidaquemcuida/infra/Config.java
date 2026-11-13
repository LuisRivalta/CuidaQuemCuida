package br.com.cuidaquemcuida.infra;

import java.io.IOException;
import java.io.Reader;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Properties;

/**
 * Configuração do sistema. Lê o arquivo {@code config.properties} da pasta onde o sistema roda
 * (fora do Git, porque tem a senha do banco). Se uma chave faltar, usa a variável de ambiente
 * equivalente: db.url -> DB_URL, db.usuario -> DB_USUARIO, db.senha -> DB_SENHA, porta -> PORTA.
 */
public final class Config {

    private static final Properties ARQUIVO = carregar();

    private Config() {
    }

    private static Properties carregar() {
        Properties propriedades = new Properties();
        Path caminho = Path.of("config.properties");
        if (Files.exists(caminho)) {
            try (Reader leitor = Files.newBufferedReader(caminho, StandardCharsets.UTF_8)) {
                propriedades.load(leitor);
            } catch (IOException e) {
                throw new IllegalStateException("Não foi possível ler o config.properties", e);
            }
        }
        return propriedades;
    }

    /** Valor da chave, ou null se não estiver configurada. */
    public static String get(String chave) {
        String valor = ARQUIVO.getProperty(chave);
        if (valor != null && !valor.isBlank()) {
            return valor.trim();
        }
        String ambiente = System.getenv(chave.toUpperCase().replace('.', '_'));
        return ambiente == null || ambiente.isBlank() ? null : ambiente.trim();
    }

    public static String obrigatorio(String chave) {
        String valor = get(chave);
        if (valor == null) {
            throw new IllegalStateException("Configuração ausente: " + chave
                    + ". Copie config.properties.exemplo para config.properties e preencha.");
        }
        return valor;
    }
}
