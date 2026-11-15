// Tela "Escala": a semana de turnos, com turnos vagos, conflitos e sobrecarga.
import { chamar } from '../api.js';
import { estado, pacienteAtual, souCoordenador } from '../estado.js';
import { registrarTela, ir } from '../rotas.js';
import { icone } from '../icones.js';
import {
  el, preencher, campo, lerFormulario, tentar, mostrarAviso, formatarIntervalo, formatarDiaSemana, formatarData, paraData, isoData, isoLocal,
} from '../ui.js';

const NIVEL = { ATENCAO: 'Atenção', ALERTA: 'Alerta' };

function horarioTurno(inicio, fim) {
  const intervalo = formatarIntervalo(inicio, fim);
  return inicio.slice(0, 10) === fim.slice(0, 10) ? intervalo : `${intervalo.replace('–', ' até ')} de ${formatarData(fim)}`;
}

/** Segunda-feira da semana (deslocada em N semanas). */
function inicioDaSemana(deslocamento) {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  const diaSemana = d.getDay() === 0 ? 7 : d.getDay();
  d.setDate(d.getDate() - (diaSemana - 1) + deslocamento * 7);
  return d;
}

function somarDias(data, dias) {
  const d = new Date(data);
  d.setDate(d.getDate() + dias);
  return d;
}

function avisosSobrecarga(analise) {
  const membros = analise.sobrecarga;
  return membros.filter((s) => s.nivel !== 'OK').map((s) => {
    const ajudantes = membros.filter((m) => m.pessoaId !== s.pessoaId && m.nivel === 'OK')
      .sort((a, b) => a.horas7d - b.horas7d).slice(0, 2);
    const nome = s.pessoaId === estado.pessoa.id ? 'Você' : s.nome;
    return el('li', {},
      el('strong', {}, `${nome} · ${NIVEL[s.nivel]}`),
      el('p', {}, `${Math.round(s.horas7d)} h nos últimos 7 dias · ${Math.round(s.horasSeguidas)} h seguidas sem folga`),
      ajudantes.length ? el('p', {}, `Quem pode ajudar: ${ajudantes.map((a) => `${a.nome.split(' ')[0]} (${Math.round(a.horas7d)} h)`).join(', ')}`) : null);
  });
}

function avisosConflito(analise) {
  return analise.conflitos.map((c) => el('div', { class: 'alerta', role: 'alert' },
    el('span', {}, `Conflito: ${c.turnoA.pessoaNome} tem dois turnos ao mesmo tempo (${formatarDiaSemana(c.turnoA.inicio)}, `
      + `${horarioTurno(c.turnoA.inicio, c.turnoA.fim)} e ${horarioTurno(c.turnoB.inicio, c.turnoB.fim)}).`)));
}

async function mostrarSugestoes(turno, alvo) {
  const sugestoes = await tentar(() => chamar('GET', `/turnos/${turno.id}/sugestoes`));
  if (!sugestoes) return;
  alvo.replaceChildren(el('p', { class: 'detalhe' }, sugestoes.length
    ? 'Sugestão (menos carregados primeiro): ' + sugestoes.map((s) => `${s.nome} (${Math.round(s.horas7d)} h)`).join(', ')
    : 'Ninguém da rede está livre nesse horário.'));
}

function linhaTurno(turno, recarregar) {
  const meu = turno.pessoaId === estado.pessoa.id;
  const vago = !turno.pessoaId;
  const horario = horarioTurno(turno.inicio, turno.fim);
  const sugestoes = el('div', { 'aria-live': 'polite' });
  const cobrir = vago
    ? el('button', {
      class: 'pequeno',
      onclick: async () => {
        const ok = await tentar(() => chamar('POST', `/turnos/${turno.id}/assumir`));
        if (ok) { mostrarAviso('Obrigado! O turno agora é seu.'); recarregar(); }
      },
    }, 'Posso cobrir')
    : null;
  const acoes = souCoordenador()
    ? el('details', { class: 'turno-opcoes' },
      el('summary', { 'aria-label': `Opções do turno ${formatarDiaSemana(turno.inicio)}, ${horario}` }, 'Opções', icone('seta')),
      el('div', { class: 'turno-opcoes-itens' },
        vago ? el('button', { class: 'escala-acao-texto', onclick: () => mostrarSugestoes(turno, sugestoes) }, 'Quem pode cobrir?') : null,
        el('button', {
          class: 'escala-acao-texto turno-excluir',
          onclick: async () => {
            if (!window.confirm('Excluir este turno?')) return;
            if (await tentar(() => chamar('DELETE', `/turnos/${turno.id}`)) !== undefined) recarregar();
          },
        }, 'Excluir turno'),
        sugestoes))
    : null;
  return el('div', { class: 'turno' + (vago ? ' vago' : '') + (meu ? ' meu' : '') },
    el('div', { class: 'turno-info' },
      el('strong', {}, horario),
      el('span', {}, vago ? 'Turno vago' : (meu ? 'Seu turno' : turno.pessoaNome)),
      turno.noturno ? el('span', { class: 'turno-noturno' }, icone('lua'), 'Turno noturno') : null),
    cobrir, acoes);
}

function linhaVago(intervalo, pacienteId, recarregar) {
  return el('div', { class: 'turno vago' },
    el('div', { class: 'turno-info' }, el('strong', {}, horarioTurno(intervalo.inicio, intervalo.fim)),
      el('span', {}, 'Turno vago')),
    el('button', {
      class: 'pequeno',
      onclick: async () => {
        const ok = await tentar(() => chamar('POST', `/pacientes/${pacienteId}/turnos`,
          { pessoaId: estado.pessoa.id, inicio: intervalo.inicio, fim: intervalo.fim }));
        if (ok) { mostrarAviso('Obrigado! O turno agora é seu.'); recarregar(); }
      },
    }, 'Posso cobrir'));
}

function formularioNovoTurno(pacienteId, membros, recarregar, aoCancelar, dataInicial, pessoaInicial) {
  const form = el('form', { class: 'cartao', novalidate: true },
    el('h2', {}, 'Novo turno'),
    campo('Quem', el('select', { name: 'pessoaId' },
      el('option', { value: '' }, 'Deixar vago'),
      membros.map((m) => el('option', { value: m.pessoaId, selected: m.pessoaId === pessoaInicial }, m.nome)))),
    campo('Dia', el('input', { name: 'dia', type: 'date', value: dataInicial, required: true })),
    el('div', { class: 'grade-2' },
      campo('Início', el('input', { name: 'inicio', type: 'time', value: '14:00', required: true })),
      campo('Fim', el('input', { name: 'fim', type: 'time', value: '22:00', required: true }))),
    el('p', { class: 'ajuda' }, 'Se o fim for menor que o início (ex.: 22h às 6h), o turno termina no dia seguinte.'),
    el('div', { class: 'linha-botoes' },
      el('button', { type: 'submit' }, 'Salvar turno'),
      el('button', { type: 'button', class: 'secundario', onclick: aoCancelar }, 'Cancelar')));

  form.addEventListener('submit', async (evento) => {
    evento.preventDefault();
    const dados = lerFormulario(form);
    if (!dados.dia || !dados.inicio || !dados.fim) return tentar(() => { throw new Error('Preencha dia, início e fim.'); });
    const inicio = paraData(`${dados.dia}T${dados.inicio}:00`);
    let fim = paraData(`${dados.dia}T${dados.fim}:00`);
    if (fim <= inicio) fim = somarDias(fim, 1);
    try {
      await chamar('POST', `/pacientes/${pacienteId}/turnos`, {
        pessoaId: dados.pessoaId ? Number(dados.pessoaId) : null, inicio: isoLocal(inicio), fim: isoLocal(fim),
      });
      mostrarAviso('Turno criado.');
      recarregar();
    } catch (erro) {
      const conflitos = erro.dados?.conflitos || [];
      tentar(() => {
        throw new Error(erro.message + (conflitos.length
          ? ` (${conflitos.map((c) => `${formatarData(c.inicio)} ${formatarIntervalo(c.inicio, c.fim)}`).join('; ')})` : ''));
      });
    }
  });
  return form;
}

registrarTela('/escala', async (conteudo, parametros) => {
  const paciente = pacienteAtual();
  const meus = parametros.visao === 'meus';
  const semana = Number(parametros.semana || 0);
  const candidata = inicioDaSemana(semana);
  const deslocamento = Number.isInteger(semana) && Number.isFinite(candidata.getTime()) ? semana : 0;
  const segunda = deslocamento === semana ? candidata : inicioDaSemana(0);
  const domingo = somarDias(segunda, 6);
  const de = isoData(segunda);
  const ate = isoData(domingo);
  function rotaEscala(numero, pessoais = meus) {
    const consulta = new URLSearchParams();
    if (numero) consulta.set('semana', numero);
    if (pessoais) consulta.set('visao', 'meus');
    return consulta.size ? `/escala?${consulta}` : '/escala';
  }
  const recarregar = () => ir(rotaEscala(deslocamento));

  const [turnos, analise, membros] = await Promise.all([
    chamar('GET', `/pacientes/${paciente.id}/turnos?de=${de}&ate=${ate}`),
    chamar('GET', `/pacientes/${paciente.id}/escala/analise?de=${de}&ate=${ate}`),
    souCoordenador() ? chamar('GET', `/pacientes/${paciente.id}/membros`) : Promise.resolve([]),
  ]);

  const dias = [];
  const diasVazios = [];
  const turnosVisiveis = meus ? turnos.filter((turno) => turno.pessoaId === estado.pessoa.id) : turnos;
  const vagosVisiveis = meus ? [] : analise.vagos;
  const agora = new Date();
  const hoje = isoData(agora);
  for (let i = 0; i < 7; i++) {
    const dia = isoData(somarDias(segunda, i));
    const doDia = turnosVisiveis.filter((t) => t.inicio.startsWith(dia)).map((t) => ({ hora: t.inicio, no: linhaTurno(t, recarregar) }));
    const vagosDoDia = vagosVisiveis.filter((v) => v.inicio.startsWith(dia) && paraData(v.fim) > agora)
      .map((v) => ({ hora: v.inicio, no: linhaVago(v, paciente.id, recarregar) }));
    const linhas = [...doDia, ...vagosDoDia].sort((a, b) => a.hora.localeCompare(b.hora)).map((x) => x.no);
    if (!linhas.length) {
      diasVazios.push(dia);
      continue;
    }
    dias.push(el('section', { class: 'dia-escala', 'aria-labelledby': `dia-${dia}` },
      el('h2', { id: `dia-${dia}` }, el('span', { class: 'dia-data' }, formatarDiaSemana(dia)),
        dia === hoje ? el('span', { class: 'dia-hoje' }, 'Hoje') : null),
      linhas));
  }

  const areaFormulario = el('div', { id: 'novo-turno-formulario' });
  const sobrecarga = avisosSobrecarga(analise);
  function fecharFormulario() {
    areaFormulario.replaceChildren();
    novoTurno.setAttribute('aria-expanded', 'false');
    novoTurno.focus();
  }
  const novoTurno = souCoordenador() ? el('button', {
    type: 'button', class: 'pequeno', 'aria-expanded': 'false', 'aria-controls': areaFormulario.id,
    onclick: () => {
      if (areaFormulario.firstChild) return fecharFormulario();
      const dataInicial = hoje >= de && hoje <= ate ? hoje : de;
      const formulario = formularioNovoTurno(paciente.id, membros, recarregar, fecharFormulario,
        dataInicial, meus ? estado.pessoa.id : null);
      areaFormulario.replaceChildren(formulario);
      novoTurno.setAttribute('aria-expanded', 'true');
      formulario.elements.pessoaId.focus();
    },
  }, 'Novo turno') : null;
  preencher(conteudo,
    el('header', { class: 'escala-cabecalho' },
      el('div', {}, el('h1', {}, 'Escala'), el('p', {}, paciente.nome)),
      novoTurno),
    areaFormulario,
    el('nav', { class: 'escala-filtros', 'aria-label': 'Quais turnos exibir' },
      el('a', { href: '#' + rotaEscala(deslocamento, false), 'aria-current': meus ? null : 'page' }, 'Todos os turnos'),
      el('a', { href: '#' + rotaEscala(deslocamento, true), 'aria-current': meus ? 'page' : null }, 'Meus turnos')),
    el('nav', { class: 'semana-nav', 'aria-label': 'Semanas da escala' },
      el('a', { class: 'semana-seta', href: '#' + rotaEscala(deslocamento - 1), 'aria-label': 'Semana anterior' }, icone('seta', 'seta-esquerda')),
      el('div', {}, el('strong', {}, `${formatarData(de)} a ${formatarData(ate)}`),
        deslocamento ? el('a', { href: '#' + rotaEscala(0) }, 'Semana atual') : null),
      el('a', { class: 'semana-seta', href: '#' + rotaEscala(deslocamento + 1), 'aria-label': 'Próxima semana' }, icone('seta', 'seta-direita'))),
    ...avisosConflito(analise),
    sobrecarga.length ? el('details', { class: 'escala-sobrecarga' },
      el('summary', {}, icone('alerta'), `Sobrecarga na rede · ${sobrecarga.length} ${sobrecarga.length === 1 ? 'pessoa' : 'pessoas'}`, icone('seta')),
      el('ul', {}, sobrecarga)) : null,
    dias.length ? el('div', { class: 'semana-turnos' }, dias)
      : el('p', { class: 'escala-vazia' }, meus ? 'Você não tem turnos nesta semana.' : 'Nenhum turno marcado nesta semana.'),
    !meus && dias.length && diasVazios.length ? el('details', { class: 'escala-dias-vazios' },
      el('summary', {}, diasVazios.length === 1 ? '1 dia sem turnos' : `${diasVazios.length} dias sem turnos`),
      el('ul', {}, diasVazios.map((dia) => el('li', {}, dia === hoje ? 'Hoje' : formatarDiaSemana(dia))))) : null);
});
