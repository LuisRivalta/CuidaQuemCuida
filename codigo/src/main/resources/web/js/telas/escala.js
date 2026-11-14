// Tela "Escala": a semana de turnos, com turnos vagos, conflitos e sobrecarga.
import { chamar } from '../api.js';
import { estado, pacienteAtual, souCoordenador } from '../estado.js';
import { registrarTela, ir } from '../rotas.js';
import { icone } from '../icones.js';
import {
  el, preencher, campo, lerFormulario, tentar, mostrarAviso, formatarIntervalo, formatarDiaSemana, formatarData, paraData, isoData, isoLocal,
} from '../ui.js';

const NIVEL = { ATENCAO: 'Atenção', ALERTA: 'Alerta' };

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
    return el('div', { class: 'alerta atencao', role: 'status' },
      el('span', {},
        `${NIVEL[s.nivel]}: ${s.nome} fez ${Math.round(s.horas7d)} h nos últimos 7 dias, ${Math.round(s.horasSeguidas)} h seguidas sem folga.`,
        ajudantes.length ? el('br') : null,
        ajudantes.length ? `Quem pode ajudar: ${ajudantes.map((a) => `${a.nome.split(' ')[0]} (${Math.round(a.horas7d)} h)`).join(', ')}.` : null));
  });
}

function avisosConflito(analise) {
  return analise.conflitos.map((c) => el('div', { class: 'alerta', role: 'alert' },
    el('span', {}, `Conflito: ${c.turnoA.pessoaNome} tem dois turnos ao mesmo tempo (${formatarDiaSemana(c.turnoA.inicio)}, `
      + `${formatarIntervalo(c.turnoA.inicio, c.turnoA.fim)} e ${formatarIntervalo(c.turnoB.inicio, c.turnoB.fim)}).`)));
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
  const sugestoes = el('div');
  const acoes = el('div', { class: 'linha-botoes' });
  if (vago) {
    acoes.append(el('button', {
      class: 'pequeno',
      onclick: async () => {
        const ok = await tentar(() => chamar('POST', `/turnos/${turno.id}/assumir`));
        if (ok) { mostrarAviso('Obrigado! O turno agora é seu.'); recarregar(); }
      },
      }, 'Posso cobrir'));
    if (souCoordenador()) acoes.append(el('button', { class: 'pequeno secundario', onclick: () => mostrarSugestoes(turno, sugestoes) }, 'Quem pode?'));
  }
  if (souCoordenador()) {
    acoes.append(el('button', {
      class: 'pequeno secundario', 'aria-label': `Excluir turno ${formatarIntervalo(turno.inicio, turno.fim)}`,
      onclick: async () => {
        if (!window.confirm('Excluir este turno?')) return;
        if (await tentar(() => chamar('DELETE', `/turnos/${turno.id}`)) !== undefined) recarregar();
      },
    }, 'Excluir'));
  }
  return el('div', {},
    el('div', { class: 'turno' + (vago ? ' vago' : '') + (meu ? ' meu' : '') },
      el('div', { class: 'turno-info' },
        el('strong', {}, formatarIntervalo(turno.inicio, turno.fim)),
        el('span', {}, vago ? 'Turno vago' : (meu ? 'Seu turno' : turno.pessoaNome)),
        turno.noturno ? el('span', { class: 'turno-noturno' }, icone('lua'), 'Turno noturno') : null),
      acoes),
    sugestoes);
}

function linhaVago(intervalo, pacienteId, recarregar) {
  return el('div', { class: 'turno vago' },
    el('div', { class: 'turno-info' }, el('strong', {}, formatarIntervalo(intervalo.inicio, intervalo.fim)),
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

function formularioNovoTurno(pacienteId, membros, recarregar) {
  const form = el('form', { class: 'cartao', novalidate: true },
    el('h2', {}, 'Novo turno'),
    campo('Quem', el('select', { name: 'pessoaId' },
      el('option', { value: '' }, 'Deixar vago'),
      membros.map((m) => el('option', { value: m.pessoaId }, m.nome)))),
    campo('Dia', el('input', { name: 'dia', type: 'date', value: isoData(new Date()), required: true })),
    el('div', { class: 'grade-2' },
      campo('Início', el('input', { name: 'inicio', type: 'time', value: '14:00', required: true })),
      campo('Fim', el('input', { name: 'fim', type: 'time', value: '22:00', required: true }))),
    el('p', { class: 'ajuda' }, 'Se o fim for menor que o início (ex.: 22h às 6h), o turno termina no dia seguinte.'),
    el('div', { class: 'linha-botoes' },
      el('button', { type: 'submit' }, 'Salvar turno'),
      el('button', { type: 'button', class: 'secundario', onclick: () => form.remove() }, 'Cancelar')));

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
  const deslocamento = Number(parametros.semana || 0);
  const segunda = inicioDaSemana(deslocamento);
  const domingo = somarDias(segunda, 6);
  const de = isoData(segunda);
  const ate = isoData(domingo);
  const recarregar = () => ir(`/escala?semana=${deslocamento}`);

  const [turnos, analise, membros] = await Promise.all([
    chamar('GET', `/pacientes/${paciente.id}/turnos?de=${de}&ate=${ate}`),
    chamar('GET', `/pacientes/${paciente.id}/escala/analise?de=${de}&ate=${ate}`),
    souCoordenador() ? chamar('GET', `/pacientes/${paciente.id}/membros`) : Promise.resolve([]),
  ]);

  const dias = [];
  for (let i = 0; i < 7; i++) {
    const dia = isoData(somarDias(segunda, i));
    const doDia = turnos.filter((t) => t.inicio.startsWith(dia)).map((t) => ({ hora: t.inicio, no: linhaTurno(t, recarregar) }));
    const vagosDoDia = analise.vagos.filter((v) => v.inicio.startsWith(dia) && paraData(v.fim) > new Date())
      .map((v) => ({ hora: v.inicio, no: linhaVago(v, paciente.id, recarregar) }));
    const linhas = [...doDia, ...vagosDoDia].sort((a, b) => a.hora.localeCompare(b.hora)).map((x) => x.no);
    const hoje = dia === isoData(new Date());
    dias.push(el('section', { class: 'dia-escala', 'aria-labelledby': `dia-${dia}` },
      el('h2', { id: `dia-${dia}` }, formatarDiaSemana(dia), hoje ? el('span', { class: 'etiqueta foco' }, 'Hoje') : null),
      linhas.length ? linhas : el('p', { class: 'detalhe' }, 'Sem turnos marcados.')));
  }

  const areaFormulario = el('div');
  preencher(conteudo,
    el('header', { class: 'escala-cabecalho' },
      el('h1', {}, 'Escala'),
      el('p', {}, `Revezamento para cuidar de ${paciente.nome}.`)),
    el('nav', { class: 'semana-nav', 'aria-label': 'Semanas da escala' },
      el('a', { class: 'botao secundario pequeno', href: `#/escala?semana=${deslocamento - 1}`, 'aria-label': 'Semana anterior' }, icone('seta', 'seta-esquerda')),
      el('div', {}, el('strong', {}, `${formatarData(de)} a ${formatarData(ate)}`),
        deslocamento ? el('a', { href: '#/escala' }, 'Voltar à semana atual') : null),
      el('a', { class: 'botao secundario pequeno', href: `#/escala?semana=${deslocamento + 1}`, 'aria-label': 'Próxima semana' }, icone('seta', 'seta-direita'))),
    ...avisosConflito(analise),
    ...avisosSobrecarga(analise),
    souCoordenador()
      ? el('button', { class: 'largo', onclick: () => areaFormulario.replaceChildren(formularioNovoTurno(paciente.id, membros, recarregar)) }, '+ Novo turno')
      : null,
    areaFormulario,
    el('div', { class: 'semana-turnos' }, dias),
    el('p', { class: 'detalhe' }, 'O turno é noturno quando inclui pelo menos 3 horas entre 22h e 6h.'));
});
