// Painel da rede (só coordenador): indicadores estatísticos com interpretação em palavras.
import { chamar, MODO } from '../api.js';
import { pacienteAtual, souCoordenador } from '../estado.js';
import { registrarTela } from '../rotas.js';
import { el, preencher, formatarData, porcentagem, numero } from '../ui.js';

// Paleta categórica validada (daltonismo): ordem fixa, a cor segue a pessoa, nunca a posição no ranking.
const CORES_SERIE = ['#2a78d6', '#eb6834', '#1baf7a', '#eda100'];
const COR_UNICA = '#2a78d6';
const TRACOS_SERIE = [[], [7, 4], [2, 4], [10, 3, 2, 3]];
const corTema = (token) => getComputedStyle(document.body).getPropertyValue(token).trim();
const PERIODOS = { MADRUGADA: 'Madrugada (0h–6h)', MANHA: 'Manhã (6h–12h)', TARDE: 'Tarde (12h–18h)', NOITE: 'Noite (18h–24h)' };

let graficos = [];

function interpretarCorrelacao(r, oQue) {
  if (r === null || r === undefined) return 'Dados insuficientes para calcular.';
  const forca = Math.abs(r) >= 0.7 ? 'forte' : Math.abs(r) >= 0.4 ? 'moderada' : Math.abs(r) >= 0.2 ? 'fraca' : null;
  if (!forca) return 'Praticamente sem relação.';
  return `Relação ${forca} e ${r > 0 ? 'positiva' : 'negativa'}: quem faz mais turnos noturnos tende a ${oQue(r > 0)}.`;
}

function interpretarEquilibrio(cv) {
  if (cv === null || cv === undefined) return 'Dados insuficientes.';
  if (cv > 0.5) return 'Carga muito desigual: uma ou duas pessoas fazem quase tudo.';
  if (cv > 0.25) return 'Carga desigual: vale redistribuir alguns turnos.';
  return 'Carga bem dividida entre as pessoas.';
}

const tile = (rotulo, valor, detalhe) => el('div', { class: 'cartao' },
  el('span', { class: 'detalhe' }, rotulo), el('span', { class: 'numero-grande' }, valor), detalhe ? el('span', { class: 'detalhe' }, detalhe) : null);

function opcoesBase(extra = {}) {
  const tinta = corTema('--texto-suave');
  return {
    responsive: true, maintainAspectRatio: false, animation: false,
    plugins: { legend: { display: false }, ...extra.plugins },
    scales: {
      x: { grid: { display: false }, ticks: { color: tinta } },
      y: { grid: { color: corTema('--borda') }, ticks: { color: tinta }, beginAtZero: true, ...extra.y },
    },
    ...extra.raiz,
  };
}

function desenhar(canvas, config) {
  requestAnimationFrame(() => {
    if (!canvas.isConnected) return;
    if (window.Chart) graficos.push(new window.Chart(canvas, config));
    else canvas.parentElement.hidden = true;
  });
}

function secaoCarga(est) {
  return el('section', { class: 'cartao', 'aria-labelledby': 't-carga' },
    el('h2', { id: 't-carga' }, 'Quem carrega o cuidado'),
    el('p', { class: 'detalhe' }, `Porcentagem das horas de turno nos últimos ${est.periodoDias} dias.`),
    est.cargaPorPessoa.map((c) => el('div', { class: 'barra-carga' },
      el('span', {}, c.nome.split(' ')[0]),
      el('span', { class: 'trilho', role: 'img', 'aria-label': `${c.nome}: ${porcentagem(c.percentual)} das horas` },
        el('span', { style: `width:${Math.round((c.percentual || 0) * 100)}%` })),
      el('strong', {}, porcentagem(c.percentual)))),
    est.acimaDaMedia.length ? el('p', {}, el('strong', {}, 'Acima da média da rede: '), est.acimaDaMedia.join(', ')) : null,
    el('p', {}, el('strong', {}, 'Equilíbrio: '),
      `desvio padrão de ${numero(est.equilibrio.desvioPadrao)} h entre as pessoas `,
      `(coeficiente de variação ${numero(est.equilibrio.coeficienteVariacao, 2)}). `,
      interpretarEquilibrio(est.equilibrio.coeficienteVariacao)));
}

function secaoMediaMovel(est) {
  const canvas = el('canvas', { role: 'img', 'aria-label': 'Gráfico de linhas: média móvel de 7 dias das horas de cuidado por pessoa' });
  const datas = est.mediaMovelHoras[0]?.serie.map((p) => p.data) || [];
  desenhar(canvas, {
    type: 'line',
    data: {
      labels: datas.map(formatarData),
      datasets: est.mediaMovelHoras.map((s, i) => ({
        label: s.nome.split(' ')[0], data: s.serie.map((p) => p.valor),
        borderColor: CORES_SERIE[i % CORES_SERIE.length], backgroundColor: CORES_SERIE[i % CORES_SERIE.length],
        borderDash: TRACOS_SERIE[i % TRACOS_SERIE.length],
        borderWidth: 3, pointRadius: 0, pointHoverRadius: 5, tension: 0.25,
      })),
    },
    options: opcoesBase({
      plugins: { legend: { display: true, position: 'bottom', labels: { boxWidth: 28, color: corTema('--texto-suave') } } },
      y: { title: { display: true, text: 'horas por dia', color: corTema('--texto-suave') } },
      raiz: { interaction: { mode: 'index', intersect: false } },
    }),
  });
  return el('section', { class: 'cartao', 'aria-labelledby': 't-movel' },
    el('h2', { id: 't-movel' }, 'Horas de cuidado por dia (média móvel de 7 dias)'),
    el('p', { class: 'detalhe' }, 'Cada ponto é a média dos 7 dias anteriores: suaviza o sobe e desce de um dia para o outro.'),
    el('div', { class: 'grafico' }, canvas),
    el('details', {}, el('summary', {}, 'Ver em tabela'),
      el('div', { class: 'tabela-rolagem' }, el('table', {},
        el('thead', {}, el('tr', {}, el('th', {}, 'Dia'), est.mediaMovelHoras.map((s) => el('th', {}, s.nome.split(' ')[0])))),
        el('tbody', {}, datas.map((d, i) => el('tr', {}, el('td', {}, formatarData(d)),
          est.mediaMovelHoras.map((s) => el('td', {}, numero(s.serie[i]?.valor))))))))));
}

function secaoAdesao(est) {
  const canvas = el('canvas', { role: 'img', 'aria-label': 'Gráfico de barras: adesão aos remédios por período do dia' });
  const periodos = est.adesao.porPeriodo;
  desenhar(canvas, {
    type: 'bar',
    data: {
      labels: periodos.map((p) => PERIODOS[p.periodo].split(' ')[0]),
      datasets: [{ label: 'Adesão', data: periodos.map((p) => (p.taxa === null ? null : Math.round(p.taxa * 100))),
        backgroundColor: COR_UNICA, borderRadius: 4, maxBarThickness: 48 }],
    },
    options: opcoesBase({ y: { max: 100, ticks: { color: corTema('--texto-suave'), callback: (v) => `${v}%` } } }),
  });
  return el('section', { class: 'cartao', 'aria-labelledby': 't-adesao' },
    el('h2', { id: 't-adesao' }, 'Adesão aos remédios por período'),
    el('p', { class: 'detalhe' }, 'Doses dadas no horário (até 30 min) ÷ doses previstas.'),
    el('div', { class: 'grafico' }, canvas),
    el('details', {}, el('summary', {}, 'Ver valores por período'),
      el('dl', { class: 'painel-periodos' }, periodos.map((p) => el('div', {},
        el('dt', {}, PERIODOS[p.periodo]), el('dd', {}, porcentagem(p.taxa)))))),
    el('h3', {}, 'Por remédio'),
    el('ul', { class: 'lista' }, est.adesao.porMedicamento.map((m) => el('li', {}, el('span', {}, m.nome), el('strong', {}, porcentagem(m.taxa))))));
}

function secaoMedidas(est) {
  const linha = (rotulo, m, unidade) => el('tr', {}, el('th', { scope: 'row' }, rotulo),
    el('td', {}, `${numero(m.media)} ${unidade}`), el('td', {}, `${numero(m.mediana)} ${unidade}`), el('td', {}, `${numero(m.moda)} ${unidade}`));
  return el('section', { class: 'cartao', 'aria-labelledby': 't-medidas' },
    el('h2', { id: 't-medidas' }, 'Está na média ou na moda?'),
    el('div', { class: 'tabela-rolagem' }, el('table', {},
      el('thead', {}, el('tr', {}, el('th', {}, ''), el('th', { scope: 'col' }, 'Média'), el('th', { scope: 'col' }, 'Mediana'), el('th', { scope: 'col' }, 'Moda'))),
      el('tbody', {},
        linha('Horas por turno', est.horasPorTurno, 'h'),
        est.zarit.compartilharam ? linha('Pontuação Zarit', est.zarit, 'pts') : null))),
    est.horaComMaisAtrasos !== null && est.horaComMaisAtrasos !== undefined
      ? el('p', {}, el('strong', {}, 'Horário com mais atrasos (moda): '), `${est.horaComMaisAtrasos}h`) : null);
}

function secaoCorrelacoes(est) {
  const z = est.zarit;
  return el('section', { class: 'cartao', 'aria-labelledby': 't-corr' },
    el('h2', { id: 't-corr' }, 'Noites e sobrecarga'),
    el('p', { class: 'detalhe' },
      `Correlação de Pearson (de −1 a 1) entre o número de turnos noturnos nos 14 dias antes de cada avaliação e o resultado. `,
      `Usa só quem compartilhou a Zarit: ${z.compartilharam} de ${z.total} pessoas.`),
    el('div', { class: 'grade-2' },
      tile('Noites × sobrecarga (Zarit)', numero(z.pearsonNoturnosZarit, 2)),
      tile('Noites × qualidade do sono', numero(z.pearsonNoturnosSono, 2))),
    el('p', {}, interpretarCorrelacao(z.pearsonNoturnosZarit, (pos) => (pos ? 'ter mais sobrecarga' : 'ter menos sobrecarga'))),
    el('p', {}, interpretarCorrelacao(z.pearsonNoturnosSono, (pos) => (pos ? 'dormir melhor' : 'dormir pior'))),
    el('p', { class: 'detalhe' }, 'Correlação mostra que duas coisas andam juntas, não que uma causa a outra.'));
}

registrarTela('/mais/painel', async (conteudo) => {
  graficos.forEach((g) => g.destroy());
  graficos = [];
  const paciente = pacienteAtual();
  if (!souCoordenador()) {
    conteudo.replaceChildren(el('h1', {}, 'Painel da rede'), el('p', {}, 'Só quem coordena a rede vê o painel.'));
    return;
  }
  const est = await chamar('GET', `/pacientes/${paciente.id}/estatisticas?dias=30`);
  const chance = est.chanceAtraso;

  preencher(conteudo,
    el('a', { href: '#/mais', class: 'link-botao' }, '← Mais'),
    el('header', { class: 'painel-cabecalho' },
      el('h1', {}, 'Painel da rede'),
      el('p', {}, `Cuidado de ${paciente.nome} nos últimos ${est.periodoDias} dias.`)),
    secaoCarga(est),
    el('div', { class: 'grade-2 painel-indicadores' },
      tile('Adesão aos remédios', porcentagem(est.adesao.geral), 'doses no horário'),
      tile('Compartilharam a Zarit', `${est.zarit.compartilharam} de ${est.zarit.total}`, 'pessoas da rede')),
    secaoMediaMovel(est),
    secaoAdesao(est),
    el('section', { class: 'cartao', 'aria-labelledby': 't-chance' },
      el('h2', { id: 't-chance' }, 'Qual é a chance de atrasar um remédio?'),
      el('div', { class: 'grade-2' },
        tile('À noite (22h–6h)', porcentagem(chance.noturno)),
        tile('De dia', porcentagem(chance.diurno))),
      chance.noturno !== null && chance.diurno !== null && chance.diurno > 0
        ? el('p', {}, `À noite, a chance de atraso é ${numero(chance.noturno / chance.diurno, 1)} vezes a do dia.`) : null),
    secaoMedidas(est),
    secaoCorrelacoes(est),
    el('p', { class: 'detalhe' }, MODO === 'demo' ? 'Dados de demonstração simulados.' : 'Indicadores calculados a partir dos registros da rede.'));
});
