package br.com.cuidaquemcuida;

import br.com.cuidaquemcuida.infra.Conexao;
import br.com.cuidaquemcuida.infra.Config;
import java.net.URI;
import java.util.Optional;
import java.util.TimeZone;
import org.glassfish.grizzly.http.server.CLStaticHttpHandler;
import org.glassfish.grizzly.http.server.HttpServer;
import org.glassfish.jersey.grizzly2.httpserver.GrizzlyHttpServerFactory;
import org.glassfish.jersey.server.ResourceConfig;

/**
 * Ponto de partida: sobe o servidor Grizzly com a API JAX-RS (Jersey) em /api e as telas em /.
 * Rodar: dentro de codigo/, "mvn exec:java" (ou o botão ▶ do IntelliJ nesta classe).
 */
public final class App {

    private App() {
    }

    public static void main(String[] args) throws InterruptedException {
        TimeZone.setDefault(TimeZone.getTimeZone("America/Sao_Paulo"));
        int porta = Integer.parseInt(Optional.ofNullable(Config.get("porta")).orElse("8080"));

        ResourceConfig api = new ResourceConfig().packages("br.com.cuidaquemcuida");
        HttpServer servidor = GrizzlyHttpServerFactory.createHttpServer(
                URI.create("http://0.0.0.0:" + porta + "/api/"), api, false);
        servidor.getServerConfiguration().addHttpHandler(new CLStaticHttpHandler(App.class.getClassLoader(), "/web/"), "/");
        Runtime.getRuntime().addShutdownHook(new Thread(servidor::shutdownNow));

        try {
            servidor.start();
        } catch (java.io.IOException e) {
            System.out.println("Não foi possível abrir a porta " + porta + ". Ela já está em uso? " + e.getMessage());
            return;
        }
        Conexao.testar();
        System.out.println("CuidaQuemCuida rodando em http://localhost:" + porta);
        System.out.println("No celular (mesmo Wi-Fi): http://<IP deste computador>:" + porta + "   (veja o IP com o comando ipconfig)");
        Thread.currentThread().join();
    }
}
