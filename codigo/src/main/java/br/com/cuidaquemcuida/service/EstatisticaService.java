package br.com.cuidaquemcuida.service;

import br.com.cuidaquemcuida.dao.EstatisticaDao;
import br.com.cuidaquemcuida.dao.EstatisticaDao.Contagem;
import br.com.cuidaquemcuida.dao.EstatisticaDao.DoseResolvida;
import br.com.cuidaquemcuida.dao.EstatisticaDao.HorasPorPessoa;
import br.com.cuidaquemcuida.dao.MembroRedeDao;
import br.com.cuidaquemcuida.dao.PessoaDao;
import br.com.cuidaquemcuida.dao.TurnoDao;
import br.com.cuidaquemcuida.dao.ZaritDao;
import br.com.cuidaquemcuida.infra.Autorizacao;
import br.com.cuidaquemcuida.model.AvaliacaoZarit;
import br.com.cuidaquemcuida.model.MembroRede;
import br.com.cuidaquemcuida.model.Periodo;
import br.com.cuidaquemcuida.model.StatusDose;
import br.com.cuidaquemcuida.model.Turno;
import br.com.cuidaquemcuida.resource.Dtos.Adesao;
import br.com.cuidaquemcuida.resource.Dtos.Carga;
import br.com.cuidaquemcuida.resource.Dtos.Chance;
import br.com.cuidaquemcuida.resource.Dtos.Equilibrio;
import br.com.cuidaquemcuida.resource.Dtos.EstatisticasDto;
import br.com.cuidaquemcuida.resource.Dtos.Medidas;
import br.com.cuidaquemcuida.resource.Dtos.PontoSerie;
import br.com.cuidaquemcuida.resource.Dtos.SerieDto;
import br.com.cuidaquemcuida.resource.Dtos.TaxaNome;
import br.com.cuidaquemcuida.resource.Dtos.TaxaPeriodo;
import br.com.cuidaquemcuida.resource.Dtos.ZaritEstatistica;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;

/**
 * Painel estatístico do coordenador. Parte vem pronta do SQL (agrupamentos, junções, subconsulta) e parte é
 * calculada no Java (média móvel, desvio padrão, chance condicional, correlação de Pearson).
 */
public final class EstatisticaService {

    private static final int DIAS_SERIE = 14;

    private EstatisticaService() {
    }

    /** JSON não aceita NaN: valor indefinido sai como null. Arredonda em 3 casas. */
    public static Double paraJson(double valor) {
        if (Double.isNaN(valor) || Double.isInfinite(valor)) {
            return null;
        }
        return Math.round(valor * 1000) / 1000.0;
    }

    /** Horário noturno para a chance de atraso: das 22h às 5h59. */
    public static boolean horarioNoturno(int hora) {
        return hora >= 22 || hora < 6;
    }

    public static EstatisticasDto calcular(long eu, long pacienteId, int dias) {
        Autorizacao.exigirCoordenador(eu, pacienteId);
        int periodo = dias < 1 || dias > 365 ? 30 : dias;
        LocalDateTime agora = LocalDateTime.now();
        LocalDateTime de = agora.toLocalDate().minusDays(periodo).atStartOfDay();
        LocalDateTime ateDoses = agora.minusMinutes(Limites.DOSE_NAO_DADA_MIN);   // só doses que já deveriam estar resolvidas
        List<MembroRede> membros = MembroRedeDao.doPaciente(pacienteId);
        Map<Long, String> nomes = PessoaDao.nomesDaRede(pacienteId);

        return new EstatisticasDto(periodo,
                adesao(pacienteId, de, ateDoses),
                carga(pacienteId, membros, nomes, de, agora),
                EstatisticaDao.acimaDaMedia(pacienteId, de, agora),
                equilibrio(pacienteId, membros, de, agora),
                mediaMovel(pacienteId, membros, nomes, agora),
                horasPorTurno(pacienteId, de, agora),
                EstatisticaDao.horaComMaisAtrasos(pacienteId, de, ateDoses).orElse(null),
                chanceAtraso(pacienteId, de, ateDoses),
                zarit(membros));
    }

    private static Adesao adesao(long pacienteId, LocalDateTime de, LocalDateTime ate) {
        List<Contagem> porRemedio = EstatisticaDao.adesaoPorMedicamento(pacienteId, de, ate);
        long acertos = porRemedio.stream().mapToLong(Contagem::acertos).sum();
        long total = porRemedio.stream().mapToLong(Contagem::total).sum();
        List<Contagem> porPeriodo = EstatisticaDao.adesaoPorPeriodo(pacienteId, de, ate);
        List<TaxaPeriodo> periodos = new ArrayList<>();
        for (Periodo p : Periodo.values()) {   // ordem fixa: madrugada, manhã, tarde, noite
            porPeriodo.stream().filter(c -> c.chave().equals(p.name())).findFirst()
                    .ifPresent(c -> periodos.add(new TaxaPeriodo(p, paraJson(c.taxa()))));
        }
        return new Adesao(paraJson(total == 0 ? Double.NaN : (double) acertos / total),
                porRemedio.stream().map(c -> new TaxaNome(c.chave(), paraJson(c.taxa()))).toList(),
                periodos);
    }

    /** Horas de cada membro (quem não fez turno aparece com 0) e a porcentagem do total. */
    private static List<Double> horasDosMembros(long pacienteId, List<MembroRede> membros, LocalDateTime de, LocalDateTime ate) {
        List<HorasPorPessoa> horas = EstatisticaDao.cargaPorPessoa(pacienteId, de, ate);
        return membros.stream()
                .map(m -> horas.stream().filter(h -> h.pessoaId() == m.pessoaId()).mapToDouble(HorasPorPessoa::horas).sum())
                .toList();
    }

    private static List<Carga> carga(long pacienteId, List<MembroRede> membros, Map<Long, String> nomes, LocalDateTime de, LocalDateTime ate) {
        List<Double> horas = horasDosMembros(pacienteId, membros, de, ate);
        double total = horas.stream().mapToDouble(Double::doubleValue).sum();
        List<Carga> lista = new ArrayList<>();
        for (int i = 0; i < membros.size(); i++) {
            double h = horas.get(i);
            lista.add(new Carga(nomes.get(membros.get(i).pessoaId()), paraJson(h), paraJson(total == 0 ? Double.NaN : h / total)));
        }
        lista.sort(Comparator.comparing((Carga c) -> c.horas() == null ? 0 : c.horas()).reversed());
        return lista;
    }

    /** Desvio padrão e coeficiente de variação das horas entre os membros ("Spreadable data", Fase 2). */
    private static Equilibrio equilibrio(long pacienteId, List<MembroRede> membros, LocalDateTime de, LocalDateTime ate) {
        List<Double> horas = horasDosMembros(pacienteId, membros, de, ate);
        return new Equilibrio(paraJson(Estatistica.desvioPadrao(horas)), paraJson(Estatistica.coeficienteVariacao(horas)));
    }

    /** Horas de cuidado por dia de cada membro, suavizadas pela média móvel de 7 dias. A ordem segue o id: a cor segue a pessoa. */
    private static List<SerieDto> mediaMovel(long pacienteId, List<MembroRede> membros, Map<Long, String> nomes, LocalDateTime agora) {
        LocalDate hoje = agora.toLocalDate();
        LocalDate primeiroDia = hoje.minusDays(DIAS_SERIE - 1 + 6);   // 6 dias a mais para a primeira média já ter 7 dias
        List<Turno> turnos = TurnoDao.doPaciente(pacienteId, primeiroDia.atStartOfDay(), agora);
        List<SerieDto> series = new ArrayList<>();
        for (MembroRede m : membros) {
            List<Turno> daPessoa = turnos.stream().filter(t -> t.getPessoaId() != null && t.getPessoaId() == m.pessoaId()).toList();
            List<Double> porDia = new ArrayList<>();
            for (LocalDate d = primeiroDia; !d.isAfter(hoje); d = d.plusDays(1)) {
                LocalDateTime fimDoDia = d.equals(hoje) ? agora : d.plusDays(1).atStartOfDay();
                porDia.add(horasEntre(daPessoa, d.atStartOfDay(), fimDoDia));
            }
            List<Double> movel = Estatistica.mediaMovel(porDia, 7);
            List<PontoSerie> pontos = new ArrayList<>();
            for (int i = movel.size() - DIAS_SERIE; i < movel.size(); i++) {
                pontos.add(new PontoSerie(primeiroDia.plusDays(i), paraJson(EscalaService.umaCasa(movel.get(i)))));
            }
            series.add(new SerieDto(nomes.get(m.pessoaId()), pontos));
        }
        return series;
    }

    /** Horas de turno dentro de [de, ate), recortando o que passa das bordas. */
    private static double horasEntre(List<Turno> turnos, LocalDateTime de, LocalDateTime ate) {
        long minutos = 0;
        for (Turno t : turnos) {
            LocalDateTime a = t.getInicio().isAfter(de) ? t.getInicio() : de;
            LocalDateTime b = t.getFim().isBefore(ate) ? t.getFim() : ate;
            if (a.isBefore(b)) {
                minutos += Duration.between(a, b).toMinutes();
            }
        }
        return minutos / 60.0;
    }

    private static Medidas horasPorTurno(long pacienteId, LocalDateTime de, LocalDateTime ate) {
        List<Double> duracoes = TurnoDao.queComecamEntre(pacienteId, de, ate).stream()
                .filter(t -> !t.vago()).map(t -> t.minutos() / 60.0).toList();
        return new Medidas(paraJson(Estatistica.media(duracoes)), paraJson(Estatistica.mediana(duracoes)), paraJson(Estatistica.moda(duracoes)));
    }

    /** "Qual é a chance de...?" (Fase 2): P(atraso | noite) e P(atraso | dia), pela frequência. */
    private static Chance chanceAtraso(long pacienteId, LocalDateTime de, LocalDateTime ate) {
        int noite = 0;
        int atrasoNoite = 0;
        int dia = 0;
        int atrasoDia = 0;
        for (DoseResolvida d : EstatisticaDao.dosesResolvidas(pacienteId, de, ate)) {
            boolean atrasada = d.status() == StatusDose.ATRASADA;
            if (horarioNoturno(d.previstoPara().getHour())) {
                noite++;
                atrasoNoite += atrasada ? 1 : 0;
            } else {
                dia++;
                atrasoDia += atrasada ? 1 : 0;
            }
        }
        return new Chance(paraJson(noite == 0 ? Double.NaN : (double) atrasoNoite / noite),
                paraJson(dia == 0 ? Double.NaN : (double) atrasoDia / dia));
    }

    /**
     * Zarit: só quem compartilha com o coordenador. Pearson: cada avaliação é um ponto, com x = turnos noturnos
     * da pessoa (em todas as redes) nos 14 dias antes da avaliação, e y = pontuação (ou qualidade do sono).
     */
    private static ZaritEstatistica zarit(List<MembroRede> membros) {
        long pacienteId = membros.isEmpty() ? -1 : membros.get(0).pacienteId();
        int compartilharam = (int) membros.stream().filter(MembroRede::compartilhaZarit).count();
        List<AvaliacaoZarit> avaliacoes = pacienteId < 0 ? List.of() : ZaritDao.compartilhadasDaRede(pacienteId);
        List<Double> pontos = avaliacoes.stream().map(a -> (double) a.getPontuacao()).toList();

        double[] noites = new double[avaliacoes.size()];
        double[] pontuacoes = new double[avaliacoes.size()];
        List<double[]> sono = new ArrayList<>();
        for (int i = 0; i < avaliacoes.size(); i++) {
            AvaliacaoZarit a = avaliacoes.get(i);
            LocalDateTime inicio = a.getRespondidaEm().minusDays(Limites.ZARIT_DIAS);
            noites[i] = TurnoDao.daPessoa(a.getPessoaId(), inicio, a.getRespondidaEm()).stream()
                    .filter(t -> !t.getInicio().isBefore(inicio) && t.noturno()).count();
            pontuacoes[i] = a.getPontuacao();
            if (a.getQualidadeSono() != null) {
                sono.add(new double[] {noites[i], a.getQualidadeSono()});
            }
        }
        double[] xSono = sono.stream().mapToDouble(p -> p[0]).toArray();
        double[] ySono = sono.stream().mapToDouble(p -> p[1]).toArray();
        return new ZaritEstatistica(compartilharam, membros.size(),
                paraJson(Estatistica.media(pontos)), paraJson(Estatistica.mediana(pontos)), paraJson(Estatistica.moda(pontos)),
                paraJson(Estatistica.pearson(noites, pontuacoes)), paraJson(Estatistica.pearson(xSono, ySono)));
    }
}
