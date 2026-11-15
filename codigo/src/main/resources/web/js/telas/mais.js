// Tela "Mais": paciente e remédios, pessoas da rede, sinais vitais, tarefas,
// dados coletados (LGPD), banco ao vivo e minha conta.
import { chamar, MODO } from '../api.js';
import { estado, limparSessao, pacienteAtual, souCoordenador } from '../estado.js';
import { registrarTela, ir, carregarContexto } from '../rotas.js';
import { icone } from '../icones.js';
import {
  el, preencher, campo, lerFormulario, tentar, mostrarAviso, formatarData, formatarHora, isoData, paraData,
} from '../ui.js';

const TIPOS_SINAL = {
  PRESSAO: { nome: 'Pressão', unidade: 'mmHg' },
  GLICEMIA: { nome: 'Glicemia', unidade: 'mg/dL' },
  TEMPERATURA: { nome: 'Temperatura', unidade: '°C' },
  SATURACAO: { nome: 'Saturação', unidade: '%' },
  FREQUENCIA_CARDIACA: { nome: 'Batimentos', unidade: 'bpm' },
};
const PAPEL = { COORDENADOR: 'Coordenador(a)', MEMBRO: 'Membro' };
const VINCULO = { FAMILIAR: 'Familiar', VIZINHO: 'Vizinho(a)', AMIGO: 'Amigo(a)', OUTRO: 'Outro' };

const voltar = () => el('a', { href: '#/mais', class: 'link-botao' }, '← Mais');
const cabecalho = (titulo, texto) => el('header', { class: 'mais-cabecalho' },
  el('h1', {}, titulo), texto ? el('p', {}, texto) : null);

// ------------------------------------------------------------------ menu
registrarTela('/mais', (conteudo) => {
  const item = (rota, texto, simbolo) => el('li', {}, el('a', { class: 'item-menu', href: '#' + rota },
    el('span', { class: 'mais-item' }, icone(simbolo), texto), icone('seta', 'seta-direita')));
  const grupo = (id, titulo, itens) => el('section', { class: 'cartao mais-grupo', 'aria-labelledby': id },
    el('h2', { id }, titulo), el('ul', { class: 'lista' }, itens));
  preencher(conteudo,
    cabecalho('Mais'),
    el('nav', { 'aria-label': 'Mais opções' },
      grupo('mais-pacientes', 'Pacientes', [
        item('/mais/paciente', 'Paciente e remédios', 'pilula'),
        item('/novo-paciente?origem=mais', 'Cadastrar paciente', 'pessoa'),
        item('/entrar-rede?origem=mais', 'Entrar em outra rede', 'pessoas'),
      ]),
      grupo('mais-rede', 'Rede de cuidado', [
        item('/escala?visao=meus', 'Meus turnos', 'calendario'),
        souCoordenador() ? item('/mais/painel', 'Painel da rede', 'grafico') : null,
        item('/mais/pessoas', 'Pessoas da rede', 'pessoas'),
        item('/mais/sinais', 'Sinais vitais', 'pulso'),
        item('/mais/tarefas', 'Tarefas de cuidado', 'lista'),
      ]),
      grupo('mais-conta', 'Conta e dados', [
        item('/mais/conta', 'Minha conta', 'pessoa'),
        item('/mais/dados', 'Dados coletados', 'cadeado'),
        item('/mais/banco', 'Banco ao vivo', 'banco'),
      ])),
    el('button', {
      class: 'secundario',
      onclick: async () => {
        await chamar('POST', '/auth/logout').catch(() => null);
        limparSessao();
        ir('/login');
      },
    }, 'Sair'));
});

// ------------------------------------------------------------------ paciente e remédios
function descreverRegra(r) {
  if (r.tipo === 'INTERVALO') return `De ${r.intervaloHoras} em ${r.intervaloHoras} horas, a partir das ${r.primeiraDose}`;
  if (r.tipo === 'DIAS_ALTERNADOS') return `Dia sim, dia não, às ${r.horarios.join(', ')}`;
  return `Todo dia às ${r.horarios.join(', ')}`;
}

function formularioRemedio(pacienteId, remedio, recarregar) {
  const r = remedio?.regra || { tipo: 'HORARIOS_FIXOS', horarios: ['08:00'], inicio: isoData(new Date()) };
  const tipo = el('select', { name: 'tipo' },
    el('option', { value: 'HORARIOS_FIXOS', selected: r.tipo === 'HORARIOS_FIXOS' }, 'Horários fixos todo dia'),
    el('option', { value: 'INTERVALO', selected: r.tipo === 'INTERVALO' }, 'De tantas em tantas horas'),
    el('option', { value: 'DIAS_ALTERNADOS', selected: r.tipo === 'DIAS_ALTERNADOS' }, 'Dia sim, dia não'));
  const blocoIntervalo = el('div', { class: 'grade-2' },
    campo('A cada (horas)', el('input', { name: 'intervaloHoras', type: 'number', min: '1', max: '24', value: r.intervaloHoras ?? 8 })),
    campo('Primeira dose', el('input', { name: 'primeiraDose', type: 'time', value: r.primeiraDose ?? '06:00' })));
  const blocoHorarios = campo('Horários', el('input', { name: 'horarios', value: (r.horarios || []).join(', '), placeholder: '08:00, 20:00' }),
    'Separe por vírgula.');
  const atualizar = () => {
    blocoIntervalo.hidden = tipo.value !== 'INTERVALO';
    blocoHorarios.hidden = tipo.value === 'INTERVALO';
  };
  tipo.addEventListener('change', atualizar);

  const form = el('form', { class: 'cartao', novalidate: true },
    el('h2', {}, remedio ? `Editar ${remedio.nome}` : 'Novo remédio'),
    campo('Nome', el('input', { name: 'nome', value: remedio?.nome || '', required: true })),
    el('div', { class: 'grade-2' },
      campo('Dose', el('input', { name: 'dosagem', value: remedio?.dosagem || '', placeholder: '50 mg' })),
      campo('Via', el('input', { name: 'via', value: remedio?.via || 'Oral' }))),
    campo('Instruções', el('input', { name: 'instrucoes', value: remedio?.instrucoes || '', placeholder: 'Ex.: em jejum' })),
    campo('Como é o horário?', tipo),
    blocoIntervalo,
    blocoHorarios,
    el('div', { class: 'grade-2' },
      campo('Início', el('input', { name: 'inicio', type: 'date', value: r.inicio || isoData(new Date()) })),
      campo('Fim (opcional)', el('input', { name: 'fim', type: 'date', value: r.fim || '' }))),
    el('div', { class: 'linha-botoes' },
      el('button', { type: 'submit' }, 'Salvar'),
      el('button', { type: 'button', class: 'secundario', onclick: () => form.remove() }, 'Cancelar')));
  atualizar();

  form.addEventListener('submit', async (evento) => {
    evento.preventDefault();
    const d = lerFormulario(form);
    const horarios = (d.horarios || '').split(',').map((h) => h.trim()).filter(Boolean)
      .map((h) => (/^\d{1,2}$/.test(h) ? `${h.padStart(2, '0')}:00` : h.padStart(5, '0')));
    if (horarios.some((h) => !/^([01]\d|2[0-3]):[0-5]\d$/.test(h))) {
      return tentar(() => { throw new Error('Use horários no formato 08:00, separados por vírgula.'); });
    }
    const corpo = {
      nome: d.nome, dosagem: d.dosagem, via: d.via, instrucoes: d.instrucoes, ativo: true,
      regra: {
        tipo: d.tipo,
        intervaloHoras: d.tipo === 'INTERVALO' ? d.intervaloHoras : null,
        primeiraDose: d.tipo === 'INTERVALO' ? d.primeiraDose : null,
        horarios: d.tipo === 'INTERVALO' ? null : horarios,
        inicio: d.inicio,
        fim: d.fim,
      },
    };
    const salvo = await tentar(() => (remedio
      ? chamar('PUT', `/medicamentos/${remedio.id}`, corpo)
      : chamar('POST', `/pacientes/${pacienteId}/medicamentos`, corpo)));
    if (salvo) { mostrarAviso('Remédio salvo.'); recarregar(); }
  });
  return form;
}

function formularioPaciente(p, recarregar) {
  const form = el('form', { class: 'cartao', novalidate: true },
    el('h2', {}, 'Editar dados'),
    campo('Nome', el('input', { name: 'nome', value: p.nome })),
    campo('Data de nascimento', el('input', { name: 'dataNascimento', type: 'date', value: p.dataNascimento || '' })),
    campo('Condição', el('input', { name: 'condicao', value: p.condicao || '' })),
    el('label', { class: 'caixa campo' }, el('input', { type: 'checkbox', name: 'precisa24h', checked: p.precisa24h }), 'Precisa de alguém por perto 24 horas'),
    campo('Observações', el('textarea', { name: 'observacoes' }, p.observacoes || '')),
    campo('Responsável legal', el('input', { name: 'responsavelNome', value: p.responsavelNome })),
    campo('Parentesco', el('input', { name: 'responsavelParentesco', value: p.responsavelParentesco })),
    el('div', { class: 'linha-botoes' },
      el('button', { type: 'submit' }, 'Salvar'),
      el('button', { type: 'button', class: 'secundario', onclick: () => form.remove() }, 'Cancelar')));
  form.addEventListener('submit', async (evento) => {
    evento.preventDefault();
    const salvo = await tentar(() => chamar('PUT', `/pacientes/${p.id}`, lerFormulario(form)));
    if (salvo) { await tentar(carregarContexto); mostrarAviso('Dados salvos.'); recarregar(); }
  });
  return form;
}

registrarTela('/mais/paciente', async (conteudo) => {
  const atual = pacienteAtual();
  const [p, remedios] = await Promise.all([
    chamar('GET', `/pacientes/${atual.id}`),
    chamar('GET', `/pacientes/${atual.id}/medicamentos`),
  ]);
  const coord = souCoordenador();
  const recarregar = () => ir('/mais/paciente');
  const area = el('div');

  preencher(conteudo,
    voltar(),
    cabecalho(p.nome, p.condicao),
    el('nav', { class: 'paciente-atalhos', 'aria-label': 'Ações do paciente' },
      el('a', { href: '#/escala' }, 'Ver escala'),
      el('a', { href: '#/mais/pessoas' }, 'Pessoas da rede'),
      el('a', { href: '#/novo-paciente?origem=paciente' }, 'Cadastrar outro paciente')),
    el('div', { class: 'cartao mais-ficha' },
      el('h2', {}, 'Dados da pessoa cuidada'),
      p.dataNascimento ? el('p', {}, el('strong', {}, 'Nascimento: '), formatarData(p.dataNascimento) + '/' + p.dataNascimento.slice(0, 4)) : null,
      el('p', {}, el('strong', {}, 'Acompanhamento 24 h: '), p.precisa24h ? 'sim' : 'não'),
      p.observacoes ? el('p', {}, el('strong', {}, 'Observações: '), p.observacoes) : null,
      el('p', {}, el('strong', {}, 'Responsável legal: '), `${p.responsavelNome} (${p.responsavelParentesco})`),
      coord ? el('button', { class: 'secundario pequeno', onclick: () => area.replaceChildren(formularioPaciente(p, recarregar)) }, 'Editar dados') : null),
    area,
    el('section', { class: 'cartao', 'aria-labelledby': 't-rem' },
      el('h2', { id: 't-rem' }, 'Remédios'),
      remedios.length ? el('ul', { class: 'lista' }, remedios.map((m) => el('li', {},
        el('div', {},
          el('strong', {}, `${m.nome} ${m.dosagem || ''}`), m.ativo ? '' : ' (suspenso)', el('br'),
          el('span', { class: 'detalhe' }, descreverRegra(m.regra)),
          m.instrucoes ? el('div', { class: 'detalhe' }, m.instrucoes) : null),
        coord ? el('div', { class: 'linha-botoes' },
          el('button', { class: 'pequeno secundario', onclick: () => area.replaceChildren(formularioRemedio(p.id, m, recarregar)) }, 'Editar'),
          el('button', {
            class: 'pequeno secundario',
            onclick: async () => {
              if (!window.confirm(`Excluir ${m.nome}? O histórico de doses dele também será apagado.`)) return;
              if (await tentar(() => chamar('DELETE', `/medicamentos/${m.id}`)) !== undefined) recarregar();
            },
          }, 'Excluir')) : null))) : el('p', {}, 'Nenhum remédio cadastrado.'),
      coord ? el('button', { class: 'largo', onclick: () => area.replaceChildren(formularioRemedio(p.id, null, recarregar)) }, '+ Novo remédio') : null));
});

// ------------------------------------------------------------------ pessoas da rede
registrarTela('/mais/pessoas', async (conteudo) => {
  const atual = pacienteAtual();
  const coord = souCoordenador();
  const [p, membros] = await Promise.all([
    chamar('GET', `/pacientes/${atual.id}`),
    chamar('GET', `/pacientes/${atual.id}/membros`),
  ]);
  const recarregar = () => ir('/mais/pessoas');

  preencher(conteudo,
    voltar(),
    cabecalho('Pessoas da rede', `Quem cuida de ${p.nome}.`),
    coord ? el('div', { class: 'cartao mais-convite' },
      el('h2', {}, 'Convidar alguém'),
      el('p', {}, 'Passe este código para a pessoa. Ela cria a conta e toca em "Entrar com código".'),
      el('p', { class: 'numero-grande mais-codigo' }, p.codigoConvite),
      el('button', {
        class: 'secundario pequeno',
        onclick: async () => {
          if (!window.confirm('Gerar um código novo? O código antigo deixa de funcionar.')) return;
          if (await tentar(() => chamar('POST', `/pacientes/${p.id}/convite`))) recarregar();
        },
      }, 'Gerar novo código')) : null,
    el('section', { class: 'cartao', 'aria-labelledby': 't-mem' },
      el('h2', { id: 't-mem' }, `Quem cuida de ${p.nome}`),
      el('ul', { class: 'lista' }, membros.map((m) => el('li', {},
        el('div', {},
          el('strong', {}, m.nome), m.pessoaId === estado.pessoa.id ? ' (você)' : '', el('br'),
          el('span', { class: 'detalhe' }, `${PAPEL[m.papel]} · ${VINCULO[m.vinculo]} · ${Math.round(m.horas7d)} h nos últimos 7 dias`)),
        coord && m.pessoaId !== estado.pessoa.id ? el('div', { class: 'linha-botoes' },
          el('button', {
            class: 'pequeno secundario',
            onclick: async () => {
              const papel = m.papel === 'COORDENADOR' ? 'MEMBRO' : 'COORDENADOR';
              if (await tentar(() => chamar('PUT', `/pacientes/${p.id}/membros/${m.pessoaId}`, { papel }))) recarregar();
            },
          }, m.papel === 'COORDENADOR' ? 'Tirar coordenação' : 'Tornar coordenador(a)'),
          el('button', {
            class: 'pequeno secundario',
            onclick: async () => {
              if (!window.confirm(`Tirar ${m.nome} da rede? Os registros que a pessoa fez continuam.`)) return;
              if (await tentar(() => chamar('DELETE', `/pacientes/${p.id}/membros/${m.pessoaId}`)) !== undefined) recarregar();
            },
          }, 'Remover')) : null)))));
});

// ------------------------------------------------------------------ sinais vitais
let graficosSinais = [];

function graficoSinal(tipo, medicoes, faixa) {
  const canvas = el('canvas', { role: 'img', 'aria-label': `Gráfico de ${TIPOS_SINAL[tipo].nome} nos últimos 30 dias` });
  const caixa = el('div', { class: 'grafico' }, canvas);
  if (!window.Chart || !medicoes.length) return null;
  const fora = (m) => faixa && ((faixa.minimo != null && m.valor < faixa.minimo) || (faixa.maximo != null && m.valor > faixa.maximo));
  const rotulos = medicoes.map((m) => formatarData(m.medidoEm));
  const conjuntos = [{
    label: TIPOS_SINAL[tipo].nome + (tipo === 'PRESSAO' ? ' (máxima)' : ''),
    data: medicoes.map((m) => m.valor),
    borderColor: '#2a78d6', backgroundColor: '#2a78d6', borderWidth: 2, tension: 0.2,
    pointRadius: medicoes.map((m) => (fora(m) ? 6 : 3)),
    pointBackgroundColor: medicoes.map((m) => (fora(m) ? '#d03b3b' : '#2a78d6')),
    pointBorderColor: '#ffffff', pointBorderWidth: 2,
  }];
  if (faixa?.maximo != null) {
    conjuntos.push({ label: 'Limite máximo', data: medicoes.map(() => faixa.maximo), borderColor: '#898781', borderDash: [6, 4], borderWidth: 1, pointRadius: 0 });
  }
  if (faixa?.minimo != null) {
    conjuntos.push({ label: 'Limite mínimo', data: medicoes.map(() => faixa.minimo), borderColor: '#898781', borderDash: [6, 4], borderWidth: 1, pointRadius: 0 });
  }
  requestAnimationFrame(() => {
    graficosSinais.push(new window.Chart(canvas, {
      type: 'line',
      data: { labels: rotulos, datasets: conjuntos },
      options: {
        responsive: true, maintainAspectRatio: false, animation: false,
        interaction: { mode: 'index', intersect: false },
        plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, color: '#55625c' } } },
        scales: {
          x: { grid: { display: false }, ticks: { maxTicksLimit: 6, color: '#55625c' } },
          y: { grid: { color: '#e1e0d9' }, ticks: { color: '#55625c' }, title: { display: true, text: TIPOS_SINAL[tipo].unidade, color: '#55625c' } },
        },
      },
    }));
  });
  return caixa;
}

registrarTela('/mais/sinais', async (conteudo, parametros) => {
  graficosSinais.forEach((g) => g.destroy());
  graficosSinais = [];
  const atual = pacienteAtual();
  const tipo = parametros.tipo || 'PRESSAO';
  const hoje = new Date();
  const inicio = new Date(hoje); inicio.setDate(inicio.getDate() - 30);
  const [medicoes, faixas] = await Promise.all([
    chamar('GET', `/pacientes/${atual.id}/sinais?tipo=${tipo}&de=${isoData(inicio)}&ate=${isoData(hoje)}`),
    chamar('GET', `/pacientes/${atual.id}/faixas`),
  ]);
  const faixa = faixas.find((f) => f.tipo === tipo);
  const pressao = tipo === 'PRESSAO';
  const foraDaFaixa = medicoes.filter((m) => faixa && ((faixa.minimo != null && m.valor < faixa.minimo) || (faixa.maximo != null && m.valor > faixa.maximo)));

  const form = el('form', { class: 'cartao', novalidate: true },
    el('h2', {}, `Registrar ${TIPOS_SINAL[tipo].nome.toLowerCase()}`),
    el('div', { class: pressao ? 'grade-2' : '' },
      campo(pressao ? 'Máxima' : `Valor (${TIPOS_SINAL[tipo].unidade})`, el('input', { name: 'valor', type: 'number', step: 'any', inputmode: 'decimal' })),
      pressao ? campo('Mínima', el('input', { name: 'valor2', type: 'number', step: 'any', inputmode: 'decimal' })) : null),
    el('button', { type: 'submit' }, 'Salvar'));
  form.addEventListener('submit', async (evento) => {
    evento.preventDefault();
    const d = lerFormulario(form);
    if (!(d.valor > 0)) return tentar(() => { throw new Error('Digite um valor maior que zero.'); });
    const sinal = await tentar(() => chamar('POST', `/pacientes/${atual.id}/sinais`, { tipo, valor: d.valor, valor2: d.valor2 }));
    if (!sinal) return;
    mostrarAviso(sinal.alerta === 'FORA_DA_FAIXA' ? 'Valor fora da faixa: a rede foi avisada.'
      : sinal.alerta === 'FORA_DA_CURVA' ? 'Valor bem diferente do normal: a rede foi avisada.' : 'Medição registrada.');
    ir(`/mais/sinais?tipo=${tipo}`);
  });

  preencher(conteudo,
    voltar(),
    cabecalho('Sinais vitais', 'Registre uma medição ou consulte o histórico por tipo.'),
    campo('Tipo de medição', (() => {
      const s = el('select', {}, Object.entries(TIPOS_SINAL).map(([k, v]) => el('option', { value: k, selected: k === tipo }, v.nome)));
      s.addEventListener('change', () => ir(`/mais/sinais?tipo=${s.value}`));
      return s;
    })()),
    form,
    el('section', { class: 'cartao', 'aria-labelledby': 't-graf' },
      el('h2', { id: 't-graf' }, `${TIPOS_SINAL[tipo].nome}: últimos 30 dias`),
      faixa ? el('p', { class: 'detalhe' }, `Faixa combinada: ${faixa.minimo ?? '—'} a ${faixa.maximo ?? '—'} ${TIPOS_SINAL[tipo].unidade}`) : null,
      graficoSinal(tipo, medicoes, faixa) || el('p', {}, 'Nenhuma medição nos últimos 30 dias.'),
      foraDaFaixa.length ? el('p', { class: 'mais-sinal-alerta' }, icone('alerta'), el('strong', {}, ' Fora da faixa: '),
        foraDaFaixa.map((m) => `${formatarData(m.medidoEm)} ${formatarHora(m.medidoEm)} (${m.valor}${m.valor2 ? '/' + m.valor2 : ''})`).join('; ')) : null,
      medicoes.length ? el('details', {}, el('summary', {}, 'Ver em tabela'),
        el('div', { class: 'tabela-rolagem' }, el('table', {},
          el('thead', {}, el('tr', {}, el('th', {}, 'Quando'), el('th', {}, 'Valor'), el('th', {}, 'Quem mediu'))),
          el('tbody', {}, [...medicoes].reverse().map((m) => el('tr', {},
            el('td', {}, `${formatarData(m.medidoEm)} ${formatarHora(m.medidoEm)}`),
            el('td', {}, `${m.valor}${m.valor2 ? '/' + m.valor2 : ''}`),
            el('td', {}, m.medidoPorNome || '—'))))))) : null));
});

// ------------------------------------------------------------------ tarefas de cuidado
function formularioTarefa(pacienteId, tarefa, recarregar) {
  const form = el('form', { class: 'cartao', novalidate: true },
    el('h2', {}, tarefa ? 'Editar tarefa' : 'Nova tarefa'),
    campo('Tarefa', el('input', { name: 'titulo', value: tarefa?.titulo || '', placeholder: 'Ex.: Mudar de posição' })),
    campo('Como fazer', el('textarea', { name: 'orientacao' }, tarefa?.orientacao || '')),
    el('div', { class: 'grade-2' },
      campo('Repetir a cada (horas)', el('input', { name: 'recorrenciaHoras', type: 'number', min: '1', max: '24', value: tarefa?.recorrenciaHoras ?? 24 })),
      campo('Primeira vez', el('input', { name: 'primeiraVez', type: 'time', value: tarefa?.primeiraVez || '08:00' }))),
    campo('É uma medição?', el('select', { name: 'tipoSinal' },
      el('option', { value: '' }, 'Não'),
      Object.entries(TIPOS_SINAL).map(([k, v]) => el('option', { value: k, selected: tarefa?.tipoSinal === k }, `Sim: ${v.nome}`)))),
    el('div', { class: 'linha-botoes' },
      el('button', { type: 'submit' }, 'Salvar'),
      el('button', { type: 'button', class: 'secundario', onclick: () => form.remove() }, 'Cancelar')));
  form.addEventListener('submit', async (evento) => {
    evento.preventDefault();
    const d = lerFormulario(form);
    if (!d.titulo) return tentar(() => { throw new Error('Dê um nome para a tarefa.'); });
    const corpo = { ...d, ativa: true };
    const salvo = await tentar(() => (tarefa ? chamar('PUT', `/tarefas/${tarefa.id}`, corpo) : chamar('POST', `/pacientes/${pacienteId}/tarefas`, corpo)));
    if (salvo) { mostrarAviso('Tarefa salva.'); recarregar(); }
  });
  return form;
}

registrarTela('/mais/tarefas', async (conteudo) => {
  const atual = pacienteAtual();
  const tarefas = await chamar('GET', `/pacientes/${atual.id}/tarefas`);
  const coord = souCoordenador();
  const recarregar = () => ir('/mais/tarefas');
  const area = el('div');
  preencher(conteudo,
    voltar(),
    cabecalho('Tarefas de cuidado', 'Aparecem na tela Hoje de quem estiver no turno.'),
    area,
    el('div', { class: 'cartao mais-ficha' }, tarefas.length ? el('ul', { class: 'lista' }, tarefas.map((t) => el('li', {},
      el('div', {},
        el('strong', {}, t.titulo), t.tipoSinal ? ` (medição: ${TIPOS_SINAL[t.tipoSinal].nome})` : '', el('br'),
        el('span', { class: 'detalhe' }, t.recorrenciaHoras === 24 ? `Uma vez por dia, às ${t.primeiraVez}` : `A cada ${t.recorrenciaHoras} h, a partir das ${t.primeiraVez}`),
        t.orientacao ? el('details', {}, el('summary', {}, 'Como fazer'), el('p', { class: 'detalhe' }, t.orientacao)) : null),
      coord ? el('div', { class: 'linha-botoes' },
        el('button', { class: 'pequeno secundario', onclick: () => area.replaceChildren(formularioTarefa(atual.id, t, recarregar)) }, 'Editar'),
        el('button', {
          class: 'pequeno secundario',
          onclick: async () => {
            if (!window.confirm(`Excluir a tarefa "${t.titulo}"?`)) return;
            if (await tentar(() => chamar('DELETE', `/tarefas/${t.id}`)) !== undefined) recarregar();
          },
        }, 'Excluir')) : null))) : el('p', {}, 'Nenhuma tarefa cadastrada.')),
    coord ? el('button', { class: 'largo', onclick: () => area.replaceChildren(formularioTarefa(atual.id, null, recarregar)) }, '+ Nova tarefa') : null);
});

// ------------------------------------------------------------------ dados coletados (LGPD)
const DADOS_COLETADOS = [
  ['Seu cadastro: nome, e-mail, telefone, data de nascimento, gênero (opcional)', 'Entrar no sistema e identificar quem fez cada registro', 'Você e as pessoas das suas redes (só o nome)', 'Enquanto a conta existir'],
  ['Senha', 'Proteger sua conta. Guardada só como "hash" (embaralhada); ninguém consegue lê-la', 'Ninguém', 'Enquanto a conta existir'],
  ['Dados da pessoa cuidada: nome, condição, observações, responsável legal', 'Organizar o cuidado', 'Membros da rede', 'Enquanto a rede existir'],
  ['Escala de turnos', 'Dividir o cuidado e evitar sobrecarga', 'Membros da rede', 'Enquanto a rede existir'],
  ['Remédios e doses dadas (quem, quando)', 'Não perder nem repetir dose; medir a adesão', 'Membros da rede', 'Enquanto a rede existir'],
  ['Sinais vitais (pressão, glicemia...)', 'Acompanhar a saúde e avisar valores fora do normal', 'Membros da rede', 'Enquanto a rede existir'],
  ['Tarefas de cuidado feitas', 'Garantir a rotina (ex.: mudar de posição para evitar escara)', 'Membros da rede', 'Enquanto a rede existir'],
  ['Questionário de bem-estar (Escala Zarit) e sono', 'Perceber a sobrecarga de quem cuida', 'Só você (o coordenador vê se você escolher compartilhar)', 'Até você apagar ou excluir a conta'],
  ['Sessão de login', 'Permitir que você continue usando sua conta', 'Ninguém', '7 dias'],
  ['Auditoria (quem alterou o quê e quando)', 'Segurança e rastreabilidade', 'Equipe técnica, só em caso de problema', '6 meses'],
  ['Banco ao vivo (comandos recentes)', 'Demonstração técnica', 'Quem abrir a tela', 'Só na memória; some ao reiniciar o sistema'],
];

registrarTela('/mais/dados', (conteudo) => {
  preencher(conteudo,
    voltar(),
    cabecalho('Dados coletados', 'Veja quais dados o CuidaQuemCuida guarda, quem pode ver e por quanto tempo.'),
    el('ul', { class: 'lista cartao', 'aria-label': 'Dados coletados pelo CuidaQuemCuida' },
      DADOS_COLETADOS.map(([dado, porque, quem, tempo]) => el('li', { style: 'display:block' },
        el('strong', {}, dado),
        el('div', { class: 'detalhe' }, el('strong', {}, 'Por quê: '), porque),
        el('div', { class: 'detalhe' }, el('strong', {}, 'Quem vê: '), quem),
        el('div', { class: 'detalhe' }, el('strong', {}, 'Por quanto tempo: '), tempo)))),
    el('div', { class: 'cartao' },
      el('h2', {}, 'Seus direitos (LGPD)'),
      el('ul', {},
        el('li', {}, el('strong', {}, 'Base legal: '), 'consentimento específico para dados de saúde (art. 11, I). Para a pessoa cuidada, dado pelo responsável legal.'),
        el('li', {}, el('strong', {}, 'Ver seus dados: '), el('a', { href: '#/mais/conta' }, 'Minha conta'), '.'),
        el('li', {}, el('strong', {}, 'Excluir sua conta: '), 'também em Minha conta. Seu nome é removido dos registros e suas respostas de bem-estar são apagadas.'),
        el('li', {}, el('strong', {}, 'Onde ficam: '), 'em servidores no Brasil (São Paulo).'),
        el('li', {}, el('strong', {}, 'Segurança: '), 'senhas com hash, acesso só por login, cada pessoa vê só a rede de que faz parte.'))),
    el('p', { class: 'detalhe' }, 'O CuidaQuemCuida organiza e orienta. Não substitui orientação médica.'));
});

// ------------------------------------------------------------------ banco ao vivo
registrarTela('/mais/banco', async (conteudo) => {
  const lista = el('ul', { class: 'sql-lista', 'aria-live': 'polite' });
  async function atualizar() {
    const entradas = await chamar('GET', '/demo/sql').catch(() => null);
    if (!entradas) return;
    lista.replaceChildren(...entradas.map((s) => el('li', {},
      el('span', { class: `tipo-sql tipo-${s.tipo}` }, s.tipo), ' ',
      el('span', { class: 'detalhe' }, `${formatarHora(s.quando)} · ${s.ms} ms`),
      el('code', {}, s.sql))));
  }
  await atualizar();
  const temporizador = setInterval(() => {
    if (!location.hash.startsWith('#/mais/banco')) { clearInterval(temporizador); return; }
    atualizar();
  }, 2000);

  preencher(conteudo,
    voltar(),
    cabecalho('Banco ao vivo', 'Comandos SQL recentes, atualizados a cada 2 segundos. Os valores são enviados separadamente e aparecem como "?".'),
    MODO === 'demo' ? el('p', { class: 'detalhe' }, 'No modo demonstração, os comandos são simulados.') : null,
    el('div', { class: 'cartao' }, lista));
});

// ------------------------------------------------------------------ minha conta
registrarTela('/mais/conta', async (conteudo) => {
  const eu = await chamar('GET', '/pessoas/eu');
  preencher(conteudo,
    voltar(),
    cabecalho('Minha conta'),
    el('div', { class: 'cartao mais-ficha' },
      el('h2', {}, 'Meus dados'),
      el('p', {}, el('strong', {}, 'Nome: '), eu.nome),
      el('p', {}, el('strong', {}, 'E-mail: '), eu.email),
      el('p', {}, el('strong', {}, 'Telefone: '), eu.telefone || '—'),
      el('p', {}, el('strong', {}, 'Nascimento: '), eu.dataNascimento ? paraData(eu.dataNascimento + 'T00:00:00').toLocaleDateString('pt-BR') : '—'),
      el('p', {}, el('strong', {}, 'Redes: '), eu.redes.map((r) => `${r.pacienteNome} (${PAPEL[r.papel]})`).join(', ') || '—')),
    el('div', { class: 'cartao' },
      el('h2', {}, 'Excluir minha conta'),
      el('p', {}, 'Seu nome, e-mail, telefone e senha são apagados, e você sai de todas as redes. ',
        'Os registros de cuidado que você fez continuam, como "Pessoa removida", para a família não perder o histórico. ',
        'Suas respostas de bem-estar são apagadas de verdade.'),
      el('button', {
        class: 'perigo',
        onclick: async () => {
          if (!window.confirm('Tem certeza? Isso não pode ser desfeito.')) return;
          if (await tentar(() => chamar('DELETE', '/pessoas/eu')) === undefined) return;
          limparSessao();
          mostrarAviso('Sua conta foi excluída.');
          ir('/login');
        },
      }, 'Excluir minha conta')));
});
