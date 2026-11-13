package br.com.cuidaquemcuida.service;

import br.com.cuidaquemcuida.model.Turno;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.PriorityQueue;

/** Regras da escala de revezamento: conflitos, folga, sobrecarga, períodos vagos e sugestão de cobertura. */
public final class EscalaRegras {

    private EscalaRegras() {
    }

    /** Dois turnos da mesma pessoa ao mesmo tempo. */
    public record Conflito(Turno a, Turno b) {
    }

    /** Sequência de turnos sem 11 h de folga entre eles. */
    public record Bloco(LocalDateTime inicio, LocalDateTime fim, long minutosTrabalhados) {
        public double horas() {
            return minutosTrabalhados / 60.0;
        }
    }

    /** Intervalo de tempo (usado para os períodos sem ninguém). */
    public record Intervalo(LocalDateTime inicio, LocalDateTime fim) {
    }

    public enum NivelSobrecarga { OK, ATENCAO, ALERTA }

    private static final Comparator<Turno> POR_INICIO = Comparator.comparing(Turno::getInicio).thenComparing(Turno::getFim);

    private static List<Turno> validosOrdenados(List<Turno> turnos) {
        List<Turno> lista = new ArrayList<>();
        for (Turno t : turnos) {
            if (!t.cancelado()) {
                lista.add(t);
            }
        }
        lista.sort(POR_INICIO);
        return lista;
    }

    /**
     * Conflitos entre os turnos (de uma mesma pessoa). Ordena pelo início e varre a lista guardando só os
     * turnos ainda "abertos" numa fila pelo fim: O(n log n + k), com k = número de conflitos.
     * A versão {@link #conflitosIngenuo} compara todos contra todos, O(n²) (Fase 6: eficiência).
     */
    public static List<Conflito> conflitos(List<Turno> turnos) {
        List<Conflito> conflitos = new ArrayList<>();
        PriorityQueue<Turno> abertos = new PriorityQueue<>(Comparator.comparing(Turno::getFim));
        for (Turno atual : validosOrdenados(turnos)) {
            while (!abertos.isEmpty() && !abertos.peek().getFim().isAfter(atual.getInicio())) {
                abertos.poll();   // terminou antes (ou exatamente quando) o atual começa: não conflita mais com ninguém
            }
            for (Turno aberto : abertos) {
                conflitos.add(new Conflito(aberto, atual));
            }
            abertos.add(atual);
        }
        return conflitos;
    }

    /** Versão ingênua (todos contra todos), mantida para comparação e testes. */
    public static List<Conflito> conflitosIngenuo(List<Turno> turnos) {
        List<Turno> lista = validosOrdenados(turnos);
        List<Conflito> conflitos = new ArrayList<>();
        for (int i = 0; i < lista.size(); i++) {
            for (int j = i + 1; j < lista.size(); j++) {
                if (lista.get(i).sobrepoe(lista.get(j))) {
                    conflitos.add(new Conflito(lista.get(i), lista.get(j)));
                }
            }
        }
        return conflitos;
    }

    /** Junta turnos encostados ou com menos de 11 h de intervalo. Cada bloco soma as horas trabalhadas. */
    public static List<Bloco> blocosSemFolga(List<Turno> turnos) {
        List<Bloco> blocos = new ArrayList<>();
        LocalDateTime inicio = null;
        LocalDateTime fim = null;
        long minutos = 0;
        for (Turno t : validosOrdenados(turnos)) {
            boolean semFolga = fim != null && Duration.between(fim, t.getInicio()).toMinutes() < Limites.FOLGA_MIN_HORAS * 60L;
            if (semFolga) {
                if (t.getFim().isAfter(fim)) {
                    fim = t.getFim();
                }
                minutos += t.minutos();
            } else {
                if (fim != null) {
                    blocos.add(new Bloco(inicio, fim, minutos));
                }
                inicio = t.getInicio();
                fim = t.getFim();
                minutos = t.minutos();
            }
        }
        if (fim != null) {
            blocos.add(new Bloco(inicio, fim, minutos));
        }
        return blocos;
    }

    /** Horas de turno dentro da janela [fim - dias, fim), recortando o que passa das bordas. */
    public static double horasNaJanela(List<Turno> turnos, LocalDateTime fim, int dias) {
        LocalDateTime inicio = fim.minusDays(dias);
        long minutos = 0;
        for (Turno t : turnos) {
            if (t.cancelado()) {
                continue;
            }
            LocalDateTime de = t.getInicio().isAfter(inicio) ? t.getInicio() : inicio;
            LocalDateTime ate = t.getFim().isBefore(fim) ? t.getFim() : fim;
            if (de.isBefore(ate)) {
                minutos += Duration.between(de, ate).toMinutes();
            }
        }
        return minutos / 60.0;
    }

    /** Maior bloco sem folga que terminou dentro dos últimos 7 dias (ou ainda está em andamento). */
    public static double horasSeguidas(List<Turno> turnos, LocalDateTime agora) {
        LocalDateTime corte = agora.minusDays(Limites.JANELA_CARGA_DIAS);
        double maior = 0;
        for (Bloco b : blocosSemFolga(turnos.stream().filter(t -> !t.getInicio().isAfter(agora)).toList())) {
            if (b.fim().isAfter(corte) && b.horas() > maior) {
                maior = b.horas();
            }
        }
        return maior;
    }

    public static NivelSobrecarga nivel(double horas7d, double horasSeguidas) {
        if (horas7d > Limites.ALERTA_HORAS_SEMANA || horasSeguidas > Limites.ALERTA_HORAS_SEGUIDAS) {
            return NivelSobrecarga.ALERTA;
        }
        if (horas7d > Limites.ATENCAO_HORAS_SEMANA || horasSeguidas > Limites.ATENCAO_HORAS_SEGUIDAS) {
            return NivelSobrecarga.ATENCAO;
        }
        return NivelSobrecarga.OK;
    }

    /** Intervalos dentro de [de, ate) sem nenhum turno com pessoa. Turno vago não conta como coberto. */
    public static List<Intervalo> periodosDescobertos(List<Turno> doPaciente, LocalDateTime de, LocalDateTime ate) {
        List<Intervalo> vagos = new ArrayList<>();
        LocalDateTime cursor = de;
        for (Turno t : validosOrdenados(doPaciente)) {
            if (t.vago() || !t.getFim().isAfter(de) || !t.getInicio().isBefore(ate)) {
                continue;
            }
            if (t.getInicio().isAfter(cursor)) {
                vagos.add(new Intervalo(cursor, t.getInicio()));
            }
            if (t.getFim().isAfter(cursor)) {
                cursor = t.getFim();
            }
        }
        if (cursor.isBefore(ate)) {
            vagos.add(new Intervalo(cursor, ate));
        }
        return vagos;
    }

    /**
     * Quem pode cobrir um turno vago: membros sem conflito no horário, do menos para o mais carregado
     * (horas nos últimos 7 dias). No empate, pelo id.
     */
    public static List<Long> sugerirCobertura(Turno vago, Map<Long, List<Turno>> turnosPorPessoa, LocalDateTime agora) {
        record Candidato(long pessoaId, double horas) {
        }
        List<Candidato> candidatos = new ArrayList<>();
        for (Map.Entry<Long, List<Turno>> e : turnosPorPessoa.entrySet()) {
            boolean ocupado = e.getValue().stream()
                    .anyMatch(t -> t != vago && !t.cancelado() && (vago.getId() == null || !vago.getId().equals(t.getId())) && t.sobrepoe(vago));
            if (!ocupado) {
                candidatos.add(new Candidato(e.getKey(), horasNaJanela(e.getValue(), agora, Limites.JANELA_CARGA_DIAS)));
            }
        }
        candidatos.sort(Comparator.comparingDouble(Candidato::horas).thenComparingLong(Candidato::pessoaId));
        return candidatos.stream().map(Candidato::pessoaId).toList();
    }
}
